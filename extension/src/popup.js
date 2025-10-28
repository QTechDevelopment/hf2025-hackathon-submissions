// Configuration - Update these with your server URL
const AI_SERVER_URL = 'http://localhost:3000'; // Update this to your deployed server URL

// UI Elements
const authSection = document.getElementById('auth-section');
const mainSection = document.getElementById('main-section');
const previewSection = document.getElementById('preview-section');
const suggestionsSection = document.getElementById('suggestions-section');
const progressSection = document.getElementById('progress-section');
const resultSection = document.getElementById('result-section');
const errorSection = document.getElementById('error-section');

const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const previewBtn = document.getElementById('preview-btn');
const confirmBtn = document.getElementById('confirm-btn');
const cancelBtn = document.getElementById('cancel-btn');

const userEmailSpan = document.getElementById('user-email');
const commandInput = document.getElementById('command-input');
const actionSelect = document.getElementById('action-select');
const labelInput = document.getElementById('label-input');
const labelInputGroup = document.getElementById('label-input-group');

const previewSummary = document.getElementById('preview-summary');
const messageList = document.getElementById('message-list');
const suggestionsList = document.getElementById('suggestions-list');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const resultMessage = document.getElementById('result-message');

// State
let currentUser = null;
let previewData = null;
let selectedMessageIds = [];

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await checkAuthStatus();
  setupEventListeners();
});

function setupEventListeners() {
  loginBtn.addEventListener('click', handleLogin);
  logoutBtn.addEventListener('click', handleLogout);
  previewBtn.addEventListener('click', handlePreview);
  confirmBtn.addEventListener('click', handleConfirm);
  cancelBtn.addEventListener('click', handleCancel);
  
  actionSelect.addEventListener('change', () => {
    if (actionSelect.value === 'label') {
      labelInputGroup.classList.remove('hidden');
    } else {
      labelInputGroup.classList.add('hidden');
    }
  });
}

async function checkAuthStatus() {
  try {
    const response = await chrome.runtime.sendMessage({ type: 'checkAuth' });
    if (response && response.user) {
      currentUser = response.user;
      showMainUI();
    } else {
      showAuthUI();
    }
  } catch (error) {
    console.error('Error checking auth:', error);
    showAuthUI();
  }
}

function showAuthUI() {
  authSection.classList.remove('hidden');
  mainSection.classList.add('hidden');
}

function showMainUI() {
  authSection.classList.add('hidden');
  mainSection.classList.remove('hidden');
  if (currentUser && currentUser.email) {
    userEmailSpan.textContent = currentUser.email;
  }
}

function showError(message) {
  errorSection.textContent = message;
  errorSection.classList.remove('hidden');
  setTimeout(() => {
    errorSection.classList.add('hidden');
  }, 5000);
}

function updateProgress(percent, text) {
  progressFill.style.width = `${percent}%`;
  progressText.textContent = text;
}

