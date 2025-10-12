// Background service worker for the AI Email Cleaner extension

// Listen for installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('AI Email Cleaner extension installed');
    
    // Set default settings
    chrome.storage.local.set({
      settings: {
        previewMode: true,
        maxEmailsPerBatch: 50,
        autoSync: false
      }
    });
  } else if (details.reason === 'update') {
    console.log('AI Email Cleaner extension updated');
  }
});

// Listen for messages from popup or content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzeEmails') {
    handleAnalyzeEmails(request.data)
      .then(result => sendResponse({ success: true, data: result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep channel open for async response
  }
  
  if (request.action === 'executeCleanup') {
    handleExecuteCleanup(request.data)
      .then(result => sendResponse({ success: true, data: result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
  
  if (request.action === 'syncSettings') {
    handleSyncSettings(request.data)
      .then(result => sendResponse({ success: true, data: result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
});

async function handleAnalyzeEmails(data) {
  const { emails, prompt, accessToken } = data;
  
  console.log(`Analyzing ${emails.length} emails with prompt: ${prompt}`);
  
  // This could be enhanced to call Appwrite Functions
  // For now, returning a simple analysis
  return {
    totalAnalyzed: emails.length,
    timestamp: new Date().toISOString()
  };
}

async function handleExecuteCleanup(data) {
  const { emailIds, action, accessToken } = data;
  
  console.log(`Executing ${action} on ${emailIds.length} emails`);
  
  let successCount = 0;
  let failureCount = 0;
  
  for (const emailId of emailIds) {
    try {
      // Perform the action via Gmail API
      await performEmailAction(emailId, action, accessToken);
      successCount++;
    } catch (error) {
      console.error(`Failed to ${action} email ${emailId}:`, error);
      failureCount++;
    }
  }
  
  return {
    successCount,
    failureCount,
    total: emailIds.length
  };
}

async function performEmailAction(emailId, action, accessToken) {
  let endpoint;
  let method = 'POST';
  let body = null;
  
  if (action === 'delete' || action === 'trash') {
    endpoint = `https://www.googleapis.com/gmail/v1/users/me/messages/${emailId}/trash`;
  } else if (action === 'archive') {
    endpoint = `https://www.googleapis.com/gmail/v1/users/me/messages/${emailId}/modify`;
    body = JSON.stringify({ removeLabelIds: ['INBOX'] });
  } else if (action === 'markRead') {
    endpoint = `https://www.googleapis.com/gmail/v1/users/me/messages/${emailId}/modify`;
    body = JSON.stringify({ removeLabelIds: ['UNREAD'] });
  } else if (action === 'markUnread') {
    endpoint = `https://www.googleapis.com/gmail/v1/users/me/messages/${emailId}/modify`;
    body = JSON.stringify({ addLabelIds: ['UNREAD'] });
  } else {
    throw new Error(`Unknown action: ${action}`);
  }
  
  const response = await fetch(endpoint, {
    method,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gmail API error: ${response.status} - ${errorText}`);
  }
  
  return await response.json();
}

async function handleSyncSettings(data) {
  await chrome.storage.local.set({ settings: data });
  return { synced: true };
}

// Periodic cleanup check (if user enables auto-sync)
chrome.alarms.create('autoCleanup', { periodInMinutes: 60 });

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'autoCleanup') {
    const { settings } = await chrome.storage.local.get(['settings']);
    
    if (settings?.autoSync) {
      console.log('Running automatic cleanup check...');
      // Could implement automatic cleanup here
    }
  }
});

// Handle auth token caching
chrome.identity.onSignInChanged.addListener((account, signedIn) => {
  console.log('Sign-in status changed:', signedIn ? 'signed in' : 'signed out');
  
  if (!signedIn) {
    // Clear stored data on sign out
    chrome.storage.local.remove(['user', 'accessToken']);
  }
});

console.log('AI Email Cleaner background service worker loaded');
