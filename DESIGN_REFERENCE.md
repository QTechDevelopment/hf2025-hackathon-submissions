# 🎨 Quick Design Reference

Quick reference guide for the design system - copy and use these components in your project!

## Color Palette

### Primary Colors
```css
Primary:         #F02E65  /* Appwrite Pink */
On Primary:      #FFFFFF
Primary Light:   #FFD9E2
Primary Dark:    #3E001D
```

### Secondary Colors
```css
Secondary:       #6750A4  /* Material Purple */
On Secondary:    #FFFFFF
Secondary Light: #E8DEF8
Secondary Dark:  #1D192B
```

### Tertiary Colors
```css
Tertiary:        #7D5260  /* Mauve */
On Tertiary:     #FFFFFF
Tertiary Light:  #FFD8E4
Tertiary Dark:   #31111D
```

### Semantic Colors
```css
Success:         #4CAF50  /* Green */
Warning:         #FF9800  /* Orange */
Error:           #F44336  /* Red */
Info:            #2196F3  /* Blue */
```

---

## Component Snippets

### Glass Card
```html
<div class="glass-card">
    <h3 class="title-large">Card Title</h3>
    <p class="body-medium">Card description goes here</p>
</div>
```

### Hero Section
```html
<section class="hero">
    <div class="glass-hero-card">
        <h1 class="display-large">Your Awesome Title</h1>
        <p class="body-large">Your compelling description</p>
        <div class="button-group">
            <button class="btn-primary">Get Started</button>
            <button class="btn-glass">Learn More</button>
        </div>
    </div>
</section>
```

### Buttons
```html
<!-- Primary Button -->
<button class="btn-primary">Primary Action</button>

<!-- Secondary Button -->
<button class="btn-secondary">Secondary Action</button>

<!-- Glass Button -->
<button class="btn-glass">Glass Effect</button>

<!-- Outlined Button -->
<button class="btn-outlined">Outlined Style</button>

<!-- Icon Button -->
<button class="icon-btn">
    <svg><!-- icon SVG --></svg>
</button>
```

### Input Fields
```html
<div class="input-group">
    <label for="email" class="label-medium">Email Address</label>
    <input type="email" id="email" class="input-glass" placeholder="Enter your email">
</div>

<div class="input-group">
    <label for="message" class="label-medium">Message</label>
    <textarea id="message" class="input-glass" rows="4" placeholder="Your message..."></textarea>
</div>
```

### Project Card
```html
<article class="glass-card project-card">
    <div class="card-header">
        <div class="card-icon">🚀</div>
        <span class="card-badge">Featured</span>
    </div>
    <div class="card-content">
        <h4 class="title-medium">Project Title</h4>
        <p class="body-small">Project description</p>
    </div>
    <div class="card-footer">
        <div class="card-tags">
            <span class="tag">React</span>
            <span class="tag">Appwrite</span>
        </div>
        <button class="btn-glass btn-sm">View Project</button>
    </div>
</article>
```

### Statistics Card
```html
<div class="glass-card stat-card">
    <div class="stat-icon">
        <svg><!-- icon SVG --></svg>
    </div>
    <div class="stat-content">
        <div class="stat-number">1,234</div>
        <div class="stat-label">Label</div>
    </div>
</div>
```

### Navigation Bar
```html
<nav class="app-bar">
    <div class="container">
        <div class="nav-content">
            <div class="nav-brand">
                <h1 class="title-large">Brand Name</h1>
            </div>
            <div class="nav-links">
                <a href="#home" class="nav-link">Home</a>
                <a href="#about" class="nav-link">About</a>
                <a href="#contact" class="nav-link">Contact</a>
            </div>
            <div class="nav-actions">
                <button class="btn-glass">Sign In</button>
                <button class="btn-primary">Get Started</button>
            </div>
        </div>
    </div>
</nav>
```

---

## Typography Scale

### Display (Hero Headings)
```html
<h1 class="display-large">Display Large (57px)</h1>
<h1 class="display-medium">Display Medium (45px)</h1>
<h1 class="display-small">Display Small (36px)</h1>
```

### Headlines (Section Headings)
```html
<h2 class="headline-large">Headline Large (32px)</h2>
<h2 class="headline-medium">Headline Medium (28px)</h2>
<h2 class="headline-small">Headline Small (24px)</h2>
```

### Titles (Component Headings)
```html
<h3 class="title-large">Title Large (22px)</h3>
<h3 class="title-medium">Title Medium (16px)</h3>
<h3 class="title-small">Title Small (14px)</h3>
```

### Body (Regular Text)
```html
<p class="body-large">Body Large (16px)</p>
<p class="body-medium">Body Medium (14px)</p>
<p class="body-small">Body Small (12px)</p>
```

### Labels (UI Text)
```html
<label class="label-large">Label Large (14px)</label>
<label class="label-medium">Label Medium (12px)</label>
<label class="label-small">Label Small (11px)</label>
```

