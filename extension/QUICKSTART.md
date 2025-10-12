# Quick Start Guide

Get started with AI Email Cleaner in 5 minutes!

## 📦 Installation

### Option 1: Install from Chrome Web Store (Coming Soon)
1. Visit Chrome Web Store
2. Search for "AI Email Cleaner"
3. Click "Add to Chrome"
4. Done! 🎉

### Option 2: Install from Source (For Developers)
1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right)
4. Click "Load unpacked"
5. Select the `extension` folder
6. Extension installed! ✅

## ⚙️ Initial Setup

### Step 1: Configure API Keys

Before using the extension, you need to set up:

1. **Google OAuth** (Required for Gmail access)
   - See [SETUP.md](SETUP.md) for detailed instructions
   - Get Client ID from Google Cloud Console
   - Update `manifest.json` with your Client ID

2. **Gemini API** (Required for AI analysis)
   - Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Add to Appwrite Function environment variables

3. **Appwrite Project** (Required for backend)
   - Create project at [appwrite.io](https://appwrite.io)
   - Deploy the Appwrite Function
   - Update `popup.js` with Project ID and Function ID

> **Note**: See [SETUP.md](SETUP.md) for complete step-by-step instructions

### Step 2: First Login

1. Click the extension icon in Chrome toolbar
2. Click "Login with Google"
3. Authorize the extension to access Gmail
4. You're ready to go! 🚀

## 🎯 Basic Usage

### Your First Email Cleanup

1. **Open the Extension**
   - Click the extension icon in Chrome toolbar
   - Or click the "AI Clean" button on Gmail page

2. **Enter Your Cleanup Prompt**
   ```
   Delete all promotional emails older than 3 months
   ```

3. **Analyze Emails**
   - Click "Analyze Emails"
   - Wait for AI to process (usually 5-10 seconds)

4. **Review Results**
   - See how many emails matched
   - Review the list of emails
   - Check the summary

5. **Execute Cleanup**
   - Click "Execute Cleanup"
   - Confirm the action
   - Watch the progress bar
   - Done! ✅

## 💡 Example Prompts

### For Beginners

**Simple Cleanup**:
```
Delete old promotional emails
```

**Archive Old Newsletters**:
```
Archive all newsletters from last year
```

**Mark as Read**:
```
Mark all notifications as read
```

### For Intermediate Users

**Time-Based Cleanup**:
```
Delete all emails older than 6 months from no-reply addresses
```

**Category-Based**:
```
Archive all automated reports from 2023
```

**Sender-Based**:
```
Delete all social media notifications older than 2 months
```

### For Advanced Users

**Complex Criteria**:
```
Delete promotional emails with unsubscribe links that are older than 3 months and haven't been opened
```

**Multiple Conditions**:
```
Archive newsletters and automated reports from last year that I haven't read
```

**Specific Domains**:
```
Delete all emails from marketing@*.com older than 1 month
```

## 🔒 Safety Tips

### Always Use Preview Mode

- ✅ Keep "Preview mode" checkbox checked
- ✅ Review the email list carefully
- ✅ Check the summary before confirming
- ✅ Start with small batches to test

### Best Practices

1. **Start Small**: Begin with specific, narrow prompts
2. **Review Carefully**: Always check what will be affected
3. **Test First**: Try with less important emails first
4. **Use Trash**: Items go to trash first, not permanently deleted
5. **Keep Backup**: Download important emails before cleanup

### What Can Be Undone

| Action | Reversible? | How to Undo |
|--------|-------------|-------------|
| Trash/Delete | ✅ Yes (30 days) | Gmail Trash → Restore |
| Archive | ✅ Yes | Gmail All Mail → Move to Inbox |
| Mark as Read | ⚠️ Partially | Manually mark as unread |

## 🎨 Interface Overview

### Popup Window

```
┌────────────────────────────────┐
│  🤖 AI Email Cleaner          │
│  Powered by Gemini AI          │
├────────────────────────────────┤
│                                │
│  your.email@gmail.com [Logout] │
│                                │
│  Tell AI what to clean up:     │
│  ┌──────────────────────────┐ │
│  │ Your prompt here...      │ │
│  │                          │ │
│  └──────────────────────────┘ │
│                                │
│  ☑ Preview mode               │
│                                │
│  [    Analyze Emails    ]     │
│                                │
│  ────── Results ──────        │
│  Total: 150 emails            │
│  Matched: 23 emails           │
│  Action: Delete               │
│                                │
│  📧 Email list here...        │
│                                │
│  [Execute] [Cancel]           │
└────────────────────────────────┘
```

### Gmail Integration

When on mail.google.com, you'll see:

```
                    Gmail Interface
┌─────────────────────────────────────────┐
│ 📥 Inbox                               │
│                                         │
│ ☐ Email 1...                           │
│ ☐ Email 2...                           │
│ ☐ Email 3...                           │
│                                         │
│                                         │
│                                         │
│              [🤖 AI Clean]  ←── Floating button
└─────────────────────────────────────────┘
```

## ⚡ Quick Tips

### Keyboard Shortcuts (Coming Soon)
- `Alt+A` - Open popup
- `Alt+C` - Start cleanup
- `Esc` - Cancel action

### Time Savers

1. **Save Common Prompts**: Keep a note of your frequently used prompts
2. **Batch by Type**: Clean one type of email at a time
3. **Regular Schedule**: Clean up weekly to prevent buildup
4. **Use Specific Dates**: More specific = better results

### Troubleshooting Quick Fixes

**Extension doesn't work?**
- Check if you're logged in
- Refresh Gmail page
- Reload extension at `chrome://extensions/`

**Analysis fails?**
- Check your internet connection
- Verify API keys are configured
- Check Appwrite Function logs

**No emails found?**
- Try a broader prompt
- Check Gmail has emails matching criteria
- Verify Gmail API permissions

## 📊 Understanding Results

### Summary Breakdown

```
Total emails analyzed: 150
  └─ All emails fetched from Gmail

Emails matching criteria: 23
  └─ Emails that match your prompt

Action: delete
  └─ What will happen to matched emails

Summary: Found promotional emails older than 3 months
  └─ AI's interpretation of your request
```

### Email List

Each email shows:
- **Subject**: Email title
- **From**: Sender email/name
- **Date**: When email was received

Review this list carefully before executing!

## 🎓 Learning Path

### Week 1: Getting Started
- Install and configure extension
- Try simple prompts
- Use preview mode
- Clean up obvious spam

### Week 2: Intermediate Usage
- Try time-based prompts
- Clean up newsletters
- Archive old emails
- Explore different actions

### Week 3: Advanced Features
- Complex multi-criteria prompts
- Batch processing strategies
- Integrate into weekly routine
- Customize for your needs

### Week 4: Power User
- Create prompt library
- Optimize for your email patterns
- Help others get started
- Contribute feedback/features

## 🤝 Getting Help

### Resources

- 📚 [README.md](README.md) - Full documentation
- 🔧 [SETUP.md](SETUP.md) - Detailed setup guide
- 🏗️ [ARCHITECTURE.md](ARCHITECTURE.md) - Technical details
- ⭐ [FEATURES.md](FEATURES.md) - Feature overview

### Support Channels

- **GitHub Issues**: Report bugs or request features
- **Discussions**: Ask questions and share tips
- **Email**: support@example.com (coming soon)

## 🎉 You're Ready!

Congratulations! You're now ready to revolutionize your email management with AI Email Cleaner.

**Next Steps**:
1. ✅ Complete setup (if not done)
2. ✅ Try your first cleanup
3. ✅ Explore different prompts
4. ✅ Share feedback

**Pro Tip**: Start with "Delete all promotional emails older than 6 months" - it's safe and shows impressive results! 🚀

---

**Questions?** Check out our [FAQ](README.md#troubleshooting) or open an issue on GitHub!
