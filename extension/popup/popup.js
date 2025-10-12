// Appwrite configuration
const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = 'YOUR_PROJECT_ID';
const APPWRITE_FUNCTION_ID = 'YOUR_FUNCTION_ID';

// UI elements
const authSection = document.getElementById('auth-section');
const mainSection = document.getElementById('main-section');
const resultsSection = document.getElementById('results-section');
const progressSection = document.getElementById('progress-section');
const errorSection = document.getElementById('error-section');

const loginBtn = document.getElementById('login-btn');
const appwriteLoginBtn = document.getElementById('appwrite-login-btn');
const logoutBtn = document.getElementById('logout-btn');
const analyzeBtn = document.getElementById('analyze-btn');
const executeBtn = document.getElementById('execute-btn');
const cancelBtn = document.getElementById('cancel-btn');

const userEmailSpan = document.getElementById('user-email');
const cleanupPrompt = document.getElementById('cleanup-prompt');
const previewMode = document.getElementById('preview-mode');
const summaryDiv = document.getElementById('summary');
const emailListDiv = document.getElementById('email-list');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');

let currentUser = null;
let analysisResults = null;
let accessToken = null;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await checkAuthStatus();
  setupEventListeners();
});

function setupEventListeners() {
  loginBtn.addEventListener('click', handleGoogleLogin);
  appwriteLoginBtn.addEventListener('click', handleAppwriteLogin);
  logoutBtn.addEventListener('click', handleLogout);
  analyzeBtn.addEventListener('click', handleAnalyze);
  executeBtn.addEventListener('click', handleExecute);
  cancelBtn.addEventListener('click', handleCancel);
}

async function checkAuthStatus() {
  try {
    const stored = await chrome.storage.local.get(['user', 'accessToken']);
    if (stored.user && stored.accessToken) {
      currentUser = stored.user;
      accessToken = stored.accessToken;
      showMainUI();
    } else {
      showAuthUI();
    }
  } catch (error) {
    console.error('Error checking auth status:', error);
    showAuthUI();
  }
}

function showAuthUI() {
  authSection.classList.remove('hidden');
  mainSection.classList.add('hidden');
  errorSection.classList.add('hidden');
}

function showMainUI() {
  authSection.classList.add('hidden');
  mainSection.classList.remove('hidden');
  errorSection.classList.add('hidden');
  userEmailSpan.textContent = currentUser.email;
}

function showError(message) {
  errorSection.textContent = message;
  errorSection.classList.remove('hidden');
  setTimeout(() => {
    errorSection.classList.add('hidden');
  }, 5000);
}

async function handleGoogleLogin() {
  try {
    const result = await chrome.identity.getAuthToken({ interactive: true });
    accessToken = result.token;
    
    // Get user profile
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    const userData = await response.json();
    currentUser = {
      email: userData.email,
      name: userData.name,
      picture: userData.picture
    };
    
    await chrome.storage.local.set({ user: currentUser, accessToken });
    showMainUI();
  } catch (error) {
    console.error('Login error:', error);
    showError('Failed to login with Google. Please try again.');
  }
}

async function handleAppwriteLogin() {
  // This would integrate with Appwrite Auth
  // For now, redirecting to the web-based auth flow
  showError('Please use Google login for Gmail access. Appwrite auth coming soon!');
}

async function handleLogout() {
  try {
    if (accessToken) {
      await chrome.identity.removeCachedAuthToken({ token: accessToken });
    }
    await chrome.storage.local.remove(['user', 'accessToken']);
    currentUser = null;
    accessToken = null;
    showAuthUI();
  } catch (error) {
    console.error('Logout error:', error);
  }
}

async function handleAnalyze() {
  const prompt = cleanupPrompt.value.trim();
  
  if (!prompt) {
    showError('Please enter a cleanup prompt');
    return;
  }
  
  try {
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = 'Analyzing...';
    progressSection.classList.remove('hidden');
    resultsSection.classList.add('hidden');
    
    updateProgress(10, 'Fetching emails from Gmail...');
    
    // Fetch emails from Gmail
    const emails = await fetchEmails();
    
    updateProgress(40, 'Sending to Gemini AI for analysis...');
    
    // Send to Gemini via Appwrite Function
    const analysis = await analyzeWithGemini(emails, prompt);
    
    updateProgress(80, 'Processing results...');
    
    analysisResults = analysis;
    
    updateProgress(100, 'Analysis complete!');
    
    // Display results
    displayResults(analysis);
    
    setTimeout(() => {
      progressSection.classList.add('hidden');
    }, 1000);
    
  } catch (error) {
    console.error('Analysis error:', error);
    showError('Failed to analyze emails: ' + error.message);
    progressSection.classList.add('hidden');
  } finally {
    analyzeBtn.disabled = false;
    analyzeBtn.textContent = 'Analyze Emails';
  }
}

