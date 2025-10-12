# Gmail AI Agent - Project Context

## Project Overview
Build a Gmail inbox cleanup AI agent that uses Google Gemini AI for email classification
and is hosted on Appwrite backend services. The agent authenticates users via
Google OAuth, classifies emails based on user-defined rules, and performs batch
cleanup operations (delete, archive, label, mark as read).

This is a Chrome extension that integrates seamlessly with Gmail, allowing users to
use natural language to describe what emails they want to clean up, and the AI
handles the analysis and execution.

## Technology Stack
- Frontend: React with JavaScript, Tailwind CSS (via inline styles in popup.css)
- Backend: Appwrite Functions (Node.js), Appwrite Database, Appwrite Auth
- AI Services: Google Gemini AI (gemini-pro model)
- APIs: Gmail API v1, Google Gemini REST API, Appwrite REST API
- Development Tools: GitHub Copilot, VS Code, npm/yarn
- Hosting: Appwrite Cloud (backend), Chrome Extension (frontend)
- Extension: Chrome Manifest V3

## Project Structure
```
/extension
├── /popup                  # Extension popup UI
│   ├── popup.html         # Main UI interface
│   ├── popup.css          # Styles with gradient theme
│   └── popup.js           # Core logic and API integration
├── /scripts               # Extension scripts
│   ├── background.js      # Service worker for background tasks
│   └── content.js         # Content script injected into Gmail
├── /styles                # Content script styles
│   └── content.css        # Styles for Gmail integration
├── /icons                 # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── /appwrite-functions    # Serverless functions
│   └── /gemini-analyzer   # Gemini AI email classification
│       ├── main.js        # Function implementation
│       └── package.json   # Dependencies
├── manifest.json          # Manifest V3 configuration
├── package.json           # Extension metadata
├── .env.example           # Environment variables template
├── README.md              # Main documentation
├── SETUP.md               # Setup instructions
├── ARCHITECTURE.md        # Technical architecture
├── FEATURES.md            # Feature documentation
└── QUICKSTART.md          # Quick start guide
```

## Architecture Components

### 1. Authentication Layer
- Google OAuth 2.0 via Chrome Identity API
- Gmail API scopes: gmail.modify, gmail.readonly
- Store OAuth tokens securely in chrome.identity
- Automatic token refresh handling
- Fallback Appwrite Auth login option

### 2. Email Processing Pipeline
- Fetch emails from Gmail API (paginated, max 100 per batch)
- Extract: id, subject, body snippet, sender, date, labels
- Send to Appwrite Function which calls Gemini API
- Parse Gemini response for classification
- Store results temporarily in extension state
- Optional: Store analysis history in Appwrite Database collection: analyses

### 3. AI Classification Module
- Primary: Google Gemini AI (gemini-pro model)
- Prompt engineering: Include email metadata + user prompt
- Classification categories: delete, archive, markRead (determined by AI)
- Return confidence score with each classification
- Fallback: Local analysis using keyword matching if API fails

### 4. User Rules Engine
- User provides natural language prompt describing cleanup criteria
- AI interprets intent: time-based, sender-based, content-based, label-based
- Preview mode: Show what will be affected before execution
- No persistent rules storage (prompt-based approach)

### 5. Batch Operations
- Preview mode: Show what will be deleted/archived before execution
- Execute mode: Perform actions via Gmail API
- Rate limiting: Respect Gmail API quotas (250 quota units per user per second)
- Batch processing: Process emails in groups of 10 for better progress feedback
- Error handling: Continue with successful actions, report failures

## Coding Standards

### JavaScript
- Use ES6+ syntax (const/let, arrow functions, async/await)
- Define clear function names that describe purpose
- Use async/await, avoid callbacks
- Error handling: try/catch with detailed error messages
- Add comments for complex logic only
- No TypeScript (project uses vanilla JavaScript)

### HTML/CSS
- Semantic HTML5 elements
- Modern CSS with flexbox/grid for layout
- Gradient theme: purple/blue color scheme
- Responsive design principles
- No inline styles in HTML (use CSS classes)
- CSS custom properties for theming

### Appwrite Functions
- Each function should be single-purpose
- Use environment variables for API keys (never hardcode)
- Implement proper error responses (HTTP status codes)
- Log operations for debugging (but never log sensitive data)
- Return structured JSON responses
- Handle CORS appropriately

### Chrome Extension
- Manifest V3 compliance
- Service workers for background tasks (not persistent background pages)
- Message passing between components
- Secure storage using chrome.storage API
- Follow Chrome Web Store policies

### Security
- Never log sensitive data (OAuth tokens, email content, API keys)
- Validate all user inputs
- Use HTTPS for all API calls
- Store API keys in Appwrite Function environment variables
- Implement rate limiting on Appwrite Functions
- Follow OAuth best practices

