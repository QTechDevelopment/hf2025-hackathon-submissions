# Extension Icons

This folder should contain the extension icons in the following sizes:

- `icon16.png` - 16x16 pixels (toolbar icon)
- `icon48.png` - 48x48 pixels (extension management page)
- `icon128.png` - 128x128 pixels (Chrome Web Store)

## Design Guidelines

### Recommended Icon Design

- **Style**: Modern, clean, and professional
- **Colors**: Use gradient colors matching the extension theme (purple/blue)
- **Content**: Should represent email + AI (e.g., envelope with sparkles, robot sorting mail)
- **Background**: Transparent PNG

### Creating Icons

You can create icons using:

1. **Design Tools**: Figma, Adobe Illustrator, Sketch
2. **Online Tools**: Canva, Photopea
3. **AI Generation**: Midjourney, DALL-E with prompt: "Modern email cleaning AI icon, gradient purple and blue, minimalist, transparent background"

### Icon Template

```
┌─────────────┐
│   ✨ 📧     │  ← Combine AI sparkle with email
│             │
│   Clean AI  │  ← Optional text for 48x48 and 128x128
└─────────────┘
```

## Temporary Placeholder

For development, you can use:
- Single color squares with the extension initials
- Simple emoji-based icons
- Free icon libraries (with proper attribution)

## Example SVG (can be converted to PNG)

```svg
<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="128" height="128" rx="20" fill="url(#grad)"/>
  <text x="64" y="75" font-family="Arial" font-size="60" fill="white" text-anchor="middle">📧</text>
  <text x="90" y="50" font-family="Arial" font-size="30" fill="white">✨</text>
</svg>
```

## Note

**Important**: Make sure to add actual icon files before publishing to Chrome Web Store!

For now, the extension will work without icons (Chrome will use a default placeholder), but proper icons are required for:
- Professional appearance
- Chrome Web Store listing
- User trust and recognition