---

## Layout Structure

### Basic Page Layout
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Project</title>
    <link rel="stylesheet" href="demo-design.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Navigation -->
    <nav class="app-bar">
        <!-- Nav content -->
    </nav>

    <!-- Hero Section -->
    <section class="hero">
        <div class="container">
            <!-- Hero content -->
        </div>
    </section>

    <!-- Main Content -->
    <section class="features-section">
        <div class="container">
            <h2 class="headline-large section-title">Section Title</h2>
            <p class="body-large section-subtitle">Section description</p>
            
            <!-- Features Grid -->
            <div class="features-grid">
                <!-- Cards go here -->
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <!-- Footer content -->
        </div>
    </footer>
</body>
</html>
```

### Grid Layouts
```html
<!-- Features Grid (3 columns) -->
<div class="features-grid">
    <div class="glass-card">Card 1</div>
    <div class="glass-card">Card 2</div>
    <div class="glass-card">Card 3</div>
</div>

<!-- Card Grid (Auto-fit) -->
<div class="card-grid">
    <article class="glass-card project-card">Project 1</article>
    <article class="glass-card project-card">Project 2</article>
    <article class="glass-card project-card">Project 3</article>
</div>

<!-- Stats Grid (4 columns) -->
<div class="stats-grid">
    <div class="glass-card stat-card">Stat 1</div>
    <div class="glass-card stat-card">Stat 2</div>
    <div class="glass-card stat-card">Stat 3</div>
    <div class="glass-card stat-card">Stat 4</div>
</div>
```

---

## Spacing System

```css
--spacing-xs:   4px
--spacing-sm:   8px
--spacing-md:   16px
--spacing-lg:   24px
--spacing-xl:   32px
--spacing-2xl:  48px
--spacing-3xl:  64px
```

### Usage
```html
<!-- Custom spacing -->
<div style="padding: var(--spacing-lg); margin-bottom: var(--spacing-xl);">
    Content with custom spacing
</div>
```

---

## Border Radius

```css
--radius-sm:   8px   /* Small elements */
--radius-md:   12px  /* Inputs */
--radius-lg:   16px  /* Cards */
--radius-xl:   24px  /* Buttons */
--radius-full: 9999px /* Circular */
```

---

## Shadows

```css
--shadow-1:  0 1px 2px rgba(0, 0, 0, 0.05)           /* Subtle */
--shadow-2:  0 2px 8px rgba(0, 0, 0, 0.1)            /* Cards */
--shadow-3:  0 4px 16px rgba(0, 0, 0, 0.1)           /* Elevated */
--shadow-4:  0 8px 32px rgba(0, 0, 0, 0.15)          /* Modals */
--shadow-5:  0 16px 48px rgba(0, 0, 0, 0.2)          /* Dropdowns */
```

---

## Glassmorphism Effect

```css
.custom-glass {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: var(--radius-lg);
    box-shadow: 
        0 8px 32px rgba(31, 38, 135, 0.15),
        inset 0 0 0 1px rgba(255, 255, 255, 0.2);
}
```

---

## Responsive Breakpoints

```css
/* Mobile: 0-599px */
@media (max-width: 599px) {
    /* Mobile styles */
}

/* Tablet: 600-839px */
@media (min-width: 600px) and (max-width: 839px) {
    /* Tablet styles */
}

/* Desktop: 840px+ */
@media (min-width: 840px) {
    /* Desktop styles */
}
```

---

## Common Patterns

### Section with Title
```html
<section class="features-section">
    <div class="container">
        <h2 class="headline-large section-title">Section Title</h2>
        <p class="body-large section-subtitle">Section description</p>
        <!-- Content -->
    </div>
</section>
```

### Button Group
```html
<div class="button-group">
    <button class="btn-primary">Primary</button>
    <button class="btn-glass">Secondary</button>
</div>
```

### Card with Actions
```html
<div class="glass-card">
    <h3 class="title-large">Title</h3>
    <p class="body-medium">Description</p>
    <div class="button-group">
        <button class="btn-primary">Action</button>
    </div>
</div>
```

---

## Pro Tips

1. **Always use container** - Wrap content in `<div class="container">` for consistent width
2. **Typography hierarchy** - Use display → headline → title → body progression
3. **Spacing consistency** - Use spacing variables for consistent gaps
4. **Glass effects** - Work best with colorful backgrounds
5. **Mobile first** - Design for mobile, enhance for desktop
6. **Accessibility** - Always include alt text, labels, and focus states

---

## Quick Links

- 📖 [Full Design Guide](UI_UX_DESIGN.md)
- 🚀 [Quick Start](DESIGN_SYSTEM_QUICKSTART.md)
- 🎨 [Live Demo](demo-design.html)
- 💻 [CSS Framework](demo-design.css)

---

**Copy, customize, and create something amazing! 🚀**
