# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Nuxt.js 3 static site that displays companies and their positions on Taiwan/Taipei. The site uses a single-page application (SPA) mode with client-side rendering only (`ssr: false`).

## Development Commands

```bash
# Install dependencies
npm install

# Run development server with hot reload at localhost:3000
npm run dev

# Build for production
npm run build

# Generate static site
npm run generate

# Preview production build
npm run preview

# Format code with Prettier
npm run format
```

## Architecture

### Tech Stack
- **Nuxt.js 3.13.0** - Vue.js framework in SPA mode
- **Vue 3.4.0** - Using Composition API for new components, Options API maintained in existing components
- **Bulma 1.0.0** - CSS framework for styling (no Buefy - uses custom components)
- **Chart.js 4.4.0 / vue-chartjs 5.3.0** - For pie chart visualization
- **@mdi/js** - Material Design Icons (tree-shakeable)
- **SCSS** - Main stylesheet at `assets/main.scss`

### Project Structure
- **pages/index.vue** - Single main page containing all UI logic
  - Search and filter functionality for companies
  - Custom DataTable component with pagination and sorting
  - Pie chart visualization of company stances
  - Options API (for consistency with original codebase)
- **components/pie.vue** - Chart.js pie chart component (Composition API, required by vue-chartjs v5)
- **components/DataTable.vue** - Custom table component with sorting, pagination, striping (replaces Buefy b-table)
- **components/SvgIcon.vue** - SVG icon component for @mdi/js icons (replaces Buefy b-icon)
- **data/index.js** - Company data source (single export named `data`)
- **layouts/default.vue** - Default layout wrapper
- **app/router.options.ts** - Vue Router configuration for smooth scroll behavior
- **public/** - Static assets (images, icons, etc.)

### Data Structure

All company data is maintained in `data/index.js` as an exported array:

```javascript
export const data = [
  { company_name: 'Company Name', industry: 'Industry', stance: 'Taiwan|China|Taiwan Region|etc' }
]
```

When adding/updating companies, modify this file directly. The main page imports and filters this data.

## Code Style

- **Prettier** enforces formatting (configured in `.prettierrc`):
  - Single quotes
  - No semicolons
  - Arrow parens avoided when possible
- **EditorConfig**: 2-space indentation, LF line endings
- **Vue components**: Use Options API for consistency with existing code, Composition API acceptable for new components

## Key Implementation Details

- The main page (`pages/index.vue`) handles all filtering logic using computed properties for `filteredData`
- Industry and stance filters are dynamically generated from the data
- The pie chart shows the distribution of stances across all companies (or filtered subset)
- Custom Bulma-styled components replace Buefy (DataTable, SvgIcon)
- Native HTML form elements with Bulma CSS classes (no component library dependency)
- Smooth scrolling implemented via CSS (`scroll-behavior: smooth`) and Vue Router's `scrollBehavior`
- Primary brand color is green (#018002) set via Bulma CSS variables

## Migration Notes

This project was migrated from Nuxt 2 to Nuxt 3 in February 2025:
- Replaced Buefy with custom Bulma components (Buefy has no Vue 3 support)
- Upgraded vue-chartjs from v3 to v5
- Removed vue-scrollto in favor of native browser smooth scroll
- Updated lifecycle hooks (`beforeDestroy` → `beforeUnmount`)
- Moved `static/` → `public/` directory