async function fetchEmails() {
  try {
    // Fetch recent emails (last 6 months)
    const response = await fetch(
      'https://www.googleapis.com/gmail/v1/users/me/messages?maxResults=100&q=newer_than:6m',
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );
    
    const data = await response.json();
    
    if (!data.messages || data.messages.length === 0) {
      return [];
    }
    
    // Fetch details for each email (batch of 10 at a time)
    const emails = [];
    const batchSize = 10;
    
    for (let i = 0; i < Math.min(data.messages.length, 50); i += batchSize) {
      const batch = data.messages.slice(i, i + batchSize);
      const batchPromises = batch.map(msg => 
        fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${msg.id}`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        }).then(r => r.json())
      );
      
      const batchResults = await Promise.all(batchPromises);
      emails.push(...batchResults);
    }
    
    return emails.map(email => ({
      id: email.id,
      threadId: email.threadId,
      subject: getHeader(email, 'Subject'),
      from: getHeader(email, 'From'),
      date: getHeader(email, 'Date'),
      snippet: email.snippet,
      labelIds: email.labelIds
    }));
    
  } catch (error) {
    console.error('Error fetching emails:', error);
    throw new Error('Failed to fetch emails from Gmail');
  }
}

function getHeader(email, name) {
  const header = email.payload?.headers?.find(h => h.name === name);
  return header ? header.value : '';
}

async function analyzeWithGemini(emails, prompt) {
  try {
    // Send to Appwrite Function which calls Gemini API
    const response = await fetch(
      `${APPWRITE_ENDPOINT}/functions/${APPWRITE_FUNCTION_ID}/executions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-Project': APPWRITE_PROJECT_ID
        },
        body: JSON.stringify({
          emails: emails.map(e => ({
            id: e.id,
            subject: e.subject,
            from: e.from,
            date: e.date,
            snippet: e.snippet
          })),
          prompt: prompt,
          userId: currentUser.email
        })
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to call Appwrite Function');
    }
    
    const execution = await response.json();
    
    // Poll for execution result
    const result = await pollExecutionResult(execution.$id);
    
    return JSON.parse(result);
    
  } catch (error) {
    console.error('Error with Gemini analysis:', error);
    // Fallback to local analysis if Appwrite is not configured
    return performLocalAnalysis(emails, prompt);
  }
}

async function pollExecutionResult(executionId) {
  const maxAttempts = 30;
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const response = await fetch(
      `${APPWRITE_ENDPOINT}/functions/${APPWRITE_FUNCTION_ID}/executions/${executionId}`,
      {
        headers: {
          'X-Appwrite-Project': APPWRITE_PROJECT_ID
        }
      }
    );
    
    const execution = await response.json();
    
    if (execution.status === 'completed') {
      return execution.response;
    } else if (execution.status === 'failed') {
      throw new Error('Function execution failed');
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    attempts++;
  }
  
  throw new Error('Function execution timeout');
}

function performLocalAnalysis(emails, prompt) {
  // Simple local analysis as fallback
  const keywords = extractKeywords(prompt);
  const timeframe = extractTimeframe(prompt);
  
  const matchedEmails = emails.filter(email => {
    const matchesKeyword = keywords.length === 0 || keywords.some(keyword => 
      email.subject.toLowerCase().includes(keyword) ||
      email.from.toLowerCase().includes(keyword) ||
      email.snippet.toLowerCase().includes(keyword)
    );
    
    const matchesTime = !timeframe || isWithinTimeframe(email.date, timeframe);
    
    return matchesKeyword && matchesTime;
  });
  
  return {
    totalEmails: emails.length,
    matchedEmails: matchedEmails,
    action: detectAction(prompt),
    summary: `Found ${matchedEmails.length} emails matching your criteria`
  };
}

function extractKeywords(prompt) {
  const stopWords = ['delete', 'remove', 'archive', 'clear', 'clean', 'old', 'emails', 'from', 'the', 'all', 'my'];
  return prompt.toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.includes(word));
}

function extractTimeframe(prompt) {
  const monthMatch = prompt.match(/(\d+)\s*months?/i);
  if (monthMatch) {
    return { value: parseInt(monthMatch[1]), unit: 'month' };
  }
  
  const yearMatch = prompt.match(/(\d+)\s*years?/i);
  if (yearMatch) {
    return { value: parseInt(yearMatch[1]), unit: 'year' };
  }
  
  return null;
}

