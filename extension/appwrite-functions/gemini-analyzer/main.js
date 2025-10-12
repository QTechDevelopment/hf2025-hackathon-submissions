// Appwrite Function to analyze emails using Gemini AI
// This function receives emails and a user prompt, sends them to Gemini for analysis,
// and returns which emails should be cleaned up

import { Client, Databases } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  try {
    // Parse the request body
    const { emails, prompt, userId } = JSON.parse(req.body);
    
    if (!emails || !prompt) {
      return res.json({
        success: false,
        error: 'Missing required fields: emails and prompt'
      }, 400);
    }
    
    log(`Analyzing ${emails.length} emails for user ${userId}`);
    log(`Prompt: ${prompt}`);
    
    // Initialize Appwrite client
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT)
      .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);
    
    const databases = new Databases(client);
    
    // Call Gemini API
    const geminiApiKey = process.env.GEMINI_API_KEY;
    
    if (!geminiApiKey) {
      error('GEMINI_API_KEY not configured');
      return res.json({
        success: false,
        error: 'Gemini API not configured'
      }, 500);
    }
    
    // Prepare email data for Gemini
    const emailSummaries = emails.map(email => ({
      id: email.id,
      subject: email.subject || 'No subject',
      from: email.from || 'Unknown sender',
      date: email.date || 'Unknown date',
      snippet: email.snippet || ''
    }));
    
    // Create the prompt for Gemini
    const geminiPrompt = `
You are an AI assistant helping to clean up email inboxes. 
The user has provided the following instruction:
"${prompt}"

Here are the user's emails (showing up to 50 recent emails):
${JSON.stringify(emailSummaries, null, 2)}

Based on the user's instruction, analyze these emails and determine:
1. Which emails match the user's cleanup criteria
2. What action should be taken (delete, archive, mark as read)
3. A brief explanation of why each email was selected

Respond with a JSON object in this format:
{
  "action": "delete|archive|markRead",
  "matchedEmailIds": ["id1", "id2", ...],
  "summary": "Brief explanation of the analysis",
  "reasoning": "Why these emails were selected"
}

Be conservative and only select emails that clearly match the criteria.
`;
    
    // Call Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: geminiPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
      }
    );
    
    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      error(`Gemini API error: ${geminiResponse.status} - ${errorText}`);
      return res.json({
        success: false,
        error: 'Failed to analyze emails with Gemini'
      }, 500);
    }
    
    const geminiData = await geminiResponse.json();
    
    // Extract the response text
    const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    log(`Gemini response: ${responseText}`);
    
    // Parse the JSON response from Gemini
    let analysis;
    try {
      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      error(`Failed to parse Gemini response: ${parseError.message}`);
      // Return a default analysis
      analysis = {
        action: 'delete',
        matchedEmailIds: [],
        summary: 'Unable to analyze emails automatically',
        reasoning: 'The AI response could not be parsed'
      };
    }
    
    // Get full email objects for matched IDs
    const matchedEmails = emails.filter(email => 
      analysis.matchedEmailIds.includes(email.id)
    );
    
    // Store the analysis in Appwrite Database for user history
    try {
      await databases.createDocument(
        process.env.APPWRITE_DATABASE_ID || 'default',
        process.env.APPWRITE_COLLECTION_ID || 'analyses',
        'unique()',
        {
          userId: userId,
          prompt: prompt,
          totalEmails: emails.length,
          matchedCount: matchedEmails.length,
          action: analysis.action,
          summary: analysis.summary,
          timestamp: new Date().toISOString()
        }
      );
    } catch (dbError) {
      error(`Failed to store analysis: ${dbError.message}`);
      // Continue even if storage fails
    }
    
    // Return the analysis results
    return res.json({
      success: true,
      totalEmails: emails.length,
      matchedEmails: matchedEmails,
      action: analysis.action,
      summary: analysis.summary,
      reasoning: analysis.reasoning
    });
    
  } catch (err) {
    error(`Function error: ${err.message}`);
    return res.json({
      success: false,
      error: err.message
    }, 500);
  }
};