## Testing Strategy
- Manual testing: Test with real Gmail account (use separate test account)
- Unit tests: Jest for utility functions (not currently implemented)
- Integration tests: Test Appwrite Function endpoints (not currently implemented)
- E2E tests: Manual testing of Chrome extension UI flows
- Test scenarios:
  - Authentication flow
  - Email fetching with pagination
  - AI analysis with various prompts
  - Preview mode display
  - Execute cleanup actions
  - Error handling (API failures, quota limits)

## API Integration Details

### Gmail API
- Base URL: `https://www.googleapis.com/gmail/v1`
- Use batch requests for efficiency where possible
- Handle pagination with pageToken
- Implement exponential backoff for rate limit errors
- Key endpoints:
  - `GET /users/me/messages` - List messages
  - `GET /users/me/messages/{id}` - Get message details
  - `POST /users/me/messages/{id}/trash` - Move to trash
  - `POST /users/me/messages/{id}/modify` - Modify labels (archive, mark read)
- Rate limits: 250 quota units per user per second

### Google Gemini API
- Base URL: `https://generativelanguage.googleapis.com/v1beta`
- Endpoint: `/models/gemini-pro:generateContent`
- API key authentication via query parameter
- Request structure:
  ```json
  {
    "contents": [{
      "parts": [{ "text": "prompt text" }]
    }],
    "generationConfig": {
      "temperature": 0.3,
      "topK": 40,
      "topP": 0.95,
      "maxOutputTokens": 2048
    }
  }
  ```
- Temperature: 0.3 (conservative for consistent results)
- Prompt engineering: Include email metadata + cleanup instructions
- Request JSON response format from AI
- Token management: Keep prompts concise to avoid limits

### Appwrite API
- Base URL: `https://cloud.appwrite.io/v1`
- Authentication: Project ID header (`X-Appwrite-Project`)
- Functions endpoint: `/functions/{functionId}/executions`
- Async execution: Poll for results using execution ID
- Database endpoint: `/databases/{databaseId}/collections/{collectionId}/documents`
- Error handling: Parse error messages from response

## Environment Variables (Appwrite Function)
```
GEMINI_API_KEY=your-gemini-api-key-here
APPWRITE_DATABASE_ID=default
APPWRITE_COLLECTION_ID=analyses
APPWRITE_FUNCTION_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_FUNCTION_PROJECT_ID=your-project-id
APPWRITE_API_KEY=your-api-key
```

## Environment Variables (Extension Configuration)
Configured in popup.js constants:
```javascript
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your-project-id
APPWRITE_FUNCTION_ID=your-function-id
```

Configured in manifest.json:
```json
oauth2.client_id=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
```

## Naming Conventions
- Variables: camelCase (e.g., `emailList`, `currentUser`, `accessToken`)
- Functions: camelCase, verb-first (e.g., `fetchEmails`, `analyzeWithGemini`, `performAction`)
- Constants: UPPER_SNAKE_CASE (e.g., `APPWRITE_ENDPOINT`, `APPWRITE_PROJECT_ID`)
- Files: kebab-case (e.g., `popup.js`, `background.js`, `content.css`)
- HTML IDs: kebab-case (e.g., `login-btn`, `cleanup-prompt`, `progress-section`)
- CSS classes: kebab-case (e.g., `.btn-primary`, `.email-item`, `.progress-bar`)
- Database Collections: snake_case (e.g., `analyses`, `email_classifications`)
- Appwrite Function names: kebab-case (e.g., `gemini-analyzer`)

## Key Features Implementation Notes

### Natural Language Processing
- User inputs plain English prompt (e.g., "Delete all promotional emails older than 3 months")
- Prompt is sent to Gemini AI with email metadata
- AI returns structured JSON with matched email IDs and action
- System uses conservative matching (only clear matches)

### Preview Mode
- Always enabled by default via checkbox
- Shows list of emails before any action
- Displays: subject, sender, date for each matched email
- Shows summary: total emails, matched count, action type
- User must explicitly click "Execute Cleanup" to proceed

### Progress Tracking
- Visual progress bar with percentage
- Step-by-step text updates: "Fetching emails...", "Analyzing...", "Processing..."
- Non-blocking UI (async operations)
- Error messages displayed in dedicated error section

### Gmail UI Integration
- Floating button injected into Gmail pages
- Content script observes email list changes
- Highlights matched emails in preview mode
- Smooth animations and transitions

## Error Handling Patterns

### Authentication Errors
- Invalid/expired token → Trigger re-authentication
- Permission denied → Show error message, guide to re-authorize
- Catch chrome.identity errors gracefully

### API Errors
- Network failure → Retry with exponential backoff
- Rate limit exceeded → Show user-friendly quota message
- Invalid response → Fallback to local analysis
- Appwrite Function timeout → Show error, suggest retry

### User Input Errors
- Empty prompt → Validation message
- No emails found → Inform user
- No matches → Show "No emails matched your criteria"

