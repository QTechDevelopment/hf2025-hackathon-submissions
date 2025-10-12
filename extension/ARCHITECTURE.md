# Architecture Documentation

## Overview

The AI Email Cleaner is a Chrome extension that integrates with Gmail and uses Google's Gemini AI (via Appwrite Functions) to intelligently analyze and clean up email inboxes based on natural language prompts.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User Interface                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   Popup UI   │  │Content Script│  │  Gmail Page UI   │  │
│  └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘  │
└─────────┼──────────────────┼───────────────────┼────────────┘
          │                  │                   │
          │                  │                   │
          └──────────────────┴───────────────────┘
                             │
                    ┌────────▼────────┐
                    │ Service Worker  │
                    │  (Background)   │
                    └────────┬────────┘
                             │
          ┌──────────────────┴──────────────────┐
          │                                     │
   ┌──────▼──────┐                    ┌────────▼────────┐
   │  Gmail API  │                    │Appwrite Services│
   │             │                    │                 │
   │ - List      │                    │ - Auth          │
   │ - Read      │                    │ - Database      │
   │ - Modify    │                    │ - Functions     │
   │ - Trash     │                    └────────┬────────┘
   └─────────────┘                             │
                                      ┌────────▼────────┐
                                      │  Gemini API     │
                                      │                 │
                                      │ - Analyze       │
                                      │ - Classify      │
                                      └─────────────────┘
```

## Components

### 1. Extension Frontend (Popup)

**Files**: `popup/popup.html`, `popup/popup.css`, `popup/popup.js`

**Responsibilities**:
- User authentication (Google OAuth)
- Prompt input interface
- Display analysis results
- Execute cleanup actions
- Show progress indicators

**Key Functions**:
- `handleGoogleLogin()`: OAuth flow with Gmail
- `handleAnalyze()`: Fetch emails and send to AI
- `handleExecute()`: Perform cleanup actions
- `fetchEmails()`: Get emails from Gmail API
- `analyzeWithGemini()`: Call Appwrite Function

### 2. Background Service Worker

**File**: `scripts/background.js`

**Responsibilities**:
- Manage authentication state
- Handle message passing between components
- Perform background email operations
- Manage alarms for scheduled tasks
- Cache and store settings

**Key Functions**:
- `handleAnalyzeEmails()`: Process analysis requests
- `handleExecuteCleanup()`: Execute email actions
- `performEmailAction()`: Gmail API calls

### 3. Content Script

**Files**: `scripts/content.js`, `styles/content.css`

**Responsibilities**:
- Inject UI elements into Gmail pages
- Provide quick access button
- Highlight emails for preview
- Extract visible email data
- Enhanced user experience

**Key Functions**:
- `injectCleanerUI()`: Add floating button
- `observeEmailList()`: Watch for new emails
- `highlightEmails()`: Visual feedback
- `getVisibleEmails()`: Extract email data from DOM

### 4. Appwrite Function

**File**: `appwrite-functions/gemini-analyzer/main.js`

**Responsibilities**:
- Receive email data and prompts
- Call Gemini AI API
- Parse AI responses
- Store analysis history
- Return matched emails

**Key Functions**:
- Main handler: Process requests
- Gemini API integration
- Database operations for history
- Error handling and logging

## Data Flow

### Email Analysis Flow

```
1. User enters prompt
   ↓
2. Extension fetches emails from Gmail API
   ↓
3. Extension sends to Appwrite Function
   {
     emails: [...],
     prompt: "user input",
     userId: "user@email.com"
   }
   ↓
4. Appwrite Function calls Gemini API
   - Sends structured prompt with email data
   - Receives AI analysis
   ↓
5. Gemini returns analysis
   {
     action: "delete|archive|markRead",
     matchedEmailIds: [...],
     summary: "...",
     reasoning: "..."
   }
   ↓
6. Function stores in database
   ↓
7. Function returns to extension
   ↓
8. Extension displays results to user
   ↓
9. User confirms execution
   ↓
10. Extension calls Gmail API to perform actions
```

### Authentication Flow

```
1. User clicks "Login with Google"
   ↓
2. Chrome.identity.getAuthToken()
   - Opens OAuth consent screen
   - User authorizes Gmail access
   ↓
3. Extension receives access token
   ↓
4. Token stored in chrome.storage.local
   ↓
5. Fetch user profile from Google
   ↓
6. Display main UI with user info
```

## Security Architecture

### Authentication & Authorization

1. **OAuth 2.0**: Google OAuth for Gmail access
   - Scopes: `gmail.modify`, `gmail.readonly`
   - Token managed by Chrome identity API
   - Automatic refresh handling

2. **Appwrite Auth**: User authentication for database access
   - JWT tokens for API calls
   - Session management
   - Rate limiting

### Data Privacy

1. **No Email Storage**: 
   - Emails analyzed in real-time only
   - Never stored in database or logs
   - Only metadata stored (subject, from, date)

2. **API Security**:
   - All API calls over HTTPS
   - API keys stored as environment variables
   - No credentials in client code

3. **User Control**:
   - Preview mode by default
   - Explicit confirmation required
   - All actions are reversible (trash, not delete)

## API Integration

### Gmail API

**Base URL**: `https://www.googleapis.com/gmail/v1`