async function handleLogin() {
  try {
    loginBtn.disabled = true;
    loginBtn.textContent = 'Authenticating...';
    
    const response = await chrome.runtime.sendMessage({ type: 'signIn' });
    
    if (response.success) {
      currentUser = response.user;
      showMainUI();
    } else {
      showError(response.error || 'Authentication failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    showError('Failed to authenticate. Please try again.');
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = 'Authenticate with Gmail';
  }
}

async function handleLogout() {
  try {
    await chrome.runtime.sendMessage({ type: 'signOut' });
    currentUser = null;
    previewData = null;
    selectedMessageIds = [];
    showAuthUI();
    resetUI();
  } catch (error) {
    console.error('Logout error:', error);
  }
}

async function handlePreview() {
  const command = commandInput.value.trim();
  
  if (!command) {
    showError('Please enter a command describing what emails to clean up');
    return;
  }
  
  try {
    previewBtn.disabled = true;
    previewBtn.textContent = 'Loading...';
    progressSection.classList.remove('hidden');
    previewSection.classList.add('hidden');
    suggestionsSection.classList.add('hidden');
    
    updateProgress(10, 'Parsing command...');
    
    // Get action from selector or auto-detect
    const actionOverride = actionSelect.value !== 'auto' ? actionSelect.value : null;
    const labelName = actionSelect.value === 'label' ? labelInput.value.trim() : null;
    
    if (actionOverride === 'label' && !labelName) {
      showError('Please enter a label name');
      progressSection.classList.add('hidden');
      return;
    }
    
    // Call background script to preview
    updateProgress(30, 'Fetching matching messages...');
    
    const response = await chrome.runtime.sendMessage({
      type: 'previewCommand',
      command,
      actionOverride,
      labelName
    });
    
    if (!response.success) {
      throw new Error(response.error || 'Preview failed');
    }
    
    updateProgress(100, 'Preview ready!');
    
    previewData = response.data;
    selectedMessageIds = previewData.messages.map(m => m.id);
    
    renderPreview(previewData);
    
    setTimeout(() => {
      progressSection.classList.add('hidden');
    }, 500);
    
  } catch (error) {
    console.error('Preview error:', error);
    showError('Failed to preview: ' + error.message);
    progressSection.classList.add('hidden');
  } finally {
    previewBtn.disabled = false;
    previewBtn.textContent = 'Preview Matches';
  }
}

function renderPreview(data) {
  // Render summary
  previewSummary.innerHTML = `
    <p><strong>Action:</strong> ${data.parsed.action}</p>
    <p><strong>Query:</strong> ${data.parsed.query}</p>
    <p><strong>Total Messages Found:</strong> ${data.messageCount}</p>
    <p><strong>Showing:</strong> ${data.messages.length} messages (up to 50)</p>
    ${data.parsed.label ? `<p><strong>Label:</strong> ${data.parsed.label}</p>` : ''}
  `;
  
  // Render messages with checkboxes
  messageList.innerHTML = '';
  
  if (data.messages.length === 0) {
    messageList.innerHTML = '<p class="no-results">No messages matched your criteria.</p>';
  } else {
    data.messages.forEach(msg => {
      const messageItem = document.createElement('div');
      messageItem.className = 'message-item';
      messageItem.innerHTML = `
        <label class="message-checkbox">
          <input type="checkbox" value="${msg.id}" checked>
          <div class="message-details">
            <div class="message-subject">${escapeHtml(msg.subject || '(No Subject)')}</div>
            <div class="message-from">${escapeHtml(msg.from)}</div>
            <div class="message-date">${msg.date}</div>
            <div class="message-snippet">${escapeHtml(msg.snippet)}</div>
          </div>
        </label>
      `;
      messageList.appendChild(messageItem);
    });
    
    // Add event listeners to checkboxes
    const checkboxes = messageList.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => {
      cb.addEventListener('change', (e) => {
        const messageId = e.target.value;
        if (e.target.checked) {
          if (!selectedMessageIds.includes(messageId)) {
            selectedMessageIds.push(messageId);
          }
        } else {
          selectedMessageIds = selectedMessageIds.filter(id => id !== messageId);
        }
      });
    });
  }
  
  // Render suggestions if available
  if (data.suggestions && data.suggestions.length > 0) {
    renderSuggestions(data.suggestions, data.messages);
    suggestionsSection.classList.remove('hidden');
  } else {
    suggestionsSection.classList.add('hidden');
  }
  
  previewSection.classList.remove('hidden');
}

function renderSuggestions(suggestions, messages) {
  suggestionsList.innerHTML = '';
  
  suggestions.forEach((suggestion, idx) => {
    const suggestionItem = document.createElement('div');
    suggestionItem.className = 'suggestion-item';
    suggestionItem.innerHTML = `
      <div class="suggestion-text">${escapeHtml(suggestion.text)}</div>
      <div class="suggestion-actions">
        <button class="btn btn-small copy-btn" data-text="${escapeHtml(suggestion.text)}">Copy</button>
        <button class="btn btn-small draft-btn" data-index="${idx}">Create Drafts</button>
      </div>
    `;
    suggestionsList.appendChild(suggestionItem);
  });
  
  // Add event listeners
  suggestionsList.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const text = e.target.dataset.text;
      navigator.clipboard.writeText(text).then(() => {
        const originalText = e.target.textContent;
        e.target.textContent = 'Copied!';
        setTimeout(() => {
          e.target.textContent = originalText;
        }, 2000);
      });
    });
  });
  
  suggestionsList.querySelectorAll('.draft-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const index = parseInt(e.target.dataset.index);
      const suggestion = suggestions[index];
      await handleCreateDrafts(suggestion.text);
    });
  });
}

