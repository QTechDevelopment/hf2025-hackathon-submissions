// Background service worker for AI Email Cleaner extension
// Handles authentication and Gmail API operations

// Import gmailClient functions
importScripts('gmailClient.js');

// Configuration - Update with your server URL
const AI_SERVER_URL = 'http://localhost:3000'; // Update this to your deployed server URL

// State
let cachedToken = null;
let cachedUser = null;

// Listen for installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('AI Email Cleaner extension installed');
  } else if (details.reason === 'update') {
    console.log('AI Email Cleaner extension updated');
  }
});

// Message handlers
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { type } = request;
  
  if (type === 'checkAuth') {
    handleCheckAuth()
      .then(result => sendResponse(result))
      .catch(error => sendResponse({ user: null, error: error.message }));
    return true;
  }
  
  if (type === 'signIn') {
    handleSignIn()
      .then(result => sendResponse(result))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
  
  if (type === 'signOut') {
    handleSignOut()
      .then(result => sendResponse(result))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
  
  if (type === 'previewCommand') {
    handlePreviewCommand(request)
      .then(result => sendResponse(result))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
  
  if (type === 'executeAction') {
    handleExecuteAction(request)
      .then(result => sendResponse(result))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
  
  if (type === 'createDraftsForSuggestion') {
    handleCreateDraftsForSuggestion(request)
      .then(result => sendResponse(result))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
});

/**
 * Check authentication status
 */
async function handleCheckAuth() {
  if (cachedUser && cachedToken) {
    return { user: cachedUser };
  }
  return { user: null };
}

/**
 * Sign in with Google OAuth
 */
async function handleSignIn() {
  try {
    // Get OAuth token
    const result = await chrome.identity.getAuthToken({ interactive: true });
    cachedToken = result.token;
    
    // Get user info
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${cachedToken}` }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }
    
    const userData = await response.json();
    cachedUser = {
      email: userData.email,
      name: userData.name,
      picture: userData.picture
    };
    
    return { success: true, user: cachedUser };
  } catch (error) {
    console.error('Sign in error:', error);
    throw new Error('Failed to sign in: ' + error.message);
  }
}

/**
 * Sign out
 */
async function handleSignOut() {
  try {
    if (cachedToken) {
      await chrome.identity.removeCachedAuthToken({ token: cachedToken });
    }
    cachedToken = null;
    cachedUser = null;
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    throw new Error('Failed to sign out: ' + error.message);
  }
}

/**
 * Preview command flow
 * 1. Parse command with AI server
 * 2. List message IDs from Gmail
 * 3. Fetch message details for first N messages
 * 4. Get suggested replies from AI server
 * 5. Return everything to popup
 */
async function handlePreviewCommand(request) {
  const { command, actionOverride, labelName } = request;
  
  try {
    // Ensure we have a token
    if (!cachedToken) {
      throw new Error('Not authenticated');
    }
    
    // Step 1: Parse command with AI server
    let parsed;
    if (actionOverride) {
      // Use manual override
      parsed = {
        action: actionOverride,
        query: '', // Will search all recent emails
        label: labelName || undefined
      };
    } else {
      // Call AI server to parse
      const parseResponse = await fetch(`${AI_SERVER_URL}/ai/parse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command })
      });
      
      if (!parseResponse.ok) {
        throw new Error('Failed to parse command');
      }
      
      parsed = await parseResponse.json();
    }
    
    // Step 2: List message IDs from Gmail
    const messageIds = await listMessageIds(cachedToken, parsed.query, 100);
    const messageCount = messageIds.length;
    
    // Step 3: Fetch details for first 50 messages
    const limit = Math.min(50, messageIds.length);
    const limitedIds = messageIds.slice(0, limit).map(m => m.id);
    const messages = await getMessageDetails(cachedToken, limitedIds, 10);
    
    // Step 4: Get suggested replies (for first 5 messages)
    let suggestions = [];
    if (messages.length > 0) {
      try {
        const sampleMessages = messages.slice(0, 5);
        const suggestResponse = await fetch(`${AI_SERVER_URL}/ai/suggestReplies`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            command,
            parsed,
            messages: sampleMessages
          })
        });
        
        if (suggestResponse.ok) {
          const suggestData = await suggestResponse.json();
          suggestions = suggestData.suggestions || [];
        }
      } catch (error) {
        console.error('Failed to get suggestions:', error);
        // Non-fatal, continue without suggestions
      }
    }
    
    return {
      success: true,
      data: {
        parsed,
        messageCount,
        messages,
        suggestions
      }
    };
  } catch (error) {
    console.error('Preview command error:', error);
    throw error;
  }
}

/**
 * Execute action on selected messages
 */
async function handleExecuteAction(request) {
  const { messageIds, action, labelName } = request;
  
  try {
    // Ensure we have a token
    if (!cachedToken) {
      throw new Error('Not authenticated');
    }
    
    let labelId = null;
    
    // If action is label, ensure label exists
    if (action === 'label' && labelName) {
      labelId = await ensureLabelExists(cachedToken, labelName);
    }
    
    // Perform batch modify
    const results = await batchModify(cachedToken, messageIds, action, labelId);
    
    return {
      success: true,
      data: {
        successCount: results.success.length,
        failedCount: results.failed.length,
        totalCount: messageIds.length,
        failures: results.failed
      }
    };
  } catch (error) {
    console.error('Execute action error:', error);
    throw error;
  }
}

/**
 * Create draft replies for selected messages
 */
async function handleCreateDraftsForSuggestion(request) {
  const { messageIds, suggestionText } = request;
  
  try {
    // Ensure we have a token
    if (!cachedToken) {
      throw new Error('Not authenticated');
    }
    
    // Fetch message details to get from addresses and subjects
    const messages = await getMessageDetails(cachedToken, messageIds, 10);
    
    const results = {
      success: [],
      failed: []
    };
    
    // Create a draft for each message
    for (const message of messages) {
      try {
        // Extract recipient email from "From" header
        const fromMatch = message.from.match(/<(.+?)>/) || [null, message.from];
        const toEmail = fromMatch[1] || message.from;
        
        // Create subject line
        const subject = message.subject.startsWith('Re:') 
          ? message.subject 
          : `Re: ${message.subject}`;
        
        // Create draft
        await createDraftReply(
          cachedToken,
          message.id,
          message.threadId,
          toEmail,
          subject,
          suggestionText
        );
        
        results.success.push(message.id);
      } catch (error) {
        console.error(`Failed to create draft for message ${message.id}:`, error);
        results.failed.push({ messageId: message.id, error: error.message });
      }
    }
    
    return {
      success: true,
      data: {
        successCount: results.success.length,
        failedCount: results.failed.length,
        totalCount: messageIds.length,
        failures: results.failed
      }
    };
  } catch (error) {
    console.error('Create drafts error:', error);
    throw error;
  }
}

// Handle auth token changes
chrome.identity.onSignInChanged.addListener((account, signedIn) => {
  console.log('Sign-in status changed:', signedIn ? 'signed in' : 'signed out');
  
  if (!signedIn) {
    cachedToken = null;
    cachedUser = null;
  }
});

console.log('AI Email Cleaner background service worker loaded');
