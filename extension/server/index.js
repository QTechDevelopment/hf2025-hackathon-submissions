const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Azure OpenAI Configuration (example - can be swapped with Gemini or other providers)
const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const AZURE_OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY;
const AZURE_OPENAI_DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4';
const AZURE_API_VERSION = process.env.AZURE_API_VERSION || '2024-02-15-preview';

/**
 * Parse natural language command into structured action
 * POST /ai/parse
 * Body: { command: string }
 * Returns: { action: string, query: string, label?: string }
 */
app.post('/ai/parse', async (req, res) => {
  try {
    const { command } = req.body;
    
    if (!command) {
      return res.status(400).json({ error: 'Command is required' });
    }
    
    // Construct prompt for AI
    const prompt = `You are an AI assistant that parses Gmail cleanup commands into structured actions.

Given a natural language command, extract:
1. action: one of "delete", "archive", "mark_read", or "label"
2. query: Gmail search query string to match emails
3. label (optional): label name if action is "label"

Command: "${command}"

Return ONLY valid JSON in this exact format:
{
  "action": "delete|archive|mark_read|label",
  "query": "gmail search query",
  "label": "label name (if applicable)"
}

Examples:
Command: "Delete promotional emails older than 6 months"
Response: {"action": "delete", "query": "category:promotions older_than:6m"}

Command: "Archive newsletters from last year"
Response: {"action": "archive", "query": "category:updates older_than:1y"}

Command: "Mark all unread LinkedIn emails as read"
Response: {"action": "mark_read", "query": "from:linkedin.com is:unread"}

Command: "Label all receipts from Amazon as Receipts"
Response: {"action": "label", "query": "from:amazon.com subject:(order OR receipt)", "label": "Receipts"}`;

    const parsed = await callAI(prompt);
    
    res.json(parsed);
  } catch (error) {
    console.error('Error parsing command:', error);
    res.status(500).json({ 
      error: 'Failed to parse command',
      message: error.message 
    });
  }
});

/**
 * Generate suggested replies for messages
 * POST /ai/suggestReplies
 * Body: { command: string, parsed: object, messages: array }
 * Returns: { suggestions: [{ text: string }] }
 */
app.post('/ai/suggestReplies', async (req, res) => {
  try {
    const { command, parsed, messages } = req.body;
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }
    
    // Limit to first 5 messages for suggestions
    const sampleMessages = messages.slice(0, 5);
    
    // Construct prompt for AI
    const messagesText = sampleMessages.map((msg, idx) => 
      `Message ${idx + 1}:
From: ${msg.from}
Subject: ${msg.subject}
Snippet: ${msg.snippet}
---`
    ).join('\n\n');
    
    const prompt = `You are an AI assistant that generates suggested email replies.

User Command: "${command || 'Cleanup emails'}"

Sample Messages:
${messagesText}

Based on these sample messages, generate 3-5 brief, professional reply suggestions that users might want to send before cleaning up these emails. Suggestions should be polite decline/unsubscribe messages, acknowledgments, or quick responses.

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "suggestions": [
    { "text": "Thank you for reaching out. I'm currently managing my inbox and won't be able to respond to this email." },
    { "text": "I appreciate your message, but I'd like to unsubscribe from future communications." },
    { "text": "Thanks for the information. I've noted this and will reach out if needed." }
  ]
}

Each suggestion should be 1-2 sentences maximum.`;

    const result = await callAI(prompt);
    
    res.json(result);
  } catch (error) {
    console.error('Error generating suggestions:', error);
    res.status(500).json({ 
      error: 'Failed to generate suggestions',
      message: error.message 
    });
  }
});

/**
 * Call Azure OpenAI API (or can be swapped with Gemini/other providers)
 * @param {string} prompt - The prompt to send
 * @returns {Promise<Object>} Parsed JSON response
 */
async function callAI(prompt) {
  if (!AZURE_OPENAI_ENDPOINT || !AZURE_OPENAI_API_KEY) {
    throw new Error('Azure OpenAI credentials not configured. Set AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_API_KEY in .env');
  }
  
  const url = `${AZURE_OPENAI_ENDPOINT}/openai/deployments/${AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=${AZURE_API_VERSION}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': AZURE_OPENAI_API_KEY
    },
    body: JSON.stringify({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that returns only valid JSON responses without markdown formatting.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 500,
      response_format: { type: 'json_object' }
    })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI API error: ${response.status} - ${errorText}`);
  }
  
  const data = await response.json();
  const content = data.choices[0].message.content;
  
  // Parse JSON response
  try {
    return JSON.parse(content);
  } catch (e) {
    console.error('Failed to parse AI response:', content);
    throw new Error('AI returned invalid JSON');
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`AI Proxy server running on port ${PORT}`);
  console.log(`Azure OpenAI configured: ${!!AZURE_OPENAI_ENDPOINT}`);
});

module.exports = app;
