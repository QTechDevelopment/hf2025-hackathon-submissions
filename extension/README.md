# AI Email Cleaner - Gmail Extension with Gemini AI

A powerful browser extension that helps you intelligently clean up your Gmail inbox using Google's Gemini AI. Simply describe what emails you want to clean up in natural language, and let AI do the work!

## Features

- 🤖 **AI-Powered Analysis**: Uses Google Gemini AI to understand your cleanup requests in natural language
- 📧 **Gmail Integration**: Seamlessly connects with Gmail API for email access
- 🔍 **Preview Mode**: Review emails before taking action
- 🗑️ **Multiple Actions**: Delete, archive, or mark emails as read
- 🔒 **Secure Authentication**: Uses OAuth 2.0 for secure Gmail access
- 💾 **History Tracking**: Stores your cleanup history in Appwrite Database
- ⚡ **Fast Processing**: Batch processes emails efficiently

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
5. Download the OAuth client configuration

#### 3. Configure Appwrite

1. Create a new project in [Appwrite Console](https://cloud.appwrite.io)
2. Enable Authentication (OAuth providers)
3. Create a Database with these collections:
   - `analyses`: Store email analysis history
     - userId (string)
     - prompt (string)
     - totalEmails (integer)
     - matchedCount (integer)
     - action (string)
     - summary (string)
     - timestamp (datetime)

4. Create a Function:
   - Name: `gemini-analyzer`
   - Runtime: Node.js 18
   - Upload the code from `appwrite-functions/gemini-analyzer/`
   - Set environment variables:
     - `GEMINI_API_KEY`: Your Gemini API key
     - `APPWRITE_DATABASE_ID`: Your database ID
     - `APPWRITE_COLLECTION_ID`: Your collection ID

#### 4. Update Configuration

Edit `popup/popup.js` and update these constants:

```javascript
const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = 'your-project-id';
const APPWRITE_FUNCTION_ID = 'your-function-id';
```

Edit `manifest.json` and update:

```json
"oauth2": {
  "client_id": "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
  "scopes": [
    "https://www.googleapis.com/auth/gmail.modify",
    "https://www.googleapis.com/auth/gmail.readonly"
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

### Basic Usage

1. Click the extension icon in your browser toolbar
2. Log in with your Google account
3. Enter a natural language prompt describing what emails to clean up, for example:
   - "Delete all promotional emails older than 3 months"
   - "Archive newsletters from last year"
   - "Mark all unread emails from LinkedIn as read"
   - "Delete emails from no-reply addresses older than 6 months"

4. Click "Analyze Emails" to see what will be affected
5. Review the preview list
6. Click "Execute Cleanup" to perform the action

### Advanced Usage

- **Preview Mode**: Keep preview mode enabled to always review before executing
- **Gmail Integration**: The floating "AI Clean" button appears on Gmail pages for quick access
- **Custom Prompts**: Be specific with your cleanup criteria for better results

## Example Prompts

```
✅ Delete all promotional emails older than 6 months
✅ Archive all newsletters I haven't read from 2023
✅ Mark all LinkedIn notifications as read
✅ Delete emails with unsubscribe links older than 3 months
✅ Archive all automated reports from last year
✅ Delete all social media notifications older than 1 month
```

## Technical Architecture

### Components

1. **Extension Frontend** (`popup/`)
   - User interface for prompts and email management
   - OAuth authentication flow
   - Gmail API integration

2. **Content Script** (`scripts/content.js`)
   - Runs on Gmail pages
   - Provides floating action button
   - Highlights emails in preview mode

3. **Background Service Worker** (`scripts/background.js`)
   - Manages authentication state
   - Handles message passing
   - Performs email actions via Gmail API

4. **Appwrite Function** (`appwrite-functions/gemini-analyzer/`)
   - Receives emails and user prompt
   - Calls Gemini AI for analysis
   - Returns matched emails and recommended actions
   - Stores analysis history

### Data Flow

```
User Input → Extension → Gmail API (fetch emails)
                    ↓
            Appwrite Function → Gemini AI (analyze)
                    ↓
            Extension ← Analysis Results
                    ↓
            Gmail API (perform actions)
```

## Privacy & Security

- **No Data Storage**: Emails are never stored, only analyzed in real-time
- **OAuth Security**: Uses Google's secure OAuth 2.0 for authentication
- **User Control**: All actions require explicit user confirmation
- **Appwrite Security**: All API calls are authenticated and rate-limited
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
