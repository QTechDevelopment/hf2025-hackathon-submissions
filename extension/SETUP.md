# Setup Guide for AI Email Cleaner Extension

This guide will walk you through setting up the AI Email Cleaner extension step by step.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Google Cloud Setup](#google-cloud-setup)
3. [Appwrite Setup](#appwrite-setup)
4. [Gemini API Setup](#gemini-api-setup)
5. [Extension Configuration](#extension-configuration)
6. [Testing](#testing)

## Prerequisites

Before you begin, make sure you have:

- ✅ A Google account
- ✅ A Chrome browser (or Chromium-based browser)
- ✅ An Appwrite account (sign up at [appwrite.io](https://appwrite.io))
- ✅ Basic familiarity with browser extensions

## Google Cloud Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click "Select a project" → "New Project"
3. Name it "AI Email Cleaner" (or your preferred name)
4. Click "Create"

### Step 2: Enable Gmail API

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Gmail API"
3. Click on it and press "Enable"

### Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - User Type: External
   - App name: AI Email Cleaner
   - User support email: Your email
   - Developer contact: Your email
   - Add scopes:
     - `https://www.googleapis.com/auth/gmail.modify`
     - `https://www.googleapis.com/auth/gmail.readonly`
   - Add test users (your Gmail account)

4. Create OAuth Client ID:
   - Application type: Chrome Extension
   - Name: AI Email Cleaner Extension
   - Application ID: (You'll add this after loading the extension - see step 5)

5. After creating, **save your Client ID** - you'll need it later

### Step 4: Load Extension to Get Extension ID

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right corner)
3. Click "Load unpacked"
4. Select the `extension` folder from this project
5. **Copy the Extension ID** shown under your extension

### Step 5: Complete OAuth Configuration

1. Go back to Google Cloud Console → Credentials
2. Edit your OAuth client
3. Add the Extension ID you just copied
4. Save changes

## Appwrite Setup

### Step 1: Create Appwrite Project

1. Go to [Appwrite Cloud Console](https://cloud.appwrite.io)
2. Create a new project:
   - Name: AI Email Cleaner
   - Copy the **Project ID**

### Step 2: Create Database

1. In your project, go to "Databases"
2. Click "Create Database"
3. Name: EmailCleanerDB
4. Database ID: `default`
5. Click "Create"

### Step 3: Create Collection

1. Inside your database, click "Create Collection"
2. Name: analyses
3. Collection ID: `analyses`
4. Enable "Document Security"
5. Create these attributes:

| Key | Type | Size | Required |
|-----|------|------|----------|
| userId | String | 255 | Yes |
| prompt | String | 1000 | Yes |
| totalEmails | Integer | - | Yes |
| matchedCount | Integer | - | Yes |
| action | String | 50 | Yes |
| summary | String | 2000 | Yes |
| timestamp | DateTime | - | Yes |

6. Create indexes:
   - Index 1: key=`userId_idx`, type=key, attributes=[userId], order=ASC
   - Index 2: key=`timestamp_idx`, type=key, attributes=[timestamp], order=DESC

### Step 4: Set Permissions

1. In the collection settings, set permissions:
   - Create: Any authenticated user
   - Read: User (document creator)
   - Update: User (document creator)
   - Delete: User (document creator)

### Step 5: Create Appwrite Function

1. Go to "Functions" in your project
2. Click "Create Function"
3. Configuration:
   - Name: gemini-analyzer
   - Runtime: Node.js 18
   - Execute Access: Any
   - Events: (leave empty)

4. Upload function code:
   ```bash
   cd extension/appwrite-functions/gemini-analyzer
   npm install
   # Then use Appwrite CLI or manual upload
   ```

5. Set environment variables (in Function Settings):
   - `GEMINI_API_KEY`: (you'll get this in the next section)
   - `APPWRITE_DATABASE_ID`: `default`
   - `APPWRITE_COLLECTION_ID`: `analyses`

6. Copy the **Function ID**

## Gemini API Setup

### Step 1: Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Select your Google Cloud project (or create a new one)
4. Click "Create API key in new project" or "Create API key in existing project"
5. **Copy your API key** and save it securely

### Step 2: Add API Key to Appwrite Function

1. Go back to Appwrite Console → Functions → gemini-analyzer
2. Go to Settings → Variables
3. Add or update `GEMINI_API_KEY` with your Gemini API key
4. Save

## Extension Configuration

### Step 1: Update manifest.json

Open `extension/manifest.json` and update:

```json
"oauth2": {
  "client_id": "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
  "scopes": [
    "https://www.googleapis.com/auth/gmail.modify",
    "https://www.googleapis.com/auth/gmail.readonly"
  ]
}
```

Replace `YOUR_GOOGLE_CLIENT_ID` with your actual Google OAuth Client ID.

### Step 2: Update popup.js

Open `extension/popup/popup.js` and update these constants at the top:

```javascript
const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = 'your-project-id-here';
const APPWRITE_FUNCTION_ID = 'your-function-id-here';
```

Replace with your actual Appwrite Project ID and Function ID.

### Step 3: Reload Extension

1. Go to `chrome://extensions/`
2. Click the reload icon on your extension
3. The extension is now configured!

## Testing

### Step 1: Test Authentication

1. Click the extension icon in Chrome toolbar
2. Click "Login with Google"
3. Authorize the extension to access your Gmail
4. You should see your email address displayed

### Step 2: Test Email Analysis

1. Enter a test prompt: "Show me promotional emails"
2. Click "Analyze Emails"
3. Wait for the analysis to complete
4. Review the results

### Step 3: Test Preview Mode

1. Keep "Preview mode" checked
2. Analyze emails again
3. Review the list of emails that would be affected
4. Cancel if you don't want to proceed

### Step 4: Test Cleanup Execution

⚠️ **Warning**: This will actually modify your emails!

1. Enter a safe prompt: "Mark emails from newsletters as read"
2. Analyze emails
3. Review carefully
4. Click "Execute Cleanup"
5. Confirm the action
6. Check your Gmail to verify

## Troubleshooting

### "Failed to login" error

- Check that your OAuth Client ID is correct in manifest.json
- Verify the extension ID in Google Cloud Console matches your actual extension ID
- Make sure Gmail API is enabled
- Check that you've added your email as a test user in OAuth consent screen

### "Failed to analyze emails" error

- Verify Appwrite configuration is correct
- Check that Gemini API key is set in Appwrite Function
- Look at Appwrite Function logs for detailed error messages
- Ensure Function has proper permissions

### Extension doesn't appear in Gmail

- Make sure the extension is enabled in `chrome://extensions/`
- Check that you're on mail.google.com
- Refresh the Gmail page
- Check browser console for errors

### Gemini API quota exceeded

- Gemini API has rate limits on free tier
- Consider upgrading to a paid plan if needed
- Implement caching in the function to reduce API calls

## Production Deployment

For production deployment:

1. **Icons**: Replace placeholder icons in `icons/` folder with actual icon images (16x16, 48x48, 128x128 PNG files)

2. **OAuth Consent**: Submit your app for verification if you want users outside your test users list

3. **Error Handling**: Add comprehensive error handling and logging

4. **Rate Limiting**: Implement rate limiting for API calls

5. **Testing**: Thoroughly test with various email scenarios

6. **Privacy Policy**: Create and host a privacy policy

7. **Chrome Web Store**: Publish to Chrome Web Store for easier distribution

## Security Notes

🔒 **Never commit sensitive data**:
- Don't commit API keys
- Don't commit OAuth credentials
- Use environment variables
- Add sensitive files to `.gitignore`

🔐 **User Privacy**:
- Emails are analyzed in real-time, never stored
- Analysis history only stores metadata (no email content)
- Users control all actions
- OAuth tokens are managed securely by Chrome

## Next Steps

After successful setup:

1. Test with various email cleanup scenarios
2. Customize the UI to your preferences
3. Add more features (scheduled cleanup, custom filters, etc.)
4. Deploy to production
5. Gather user feedback

## Support

If you run into issues:

1. Check browser console for errors
2. Review Appwrite Function logs
3. Verify all configuration settings
4. Check API quotas and limits
5. Open an issue on GitHub

---

**Congratulations! Your AI Email Cleaner extension is now set up and ready to use! 🎉**
