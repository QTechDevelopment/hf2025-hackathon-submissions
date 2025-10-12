# Contributing to AI Email Cleaner

Thank you for your interest in contributing to AI Email Cleaner! This document provides guidelines and instructions for contributing.

## 🌟 How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:

1. **Clear title**: Describe the issue briefly
2. **Description**: Detailed explanation of the problem
3. **Steps to reproduce**: How to trigger the bug
4. **Expected behavior**: What should happen
5. **Actual behavior**: What actually happens
6. **Screenshots**: If applicable
7. **Environment**: Browser version, OS, extension version

**Example**:
```
Title: Analysis fails with long prompts

Description: When using prompts longer than 500 characters, the analysis fails

Steps to reproduce:
1. Open extension popup
2. Enter a prompt with >500 characters
3. Click "Analyze Emails"
4. Error appears

Expected: Analysis should complete successfully
Actual: Error message "Analysis failed"

Environment: Chrome 118, Windows 11, Extension v1.0.0
```

### Suggesting Features

We welcome feature suggestions! Please create an issue with:

1. **Feature title**: Brief description
2. **Problem statement**: What problem does this solve?
3. **Proposed solution**: How should it work?
4. **Alternatives considered**: Other approaches you thought about
5. **Additional context**: Screenshots, mockups, examples

### Submitting Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/hf2025-hackathon-submissions.git
   cd hf2025-hackathon-submissions/extension
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write clean, readable code
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation if needed

4. **Test your changes**
   - Load the extension in Chrome
   - Test all affected functionality
   - Ensure no existing features break

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add feature: your feature description"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template
   - Submit!

## 📝 Code Style Guidelines

### JavaScript

```javascript
// Use const for variables that don't change
const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1';

// Use camelCase for variables and functions
const emailCount = 10;
function analyzeEmails() { }

// Use async/await instead of .then()
async function fetchData() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Add comments for complex logic
// Analyze emails using Gemini AI
// Returns: { matchedEmails, action, summary }
async function analyzeWithGemini(emails, prompt) {
  // Implementation...
}

// Use descriptive variable names
const matchedEmails = []; // Good
const arr = []; // Bad
```

### HTML

```html
<!-- Use semantic HTML -->
<section class="results">
  <h3>Analysis Results</h3>
  <div class="summary">...</div>
</section>

<!-- Use meaningful IDs and classes -->
<button id="analyze-btn" class="btn btn-primary">Analyze</button>

<!-- Keep structure clean and indented -->
<div class="container">
  <header>
    <h1>Title</h1>
  </header>
  <main>
    <p>Content</p>
  </main>
</div>
```

### CSS

```css
/* Use consistent naming (kebab-case for classes) */
.email-list {
  display: flex;
  flex-direction: column;
}

/* Group related properties */
.btn {
  /* Layout */
  display: inline-block;
  padding: 12px 24px;
  
  /* Visual */
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  
  /* Interaction */
  cursor: pointer;
  transition: all 0.3s;
}

/* Use comments to separate sections */
/* ===== Buttons ===== */
.btn-primary { }
.btn-secondary { }

/* ===== Layout ===== */
.container { }
.section { }
```

## 🏗️ Project Structure

```
extension/
├── manifest.json           # Extension configuration
├── popup/                  # Main UI
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
├── scripts/               # Background and content scripts
│   ├── background.js
│   └── content.js
├── styles/               # Additional styles
│   └── content.css
├── icons/               # Extension icons
│   └── icon.svg
├── appwrite-functions/ # Backend functions
│   └── gemini-analyzer/
│       ├── main.js
│       └── package.json
└── docs/              # Documentation
    ├── README.md
    ├── SETUP.md
    └── ARCHITECTURE.md
```

## 🧪 Testing Guidelines

### Manual Testing Checklist

Before submitting a PR, test:

- [ ] Extension loads without errors
- [ ] Login/logout works correctly
- [ ] Email analysis completes successfully
- [ ] Preview mode displays correct emails
- [ ] Cleanup actions work as expected
- [ ] Progress indicators show correctly
- [ ] Error messages are clear and helpful
- [ ] Works on different screen sizes
- [ ] No console errors
- [ ] Gmail integration works (floating button, etc.)

### Test Cases to Cover

1. **Authentication**
   - First-time login
   - Re-login after logout
   - Token expiration handling

2. **Email Analysis**
   - Different prompt types
   - Empty results
   - Large result sets (100+ emails)
   - API failures

3. **Cleanup Execution**
   - Delete action
   - Archive action
   - Mark as read action
   - Partial failures

4. **Edge Cases**
   - No internet connection
   - API quota exceeded
   - Empty inbox
   - Very long prompts

## 📚 Documentation

### When to Update Documentation

Update docs when you:
- Add a new feature
- Change existing functionality
- Fix a bug that affects usage
- Improve setup/configuration process

### Documentation Files

- `README.md`: Overview and basic usage
- `SETUP.md`: Detailed setup instructions
- `ARCHITECTURE.md`: Technical architecture
- `FEATURES.md`: Feature descriptions
- `QUICKSTART.md`: Quick start guide
- `CONTRIBUTING.md`: This file!

## 🔐 Security Guidelines

### Never Commit

- API keys or secrets
- OAuth credentials
- User data or emails
- Private configuration files

### Always

- Use environment variables for secrets
- Validate user input
- Sanitize data before display
- Follow OAuth best practices
- Keep dependencies updated

### Security Checklist

- [ ] No hardcoded credentials
- [ ] Input validation on all forms
- [ ] XSS prevention (escape HTML)
- [ ] CSRF protection where applicable
- [ ] Secure API communication (HTTPS)
- [ ] Minimal permissions requested
- [ ] Sensitive data not logged

## 🎨 UI/UX Guidelines

### Design Principles

1. **Simplicity**: Keep interfaces clean and uncluttered
2. **Clarity**: Use clear labels and instructions
3. **Feedback**: Provide immediate visual feedback for actions
4. **Consistency**: Maintain consistent styling and behavior
5. **Accessibility**: Support keyboard navigation and screen readers

### UI Checklist

- [ ] Buttons have hover states
- [ ] Loading states are visible
- [ ] Errors are user-friendly
- [ ] Success messages are clear
- [ ] Forms have validation
- [ ] Colors have good contrast
- [ ] Text is readable
- [ ] Icons are meaningful

## 🚀 Release Process

### Version Numbers

We use Semantic Versioning: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

### Release Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] CHANGELOG updated
- [ ] Version number bumped
- [ ] Git tagged
- [ ] Chrome Web Store updated
- [ ] Release notes written

## 💬 Communication

### Be Respectful

- Use inclusive language
- Be patient with beginners
- Provide constructive feedback
- Assume good intentions

### Getting Help

- **Questions**: Open a discussion
- **Bugs**: Create an issue
- **Features**: Submit a feature request
- **Security**: Email security@example.com

## 📄 License

By contributing, you agree that your contributions will be licensed under the BSD 3-Clause License.

## 🙏 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Given credit in code comments (if applicable)

## 📞 Contact

- **GitHub Issues**: For bugs and features
- **Discussions**: For questions and ideas
- **Email**: contribute@example.com

---

Thank you for contributing to AI Email Cleaner! Your help makes this project better for everyone. 🎉
