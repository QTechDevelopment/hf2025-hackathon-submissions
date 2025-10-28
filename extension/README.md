# AI Email Cleaner - Gmail Extension with Gemini AI

A powerful browser extension that helps you intelligently clean up your Gmail inbox using AI. Simply describe what emails you want to clean up in natural language, preview matches, and let AI suggest replies before cleaning up!

## Features

- 🤖 **AI-Powered Analysis**: Uses AI to understand your cleanup requests in natural language
- 📧 **Gmail Integration**: Seamlessly connects with Gmail API for email access
- 🔍 **Staging Preview**: Review and select specific emails before taking action (non-destructive preview)
- 💬 **AI-Suggested Replies**: Get intelligent reply suggestions for emails before cleanup
- ✉️ **Draft Creation**: Create draft replies directly from suggestions
- 🗑️ **Multiple Actions**: Delete, archive, mark as read, or apply custom labels
- 🏷️ **Custom Labels**: Create and apply custom labels to matched emails
- 🔒 **Secure Authentication**: Uses OAuth 2.0 for secure Gmail access with gmail.send permission
- ⚡ **Fast Processing**: Batch processes emails efficiently (up to 50 emails per preview)

## New in Version 0.2.0

### Staging Preview
- **Non-destructive preview**: View matched emails before executing any actions
- **Selective execution**: Choose which specific messages to act on using checkboxes
- **Action override**: Manually select action (delete/archive/mark_read/label) instead of auto-detection
- **Custom labels**: Create and apply custom Gmail labels to matched messages

### AI-Suggested Replies
- **Smart suggestions**: AI analyzes your emails and suggests 3-5 appropriate replies
- **Copy to clipboard**: Quickly copy suggested text for manual replies
- **Create drafts**: Automatically create Gmail drafts with suggested replies for selected messages
- **Sample-based analysis**: Suggestions based on first 5 matched messages for efficiency

### Server AI Proxy
- **New endpoint**: `/ai/suggestReplies` generates intelligent reply suggestions
- **Existing endpoint**: `/ai/parse` converts natural language to Gmail queries
- **Provider flexibility**: Configured for Azure OpenAI but supports Gemini and other providers
- **Security**: All API keys stored server-side, never exposed in extension

## Installation

### Prerequisites