### Fallback Strategies
- If Gemini API fails → Use local keyword-based analysis
- If Gmail API rate limited → Queue operations, show estimated wait time
- If Appwrite unavailable → Continue with local-only features

## Performance Optimizations

### Caching
- Cache OAuth tokens in chrome.storage
- Store user preferences locally
- Cache classification results temporarily

### Batch Processing
- Fetch emails in batches of 100 (Gmail API default)
- Process actions in batches of 10 for better progress tracking
- Use Promise.all for parallel operations where safe

### Async Operations
- All network calls are async
- Non-blocking UI updates
- Progressive loading with visual feedback

## Chrome Web Store Publishing Guidelines

### Required Assets
- Icon sizes: 16x16, 48x48, 128x128 PNG
- Screenshots: 1280x800 or 640x400 (minimum 1, recommended 5)
- Promotional images: Optional but recommended
- Demo video: Optional but helpful for users

### Store Listing Content
- Detailed description: Explain features, benefits, how it works
- Single purpose description: "AI-powered Gmail inbox cleanup"
- Permission justifications: Explain each permission clearly
- Privacy policy URL: Required if collecting/transmitting user data
- Category: Productivity
- Language: English (primary)

### Privacy & Data Handling
- Declare data usage: Email access, OAuth tokens
- Explain data transmission: Emails sent to Gemini API via Appwrite
- Clarify data storage: Temporary in-memory, optional history in Appwrite
- User controls: Full control over what actions to take

### Review Process
- Average review time: 1-3 business days
- Be prepared to respond to reviewer questions
- Provide test account if needed
- Follow Chrome Web Store policies strictly

## Development Workflow

### Local Development
1. Clone repository
2. Configure environment variables (see .env.example)
3. Set up Google Cloud OAuth credentials
4. Set up Appwrite project and function
5. Load extension in Chrome Developer mode
6. Test with personal Gmail test account

### Deployment
1. Update version in manifest.json
2. Test all features thoroughly
3. Deploy Appwrite Function updates
4. Package extension (zip file)
5. Upload to Chrome Web Store
6. Submit for review

### Debugging
- Use Chrome DevTools for frontend debugging
- Check Service Worker console for background errors
- View Appwrite Function logs for backend issues
- Test with Chrome extension logs enabled
- Use network tab to monitor API calls

## Best Practices

### Code Quality
- Keep functions small and focused
- Use meaningful variable names
- Add JSDoc comments for complex functions
- Handle edge cases gracefully
- Write defensive code (null checks, type validation)

### User Experience
- Provide clear feedback for all actions
- Use loading states during async operations
- Show helpful error messages (not technical jargon)
- Implement undo capability where possible
- Respect user's time (fast performance)

### Security & Privacy
- Minimize data collection
- Encrypt sensitive data in transit
- Follow principle of least privilege
- Regular security audits
- Keep dependencies updated

### Maintenance
- Monitor user feedback and reviews
- Track error rates and API usage
- Keep documentation updated
- Respond to security issues promptly
- Plan for Gmail API changes

## Common Pitfalls to Avoid

1. **OAuth Scope Creep**: Only request necessary Gmail scopes
2. **Rate Limiting**: Always implement backoff, respect quotas
3. **Error Swallowing**: Log errors appropriately, inform user
4. **Hardcoded Credentials**: Use environment variables always
5. **Blocking UI**: Keep all network operations async
6. **Insufficient Testing**: Test with various email volumes and types
7. **Poor Error Messages**: Be specific and helpful to users
8. **Memory Leaks**: Clean up listeners and intervals properly
9. **API Key Exposure**: Never commit keys to version control
10. **Ignoring Privacy**: Be transparent about data handling

## Resources

### Documentation Links
- Gmail API: https://developers.google.com/gmail/api
- Chrome Extensions: https://developer.chrome.com/docs/extensions
- Gemini AI: https://ai.google.dev/docs
- Appwrite: https://appwrite.io/docs
- Chrome Web Store: https://developer.chrome.com/docs/webstore

### Example Prompts for Testing
```
✅ "Delete all promotional emails older than 3 months"
✅ "Archive newsletters from last year"
✅ "Mark all LinkedIn notifications as read"
✅ "Remove emails with unsubscribe links from the last 6 months"
✅ "Delete all emails from no-reply addresses older than 1 month"
✅ "Archive all automated reports from 2023"
```

## Project Status
This is a working Chrome extension that successfully:
- Authenticates with Gmail using OAuth 2.0
- Fetches and displays email data
- Analyzes emails using Gemini AI via Appwrite Functions
- Provides preview mode for safe cleanup
- Executes cleanup actions (delete, archive, mark as read)
- Integrates with Gmail UI via content script

Current focus areas:
- Improving error handling and user feedback
- Optimizing API usage and performance
- Expanding documentation and examples
- Preparing for Chrome Web Store submission
