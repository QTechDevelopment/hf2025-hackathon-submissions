// Gmail API client helper functions

const GMAIL_API_BASE = 'https://www.googleapis.com/gmail/v1';

/**
 * List message IDs based on a query
 * @param {string} accessToken - OAuth access token
 * @param {string} query - Gmail search query
 * @param {number} maxResults - Maximum number of results (default 100)
 * @returns {Promise<Array>} Array of message IDs
 */
async function listMessageIds(accessToken, query = '', maxResults = 100) {
  const url = `${GMAIL_API_BASE}/users/me/messages?maxResults=${maxResults}${query ? `&q=${encodeURIComponent(query)}` : ''}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Gmail API error: ${error.error?.message || response.statusText}`);
  }
  
  const data = await response.json();
  return data.messages || [];
}

/**
 * Get message details for multiple message IDs
 * @param {string} accessToken - OAuth access token
 * @param {Array<string>} messageIds - Array of message IDs
 * @param {number} chunkSize - Number of messages to fetch per chunk (default 10)
 * @returns {Promise<Array>} Array of message details
 */
async function getMessageDetails(accessToken, messageIds, chunkSize = 10) {
  const messages = [];
  
  for (let i = 0; i < messageIds.length; i += chunkSize) {
    const chunk = messageIds.slice(i, i + chunkSize);
    const chunkPromises = chunk.map(id => fetchSingleMessage(accessToken, id));
    const chunkResults = await Promise.all(chunkPromises);
    messages.push(...chunkResults);
  }
  
  return messages.map(msg => ({
    id: msg.id,
    threadId: msg.threadId,
    from: getHeader(msg, 'From'),
    subject: getHeader(msg, 'Subject'),
    date: getHeader(msg, 'Date'),
    snippet: msg.snippet,
    labelIds: msg.labelIds || []
  }));
}

/**
 * Fetch a single message
 * @param {string} accessToken - OAuth access token
 * @param {string} messageId - Message ID
 * @returns {Promise<Object>} Message object
 */
async function fetchSingleMessage(accessToken, messageId) {
  const url = `${GMAIL_API_BASE}/users/me/messages/${messageId}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Gmail API error: ${error.error?.message || response.statusText}`);
  }
  
  return await response.json();
}

/**
 * Get header value from message
 * @param {Object} message - Gmail message object
 * @param {string} name - Header name
 * @returns {string} Header value
 */
function getHeader(message, name) {
  const header = message.payload?.headers?.find(h => h.name === name);
  return header ? header.value : '';
}

/**
 * Batch modify messages (archive, mark as read, add/remove labels)
 * @param {string} accessToken - OAuth access token
 * @param {Array<string>} messageIds - Array of message IDs
 * @param {string} action - Action: 'delete', 'archive', 'mark_read', 'label'
 * @param {string} labelId - Label ID (for label action)
 * @returns {Promise<Object>} Result object
 */
async function batchModify(accessToken, messageIds, action, labelId = null) {
  const results = {
    success: [],
    failed: []
  };
  
  for (const messageId of messageIds) {
    try {
      if (action === 'delete') {
        await trashMessage(accessToken, messageId);
      } else if (action === 'archive') {
        await modifyMessage(accessToken, messageId, { removeLabelIds: ['INBOX'] });
      } else if (action === 'mark_read') {
        await modifyMessage(accessToken, messageId, { removeLabelIds: ['UNREAD'] });
      } else if (action === 'label' && labelId) {
        await modifyMessage(accessToken, messageId, { addLabelIds: [labelId] });
      } else {
        throw new Error(`Unknown action: ${action}`);
      }
      results.success.push(messageId);
    } catch (error) {
      console.error(`Failed to ${action} message ${messageId}:`, error);
      results.failed.push({ messageId, error: error.message });
    }
  }
  
  return results;
}

/**
 * Trash a message
 * @param {string} accessToken - OAuth access token
 * @param {string} messageId - Message ID
 */
async function trashMessage(accessToken, messageId) {
  const url = `${GMAIL_API_BASE}/users/me/messages/${messageId}/trash`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Gmail API error: ${error.error?.message || response.statusText}`);
  }
  
  return await response.json();
}

/**
 * Modify message labels
 * @param {string} accessToken - OAuth access token
 * @param {string} messageId - Message ID
 * @param {Object} modifications - Modifications object
 */
async function modifyMessage(accessToken, messageId, modifications) {
  const url = `${GMAIL_API_BASE}/users/me/messages/${messageId}/modify`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(modifications)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Gmail API error: ${error.error?.message || response.statusText}`);
  }
  
  return await response.json();
}

/**
 * Ensure label exists or create it
 * @param {string} accessToken - OAuth access token
 * @param {string} labelName - Label name
 * @returns {Promise<string>} Label ID
 */
async function ensureLabelExists(accessToken, labelName) {
  // First, list all labels
  const listUrl = `${GMAIL_API_BASE}/users/me/labels`;
  const listResponse = await fetch(listUrl, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  
  if (!listResponse.ok) {
    const error = await listResponse.json();
    throw new Error(`Gmail API error: ${error.error?.message || listResponse.statusText}`);
  }
  
  const labels = await listResponse.json();
  const existingLabel = labels.labels?.find(l => l.name === labelName);
  
  if (existingLabel) {
    return existingLabel.id;
  }
  
  // Create new label
  const createUrl = `${GMAIL_API_BASE}/users/me/labels`;
  const createResponse = await fetch(createUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: labelName,
      labelListVisibility: 'labelShow',
      messageListVisibility: 'show'
    })
  });
  
  if (!createResponse.ok) {
    const error = await createResponse.json();
    throw new Error(`Gmail API error: ${error.error?.message || createResponse.statusText}`);
  }
  
  const newLabel = await createResponse.json();
  return newLabel.id;
}

/**
 * Create a draft reply for a message
 * @param {string} accessToken - OAuth access token
 * @param {string} messageId - Original message ID
 * @param {string} threadId - Thread ID
 * @param {string} to - Recipient email
 * @param {string} subject - Subject line
 * @param {string} body - Email body
 * @returns {Promise<Object>} Draft object
 */
async function createDraftReply(accessToken, messageId, threadId, to, subject, body) {
  // Construct RFC 2822 formatted message
  const message = [
    `To: ${to}`,
    `Subject: ${subject}`,
    `Content-Type: text/plain; charset=utf-8`,
    '',
    body
  ].join('\r\n');
  
  // Base64url encode the message
  const encodedMessage = base64urlEncode(message);
  
  const url = `${GMAIL_API_BASE}/users/me/drafts`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: {
        raw: encodedMessage,
        threadId: threadId
      }
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Gmail API error: ${error.error?.message || response.statusText}`);
  }
  
  return await response.json();
}

/**
 * Base64url encode a string
 * @param {string} str - String to encode
 * @returns {string} Base64url encoded string
 */
function base64urlEncode(str) {
  // Convert to base64
  const base64 = btoa(unescape(encodeURIComponent(str)));
  
  // Convert to base64url
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Export functions (for use in extension context)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    listMessageIds,
    getMessageDetails,
    batchModify,
    ensureLabelExists,
    createDraftReply
  };
}
