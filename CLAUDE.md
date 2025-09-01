# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static website for the Carnegie Mellon AI Safety Initiative (CASI). The site uses vanilla HTML, CSS, and JavaScript without any build process or frameworks.

## Architecture

### Static Site Structure
- **index.html** - Homepage with hero section and community overview
- **about.html** - About page explaining CASI's mission and goals
- **team.html** - Team member profiles and information
- **events.html** - Events and activities listing
- **contact.html** - Contact form (uses mailto functionality)

### Key Components
- **Navigation**: Shared navigation component across all pages with mobile responsive hamburger menu
- **Styling**: Single `styles.css` file using CSS custom properties for theming
- **Interactivity**: `script.js` handles mobile menu, contact form, and floating animations
- **Assets**: Logo files in multiple formats stored in `assets/` directory

### Design System
- **Color Scheme**: Dark theme with CSS custom properties defined in `:root`
  - Primary background: `--bg-primary` (#0a0a0b)
  - Accent colors: Blue (#3b82f6), Purple (#8b5cf6), Green (#10b981)
- **Typography**: Space Grotesk font family with JetBrains Mono for code
- **Responsive Design**: Mobile-first approach with desktop breakpoints

## Development Workflow

### Local Development
- No build process required - open HTML files directly in browser
- For live reload during development, use a simple HTTP server:
  ```bash
  python -m http.server 8000
  # or
  npx serve .
  ```

### File Organization
- All HTML files in root directory
- Single CSS file (`styles.css`) for all styling
- Single JavaScript file (`script.js`) for all functionality
- Assets organized in `assets/` directory

### Key Features
- **Mobile Navigation**: Hamburger menu with toggle functionality
- **Contact Form**: Uses mailto protocol to send emails to casi@andrew.cmu.edu
- **Floating Animations**: Mouse-following background shapes on homepage
- **Discord Integration**: Direct links to Discord server (https://discord.gg/t9VyYhNQzb)

## Deployment

- Hosted on GitHub Pages with custom domain: cmuaisafety.com
- CNAME file configured for custom domain
- Direct push to main branch triggers deployment
- No build or CI/CD process required

## Making Changes

When editing:
1. Maintain consistent navigation structure across all pages
2. Keep the dark theme color scheme using existing CSS custom properties
3. Ensure mobile responsiveness for any new components
4. Test contact form functionality (mailto links)
5. Verify logo and asset paths remain correct

## Known Issues / Future Improvements

### Navigation Centralization
Currently, navigation dropdowns are duplicated across all 8 HTML files. This causes sync issues when updating menus. Consider implementing:
- JavaScript-based navigation generation (`nav.js`)
- Template system for navigation HTML
- Build process to generate navigation from single source

### Event Management
Events are currently static HTML in `get-involved.html`. Consider:
- Google Calendar API integration for dynamic events
- Admin interface for event management
- Automated event updates