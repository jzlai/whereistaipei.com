# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Nuxt.js 2 static site that displays companies and their positions on Taiwan/Taipei. The site uses a single-page application (SPA) mode with client-side rendering only (`ssr: false`).

## Development Commands

```bash
# Install dependencies
yarn install

# Run development server with hot reload at localhost:3000
yarn dev

# Build for production
yarn build

# Start production server
yarn start

# Generate static site
yarn generate

# Format code with Prettier
yarn format
```

## Architecture

### Tech Stack
- **Nuxt.js 2.15.8** - Vue.js framework in SPA mode
- **Buefy** - Bulma-based Vue.js UI component library
- **Chart.js/vue-chartjs** - For pie chart visualization
- **SCSS** - Main stylesheet at `assets/main.scss`

### Project Structure
- **pages/index.vue** - Single main page containing all UI logic
  - Search and filter functionality for companies
  - Buefy table with pagination and sorting
  - Pie chart visualization of company stances
- **components/pie.vue** - Chart.js pie chart component
- **data/index.js** - Company data source (single export named `data`)
- **layouts/default.vue** - Default layout wrapper
- **static/** - Static assets (images, icons, etc.)

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

## Key Implementation Details

- The main page (`pages/index.vue`) handles all filtering logic using computed properties for `filteredData`
- Industry and stance filters are dynamically generated from the data
- The pie chart shows the distribution of stances across all companies (or filtered subset)
- Buefy components are used throughout - no custom form/table implementations