function isWithinTimeframe(dateStr, timeframe) {
  const emailDate = new Date(dateStr);
  const now = new Date();
  const cutoffDate = new Date(now);
  
  if (timeframe.unit === 'month') {
    cutoffDate.setMonth(cutoffDate.getMonth() - timeframe.value);
  } else if (timeframe.unit === 'year') {
    cutoffDate.setFullYear(cutoffDate.getFullYear() - timeframe.value);
  }
  
  return emailDate < cutoffDate;
}

function detectAction(prompt) {
  const lowerPrompt = prompt.toLowerCase();
  if (lowerPrompt.includes('delete')) return 'delete';
  if (lowerPrompt.includes('archive')) return 'archive';
  if (lowerPrompt.includes('mark') && lowerPrompt.includes('read')) return 'markRead';
  return 'delete';
}

function displayResults(analysis) {
  summaryDiv.innerHTML = `
    <p><strong>Total emails analyzed:</strong> ${analysis.totalEmails}</p>
    <p><strong>Emails matching criteria:</strong> ${analysis.matchedEmails.length}</p>
    <p><strong>Action:</strong> ${analysis.action}</p>
    <p>${analysis.summary}</p>
  `;
  
  emailListDiv.innerHTML = '';
  
  analysis.matchedEmails.slice(0, 20).forEach(email => {
    const emailItem = document.createElement('div');
    emailItem.className = 'email-item';
    emailItem.innerHTML = `
      <div class="email-subject">${escapeHtml(email.subject)}</div>
      <div class="email-from">${escapeHtml(email.from)}</div>
      <div class="email-date">${email.date}</div>
    `;
    emailListDiv.appendChild(emailItem);
  });
  
  if (analysis.matchedEmails.length > 20) {
    const moreItem = document.createElement('div');
    moreItem.className = 'email-item';
    moreItem.style.textAlign = 'center';
    moreItem.style.fontStyle = 'italic';
    moreItem.textContent = `... and ${analysis.matchedEmails.length - 20} more emails`;
    emailListDiv.appendChild(moreItem);
  }
  
  resultsSection.classList.remove('hidden');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

async function handleExecute() {
  if (!analysisResults || analysisResults.matchedEmails.length === 0) {
    showError('No emails to process');
    return;
  }
  
  const confirmed = confirm(
    `Are you sure you want to ${analysisResults.action} ${analysisResults.matchedEmails.length} emails? This action cannot be undone.`
  );
  
  if (!confirmed) return;
  
  try {
    executeBtn.disabled = true;
    executeBtn.textContent = 'Processing...';
    progressSection.classList.remove('hidden');
    
    const total = analysisResults.matchedEmails.length;
    let processed = 0;
    
    for (const email of analysisResults.matchedEmails) {
      await performAction(email.id, analysisResults.action);
      processed++;
      updateProgress((processed / total) * 100, `Processed ${processed}/${total} emails`);
    }
    
    alert(`Successfully processed ${processed} emails!`);
    
    // Reset
    resultsSection.classList.add('hidden');
    progressSection.classList.add('hidden');
    cleanupPrompt.value = '';
    analysisResults = null;
    
  } catch (error) {
    console.error('Execution error:', error);
    showError('Failed to execute cleanup: ' + error.message);
  } finally {
    executeBtn.disabled = false;
    executeBtn.textContent = 'Execute Cleanup';
    progressSection.classList.add('hidden');
  }
}

async function performAction(emailId, action) {
  try {
    if (action === 'delete') {
      await fetch(
        `https://www.googleapis.com/gmail/v1/users/me/messages/${emailId}/trash`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );
    } else if (action === 'archive') {
      await fetch(
        `https://www.googleapis.com/gmail/v1/users/me/messages/${emailId}/modify`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            removeLabelIds: ['INBOX']
          })
        }
      );
    } else if (action === 'markRead') {
      await fetch(
        `https://www.googleapis.com/gmail/v1/users/me/messages/${emailId}/modify`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            removeLabelIds: ['UNREAD']
          })
        }
      );
    }
  } catch (error) {
    console.error(`Error performing action ${action} on email ${emailId}:`, error);
    throw error;
  }
}

function handleCancel() {
  resultsSection.classList.add('hidden');
  analysisResults = null;
}

function updateProgress(percent, text) {
  progressFill.style.width = `${percent}%`;
  progressText.textContent = text;
}