**Key Endpoints**:
- `GET /users/me/messages` - List messages
- `GET /users/me/messages/{id}` - Get message details
- `POST /users/me/messages/{id}/trash` - Move to trash
- `POST /users/me/messages/{id}/modify` - Modify labels

**Rate Limits**:
- 250 quota units per user per second
- 1,000,000,000 quota units per day

### Gemini API

**Base URL**: `https://generativelanguage.googleapis.com/v1beta`

**Key Endpoints**:
- `POST /models/gemini-pro:generateContent` - Generate content

**Models Used**:
- `gemini-pro` - Text generation and analysis

**Configuration**:
- Temperature: 0.3 (conservative)
- TopK: 40
- TopP: 0.95
- MaxOutputTokens: 2048

### Appwrite API

**Base URL**: `https://cloud.appwrite.io/v1`

**Services Used**:
1. **Functions**: Execute serverless code
   - `POST /functions/{id}/executions` - Create execution
   - `GET /functions/{id}/executions/{executionId}` - Get result

2. **Databases**: Store analysis history
   - `POST /databases/{id}/collections/{id}/documents` - Create
   - `GET /databases/{id}/collections/{id}/documents` - List

## Scalability Considerations

### Performance Optimizations

1. **Batch Processing**:
   - Process emails in batches of 10
   - Reduce API call overhead
   - Better progress feedback

2. **Caching**:
   - Cache user settings locally
   - Store auth tokens in chrome.storage
   - Reduce redundant API calls

3. **Async Operations**:
   - All network calls are async
   - Non-blocking UI updates
   - Progressive loading

### Rate Limiting

1. **Gmail API**:
   - Respect quota limits
   - Implement exponential backoff
   - Show quota errors to user

2. **Gemini API**:
   - Free tier limitations
   - Cache common patterns
   - Batch similar requests

3. **Appwrite**:
   - Function execution limits
   - Database query limits
   - Monitor usage metrics

## Error Handling

### Error Categories

1. **Authentication Errors**:
   - Invalid token → Re-authenticate
   - Expired token → Refresh token
   - Permission denied → Show error

2. **API Errors**:
   - Network failure → Retry with backoff
   - Rate limit → Show quota message
   - Invalid response → Fallback analysis

3. **User Errors**:
   - Empty prompt → Validation message
   - No emails → Inform user
   - Invalid selection → Clear selection

### Fallback Strategies

1. **Local Analysis**: If Gemini unavailable
   - Keyword matching
   - Date-based filtering
   - Sender-based filtering

2. **Partial Success**: If some actions fail
   - Continue with successful actions
   - Report failures to user
   - Offer retry option

## Testing Strategy

### Unit Tests

- Test individual functions
- Mock API responses
- Validate data transformations

### Integration Tests

- Test API integrations
- Verify OAuth flow
- Check database operations

### End-to-End Tests

- Full user workflows
- Cross-browser testing
- Performance testing

### Manual Testing

- UI/UX testing
- Error scenario testing
- Security testing

## Deployment

### Development Environment

```bash
# Load extension locally
chrome://extensions/ → Load unpacked

# Test Appwrite Function
appwrite functions create-execution --functionId=... --data=...
```

### Production Environment

1. **Extension**:
   - Package as .zip
   - Submit to Chrome Web Store
   - Review process

2. **Appwrite Function**:
   - Deploy via Appwrite CLI
   - Set production environment variables
   - Monitor logs

### Monitoring

1. **Extension Metrics**:
   - Chrome extension analytics
   - Error tracking (Sentry)
   - User feedback

2. **Appwrite Metrics**:
   - Function execution logs
   - Database query metrics
   - API usage statistics

## Future Enhancements

### Planned Features

1. **Scheduled Cleanup**:
   - Weekly/monthly automatic cleanup
   - Custom schedules
   - Email reports

2. **Custom Rules**:
   - Save frequently used prompts
   - Create rule templates
   - Share rules with team

3. **Advanced Filters**:
   - Attachment-based filtering
   - Size-based filtering
   - Advanced date ranges

4. **Multi-Account Support**:
   - Manage multiple Gmail accounts
   - Bulk operations across accounts
   - Unified dashboard

5. **Analytics Dashboard**:
   - Cleanup statistics
   - Space saved metrics
   - Email trends

### Technical Improvements

1. **Performance**:
   - Implement worker threads
   - Add request caching
   - Optimize bundle size

2. **AI Enhancement**:
   - Fine-tune prompts
   - Use Gemini-Pro-Vision for images
   - Implement learning from user feedback

3. **Security**:
   - Add E2E encryption
   - Implement audit logging
   - Enhanced permission controls

## Contributing

See [SETUP.md](SETUP.md) for development setup instructions.

## License

BSD 3-Clause License - See LICENSE file for details.