async function handleCreateDrafts(suggestionText) {
  if (selectedMessageIds.length === 0) {
    showError('No messages selected for draft replies');
    return;
  }
  
  try {
    progressSection.classList.remove('hidden');
    updateProgress(0, 'Creating drafts...');
    
    const response = await chrome.runtime.sendMessage({
      type: 'createDraftsForSuggestion',
      messageIds: selectedMessageIds,
      suggestionText
    });
    
    if (response.success) {
      updateProgress(100, 'Drafts created!');
      showResult(`Successfully created ${response.data.successCount} draft(s)`);
      setTimeout(() => {
        progressSection.classList.add('hidden');
      }, 2000);
    } else {
      throw new Error(response.error || 'Failed to create drafts');
    }
  } catch (error) {
    console.error('Create drafts error:', error);
    showError('Failed to create drafts: ' + error.message);
    progressSection.classList.add('hidden');
  }
}

async function handleConfirm() {
  if (!previewData || selectedMessageIds.length === 0) {
    showError('No messages selected');
    return;
  }
  
  const action = previewData.parsed.action;
  const actionText = action === 'delete' ? 'delete' : 
                     action === 'archive' ? 'archive' : 
                     action === 'mark_read' ? 'mark as read' : 
                     action === 'label' ? 'label' : action;
  
  const confirmed = confirm(
    `Are you sure you want to ${actionText} ${selectedMessageIds.length} message(s)? This action cannot be undone.`
  );
  
  if (!confirmed) return;
  
  try {
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Processing...';
    progressSection.classList.remove('hidden');
    
    updateProgress(0, 'Executing action...');
    
    const response = await chrome.runtime.sendMessage({
      type: 'executeAction',
      messageIds: selectedMessageIds,
      action: previewData.parsed.action,
      labelName: previewData.parsed.label
    });
    
    if (response.success) {
      updateProgress(100, 'Complete!');
      const result = response.data;
      showResult(`
        Action completed!<br>
        Success: ${result.successCount}<br>
        Failed: ${result.failedCount}<br>
        Total: ${result.totalCount}
      `);
      
      // Reset UI after success
      setTimeout(() => {
        resetUI();
      }, 3000);
    } else {
      throw new Error(response.error || 'Execution failed');
    }
  } catch (error) {
    console.error('Execution error:', error);
    showError('Failed to execute action: ' + error.message);
  } finally {
    confirmBtn.disabled = false;
    confirmBtn.textContent = 'Confirm & Execute';
    setTimeout(() => {
      progressSection.classList.add('hidden');
    }, 2000);
  }
}

function handleCancel() {
  resetUI();
}

function showResult(message) {
  resultMessage.innerHTML = message;
  resultSection.classList.remove('hidden');
  setTimeout(() => {
    resultSection.classList.add('hidden');
  }, 5000);
}

function resetUI() {
  previewSection.classList.add('hidden');
  suggestionsSection.classList.add('hidden');
  progressSection.classList.add('hidden');
  resultSection.classList.add('hidden');
  previewData = null;
  selectedMessageIds = [];
  commandInput.value = '';
  actionSelect.value = 'auto';
  labelInputGroup.classList.add('hidden');
  labelInput.value = '';
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