1. Google Chrome or compatible Chromium-based browser
2. Appwrite account (free at [appwrite.io](https://appwrite.io))
3. Google Cloud Project with Gmail API enabled
4. Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Setup Steps

#### 1. Clone/Download the Extension

```bash
git clone https://github.com/your-username/ai-email-cleaner-extension.git
cd ai-email-cleaner-extension
```

#### 2. Configure Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable the Gmail API
4. Create OAuth 2.0 credentials:
   - Application type: Chrome Extension
   - Add your extension ID (you'll get this after loading the extension)
5. **Important**: Add the following OAuth scopes:
   - `https://www.googleapis.com/auth/gmail.modify` (read and modify Gmail)
   - `https://www.googleapis.com/auth/gmail.readonly` (read Gmail)
   - `https://www.googleapis.com/auth/gmail.send` (send and create drafts) **NEW in v0.2.0**
6. Download the OAuth client configuration

#### 3. Deploy AI Proxy Server

The extension requires a server to handle AI requests (keeps API keys secure):

1. Navigate to the server directory:
```bash
cd extension/server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from example:
```bash
cp .env.example .env
```

4. Configure your AI provider in `.env`:
```bash
# For Azure OpenAI
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_DEPLOYMENT=gpt-4
AZURE_API_VERSION=2024-02-15-preview

# Or use another provider (Gemini, OpenAI, etc.)
```

5. Run the server:
```bash
npm start
# Server will run on http://localhost:3000
```

6. For production, deploy to a cloud service (Heroku, Railway, Render, etc.) and update the `AI_SERVER_URL` in both `src/popup.js` and `src/background.js`

#### 4. Configure Extension Files

Edit `src/popup.js` and `src/background.js` to update the AI server URL:

```javascript
const AI_SERVER_URL = 'https://your-deployed-server.com'; // Update this
```

Edit `manifest.json` and update:

```json
"oauth2": {
  "client_id": "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
  "scopes": [
    "https://www.googleapis.com/auth/gmail.modify",
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.send"
  ]
}
```

#### 5. Load Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `extension` folder
5. Copy the Extension ID shown
6. Update your Google OAuth configuration with this Extension ID

## Usage

### Basic Staging Preview Workflow

1. **Authenticate**: Click the extension icon and click "Authenticate with Gmail"
2. **Enter Command**: Describe what emails you want to manage:
   - "Delete all promotional emails older than 3 months"
   - "Archive newsletters from last year"
   - "Mark all unread LinkedIn emails as read"
   - "Label receipts from Amazon as 'Receipts'"

3. **Preview Matches**: Click "Preview Matches" to see:
   - List of matched emails with checkboxes
   - Parsed action and Gmail query
   - AI-suggested reply options (if applicable)

4. **Select Messages**: Use checkboxes to select/deselect specific messages

5. **Review Suggestions**: Review AI-generated reply suggestions
   - Click "Copy" to copy suggestion text
   - Click "Create Drafts" to create Gmail drafts for selected messages

6. **Execute**: Click "Confirm & Execute" to perform the action on selected messages

### Advanced Features

#### Manual Action Override
Instead of letting AI detect the action, you can manually select:
- Delete
- Archive
- Mark as Read
- Add Label (with custom label name)

#### Creating Draft Replies
1. Preview your emails
2. Review AI suggestions in the "AI-Suggested Replies" section
3. Select messages you want to reply to (using checkboxes)
4. Click "Create Drafts" on your preferred suggestion
5. Drafts will be created in Gmail for manual review before sending

#### Custom Labels
1. Select "Add Label" from the action dropdown
2. Enter your desired label name
3. The extension will create the label if it doesn't exist
4. Selected messages will be tagged with the label

### Security Best Practices

- **Non-destructive preview**: Always review matched messages before executing
- **No auto-send**: Drafts are created but never automatically sent
- **Selective execution**: Choose exactly which messages to act on
- **Server-side AI**: API keys never exposed in the extension

## Example Commands

```
✅ Delete all promotional emails older than 6 months
✅ Archive all newsletters I haven't read from 2023
✅ Mark all LinkedIn notifications as read
✅ Delete emails with unsubscribe links older than 3 months
✅ Archive all automated reports from last year
✅ Label all receipts from Amazon as 'Receipts'
✅ Delete all social media notifications older than 1 month
```

## Technical Architecture

### Components

1. **Extension Frontend** (`src/`)
   - `popup.html` - Staging UI with preview pane and suggestions
   - `popup.js` - Logic for preview, selection, and draft creation
   - `popup.css` - Gradient theme styling
   - OAuth authentication flow
   - Gmail API integration

2. **Background Service Worker** (`src/background.js`)
   - Manages OAuth authentication state
   - Handles message passing between popup and APIs
   - Implements preview and execute flows
   - Calls Gmail API for operations (list, modify, create drafts)

3. **Gmail Client Helper** (`src/gmailClient.js`)
   - `listMessageIds()` - Search Gmail with queries
   - `getMessageDetails()` - Fetch message metadata in chunks
   - `batchModify()` - Perform bulk operations
   - `ensureLabelExists()` - Create/lookup custom labels
   - `createDraftReply()` - Create draft emails with proper MIME encoding

4. **AI Proxy Server** (`server/`)
   - `POST /ai/parse` - Parse natural language commands into Gmail queries
   - `POST /ai/suggestReplies` - Generate reply suggestions from sample messages
   - Azure OpenAI integration (swappable with Gemini or others)
   - Keeps API keys secure server-side

5. **Content Script** (`scripts/content.js`)
   - Runs on Gmail pages
   - Provides floating action button
   - Highlights emails in preview mode (optional)

### Data Flow

```
1. Preview Flow (Non-destructive):
   User Command → AI Server (/ai/parse) → Parsed Query
                              ↓
   Background Worker → Gmail API (list messages) → Message IDs
                              ↓
   Background Worker → Gmail API (get details) → Message Metadata
                              ↓
   Background Worker → AI Server (/ai/suggestReplies) → Suggestions
                              ↓
   Popup UI ← Preview Data (parsed, messages, suggestions)

2. Execute Flow (Destructive):
   User Confirms → Background Worker → Gmail API (batch modify)
                              ↓
   Result ← Success/Failure Counts

3. Draft Creation Flow:
   Selected Messages + Suggestion → Background Worker
                              ↓
   For each message: Gmail API (create draft) → Draft Created
```

## Privacy & Security

- **No Email Storage**: Emails are never stored, only analyzed in real-time (up to 50 messages previewed)
- **OAuth Security**: Uses Google's secure OAuth 2.0 for authentication
- **User Control**: All destructive actions require explicit user confirmation
- **Selective Execution**: Users choose exactly which messages to act on via checkboxes
- **Server-side API Keys**: AI API keys kept secure on server, never in extension code
- **Draft-Only Replies**: Suggested replies create drafts, never auto-send
- **Minimal Scopes**: Only requests necessary Gmail permissions (modify, readonly, send)
- **Open Source**: Full source code available for review

## Development

### Project Structure

```
extension/
├── manifest.json           # Extension configuration
├── popup/
│   ├── popup.html         # Main UI
│   ├── popup.css          # Styles
│   └── popup.js           # Logic and API calls
├── scripts/
│   ├── background.js      # Service worker
│   └── content.js         # Gmail page integration
├── styles/
│   └── content.css        # Content script styles
├── icons/                 # Extension icons
└── appwrite-functions/
    └── gemini-analyzer/   # Appwrite Function code
        ├── main.js
        └── package.json
```

### Local Development

```bash
# Install Appwrite Function dependencies
cd extension/appwrite-functions/gemini-analyzer
npm install

# Deploy function to Appwrite
appwrite deploy function
```

## Troubleshooting

### Common Issues

**Login fails**
- Check that OAuth client ID is correct in manifest.json
- Ensure Gmail API is enabled in Google Cloud Console
- Verify redirect URIs are configured correctly

**Analysis doesn't work**
- Verify Gemini API key is set in Appwrite Function
- Check Appwrite Function logs for errors
- Ensure function has proper permissions

**Emails not being deleted**
- Check that Gmail API scope includes `gmail.modify`
- Verify OAuth token is valid
- Check browser console for API errors

### Debug Mode

Open browser DevTools → Console to see detailed logs:
- Extension popup logs
- Background service worker logs
- Content script logs

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

BSD 3-Clause License - see LICENSE file for details

## Acknowledgments

- Built with [Appwrite](https://appwrite.io)
- Powered by [Google Gemini AI](https://ai.google.dev)
- Uses [Gmail API](https://developers.google.com/gmail/api)

## Support

For issues and questions:
- Open an issue on GitHub
- Check the [FAQ](docs/FAQ.md)
- Email: support@example.com

---

**Note**: This extension requires appropriate API keys and configuration. Never commit sensitive credentials to version control.
