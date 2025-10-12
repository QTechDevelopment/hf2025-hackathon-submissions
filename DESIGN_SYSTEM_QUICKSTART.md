# 🎨 Design System Quick Start

## Viewing the Demo

To view the interactive design system demo locally:

### Option 1: Using Python (Recommended)

```bash
# Navigate to the repository
cd hf2025-hackathon-submissions

# Start a local web server
python3 -m http.server 8080

# Open in your browser
# Visit: http://localhost:8080/demo-design.html
```

### Option 2: Using Node.js

```bash
# Install http-server globally (if not already installed)
npm install -g http-server

# Start the server
http-server -p 8080

# Open in your browser
# Visit: http://localhost:8080/demo-design.html
```

### Option 3: Direct File Opening

Simply open `demo-design.html` directly in your browser:
- Right-click on the file
- Select "Open with" → Your browser (Chrome, Firefox, Safari, etc.)

> **Note:** Some features like Google Fonts may not work when opening directly from the filesystem.

## Using the Design System in Your Project

### 1. Copy the CSS Framework

Copy `demo-design.css` into your project:

```bash
cp demo-design.css your-project/styles/
```

### 2. Link the CSS in Your HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" href="styles/demo-design.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Your content here -->
</body>
</html>
```

### 3. Use Glass Components

```html
<!-- Glass Card -->
<div class="glass-card">
    <h3 class="title-large">Card Title</h3>
    <p class="body-medium">Card content goes here</p>
</div>

<!-- Primary Button -->
<button class="btn-primary">Click Me</button>

<!-- Glass Button -->
<button class="btn-glass">Learn More</button>

<!-- Input Field -->
<input type="text" class="input-glass" placeholder="Enter text...">
```

### 4. Customize Colors

Edit the CSS custom properties in `demo-design.css`:

```css
:root {
    --color-primary: #F02E65;
    --color-secondary: #6750A4;
    /* Add your custom colors */
}
```

## Design Resources

| Resource | Description | Link |
|----------|-------------|------|
| 📖 **Design Guide** | Complete documentation | [UI_UX_DESIGN.md](UI_UX_DESIGN.md) |
| 🎨 **CSS Framework** | Production-ready styles | [demo-design.css](demo-design.css) |
| 🖼️ **Demo Page** | Interactive examples | [demo-design.html](demo-design.html) |
| 📝 **Main README** | Hackathon information | [README.md](README.md) |

## Key Components Available

### Layout
- ✅ Container with max-width
- ✅ Responsive grid system
- ✅ Navigation bar with glass effect

### Components
- ✅ Glass cards (base component)
- ✅ Buttons (primary, secondary, glass, outlined, icon)
- ✅ Input fields with glass styling
- ✅ Project cards with badges
- ✅ Statistics cards
- ✅ Color swatches

### Utilities
- ✅ Typography scale (display, headline, title, body, label)
- ✅ Spacing system (xs, sm, md, lg, xl, 2xl, 3xl)
- ✅ Border radius (sm, md, lg, xl, full)
- ✅ Shadow levels (1-5)

## Browser Support

The design system works best in modern browsers with backdrop-filter support:

| Browser | Minimum Version |
|---------|----------------|
| Chrome | 76+ |
| Edge | 79+ |
| Safari | 9+ |
| Firefox | 103+ |

> **Note:** Glassmorphism effects will gracefully degrade in older browsers.

## Tips for Hackathon Projects

1. **Start with the template** - Copy components from `demo-design.html`
2. **Customize colors** - Use your brand colors in CSS variables
3. **Keep it consistent** - Stick to the design system guidelines
4. **Test on mobile** - Use responsive breakpoints
5. **Add your flair** - Combine with your own creative ideas

## Need Help?

- 📖 Read the [full design documentation](UI_UX_DESIGN.md)
- 💬 Ask in the [Discord community](https://appwrite.io/discord)
- 🐛 [Report issues](https://github.com/QTechDevelopment/hf2025-hackathon-submissions/issues)

---

**Happy designing! 🎨✨**
