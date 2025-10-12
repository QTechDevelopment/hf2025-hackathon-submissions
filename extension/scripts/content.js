// Content script for Gmail integration
// This script runs on Gmail pages and provides UI enhancements

(function() {
  'use strict';
  
  console.log('AI Email Cleaner content script loaded');
  
  let cleanerButton = null;
  let isInjected = false;
  
  // Wait for Gmail to load
  waitForGmail();
  
  function waitForGmail() {
    // Check if Gmail interface is loaded
    const checkInterval = setInterval(() => {
      const gmailLoaded = document.querySelector('[role="navigation"]') || 
                         document.querySelector('.nH') ||
                         document.querySelector('[gh="tl"]');
      
      if (gmailLoaded && !isInjected) {
        clearInterval(checkInterval);
        injectCleanerUI();
        isInjected = true;
      }
    }, 1000);
    
    // Stop checking after 30 seconds
    setTimeout(() => clearInterval(checkInterval), 30000);
  }
  
  function injectCleanerUI() {
    try {
      // Create a floating button to access AI Email Cleaner
      createFloatingButton();
      
      // Add observer to watch for new emails
      observeEmailList();
      
      console.log('AI Email Cleaner UI injected successfully');
    } catch (error) {
      console.error('Failed to inject cleaner UI:', error);
    }
  }
  
  function createFloatingButton() {
    // Check if button already exists
    if (document.getElementById('ai-email-cleaner-btn')) return;
    
    const button = document.createElement('button');
    button.id = 'ai-email-cleaner-btn';
    button.className = 'ai-cleaner-floating-btn';
    button.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
      </svg>
      <span>AI Clean</span>
    `;
    button.title = 'Open AI Email Cleaner';
    
    button.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'openPopup' });
    });
    
    document.body.appendChild(button);
  }
  
  function observeEmailList() {
    // Find the email list container
    const emailContainer = document.querySelector('[role="main"]') || 
                          document.querySelector('.AO');
    
    if (!emailContainer) {
      console.log('Email container not found');
      return;
    }
    
    // Create a mutation observer to watch for new emails
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              enhanceEmailRow(node);
            }
          });
        }
      });
    });
    
    observer.observe(emailContainer, {
      childList: true,
      subtree: true
    });
    
    // Also enhance existing emails
    const existingEmails = emailContainer.querySelectorAll('[role="row"]');
    existingEmails.forEach(enhanceEmailRow);
  }
  
  function enhanceEmailRow(emailRow) {
    // Add AI-powered quick actions to email rows
    if (!emailRow.querySelector || emailRow.querySelector('.ai-quick-action')) {
      return;
    }
    
    // This could add quick action buttons inline with emails
    // For now, we'll keep it simple to avoid cluttering Gmail's UI
  }
  
  // Listen for messages from background script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getVisibleEmails') {
      const emails = getVisibleEmails();
      sendResponse({ emails });
    }
    
    if (request.action === 'highlightEmails') {
      highlightEmails(request.emailIds);
      sendResponse({ success: true });
    }
    
    return true;
  });
  
  function getVisibleEmails() {
    const emailRows = document.querySelectorAll('[role="row"]');
    const emails = [];
    
    emailRows.forEach(row => {
      try {
        const emailId = row.getAttribute('data-message-id') || 
                       row.getAttribute('data-legacy-message-id');
        
        if (emailId) {
          const subject = row.querySelector('[role="link"]')?.textContent || '';
          const sender = row.querySelector('[email]')?.getAttribute('email') || '';
          
          emails.push({
            id: emailId,
            subject,
            sender
          });
        }
      } catch (error) {
        console.error('Error extracting email data:', error);
      }
    });
    
    return emails;
  }
  
  function highlightEmails(emailIds) {
    const emailRows = document.querySelectorAll('[role="row"]');
    
    emailRows.forEach(row => {
      const emailId = row.getAttribute('data-message-id') || 
                     row.getAttribute('data-legacy-message-id');
      
      if (emailIds.includes(emailId)) {
        row.classList.add('ai-cleaner-highlighted');
        
        // Remove highlight after 3 seconds
        setTimeout(() => {
          row.classList.remove('ai-cleaner-highlighted');
        }, 3000);
      }
    });
  }
  
  // Add custom styles for the floating button and highlights
  const style = document.createElement('style');
  style.textContent = `
    .ai-cleaner-floating-btn {
      position: fixed;
      bottom: 30px;
      right: 30px;
      z-index: 10000;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 50px;
      padding: 12px 20px;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
      font-size: 14px;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    
    .ai-cleaner-floating-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 25px rgba(102, 126, 234, 0.5);
    }
    
    .ai-cleaner-floating-btn svg {
      width: 20px;
      height: 20px;
    }
    
    .ai-cleaner-highlighted {
      background-color: #fef3c7 !important;
      transition: background-color 0.3s ease;
    }
    
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.7;
      }
    }
    
    .ai-cleaner-floating-btn.processing {
      animation: pulse 1.5s ease-in-out infinite;
    }
  `;
  
  document.head.appendChild(style);
  
})();
