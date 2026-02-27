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
- **Nuxt.js 4** - Vue.js framework in SPA mode
- **Vue 3.4.0** - Using Composition API with `<script setup lang="ts">`
- **TypeScript 5.9.3** - Fully typed with strict mode enabled
- **Bulma 1.0.0** - CSS framework for styling (no Buefy - uses custom components)
- **Chart.js 4.4.0 / vue-chartjs 5.3.0** - For pie chart visualization
- **@mdi/js** - Material Design Icons (tree-shakeable)
- **SCSS** - Main stylesheet at `assets/main.scss`

### Project Structure
- **app/pages/index.vue** - Single main page containing all UI logic
  - Search and filter functionality for companies
  - Custom DataTable component with pagination and sorting
  - Pie chart visualization of company stances
  - Composition API with `<script setup lang="ts">`
- **app/components/pie.vue** - Chart.js pie chart component (Composition API with `<script setup>`)
- **app/components/DataTable.vue** - Custom table component with sorting, pagination, striping (Composition API with `<script setup lang="ts">`)
- **app/components/SvgIcon.vue** - SVG icon component for @mdi/js icons (Composition API with `<script setup>`)
- **app/data/index.ts** - Company data source (typed with TypeScript, auto-deduplicated)
- **app/utils/deduplicate.ts** - Utility function for deduplicating arrays
- **app/constants/stances.ts** - Color constants for stance visualization
- **app/types/index.ts** - TypeScript type definitions for Company, TableColumn, ChartData, etc.
- **app/layouts/default.vue** - Default layout wrapper
- **app/router.options.ts** - Vue Router configuration for smooth scroll behavior
- **public/** - Static assets (images, icons, etc.)

### Data Structure

All company data is maintained in `app/data/index.ts` as a typed exported array:

```typescript
export const data: Company[] = [
  { company_name: 'Company Name', industry: 'Industry', stance: 'Taiwan' }
]
```

Type definition in `app/types/index.ts`:
```typescript
export type Stance = 'Taiwan' | 'China' | 'Chinese Taipei' | 'Taiwan ROC' | 'Taiwan Region'

export interface Company {
  company_name: string
  industry: string
  stance: Stance
}
```

When adding/updating companies, modify this file directly. The data is automatically deduplicated using the `deduplicate()` utility function before export, so duplicate entries will be removed automatically.

## Code Style

- **Prettier** enforces formatting (configured in `.prettierrc`):
  - Single quotes
  - No semicolons
  - Arrow parens avoided when possible
- **EditorConfig**: 2-space indentation, LF line endings
- **TypeScript**: Strict mode enabled with comprehensive compiler options
- **Vue components**: Use Composition API with `<script setup lang="ts">` for all components

## Key Implementation Details

- The main page (`app/pages/index.vue`) handles all filtering logic using computed properties for `filteredData`
- All components use Composition API with `<script setup lang="ts">` for better TypeScript inference
- Industry and stance filters are dynamically generated from the data
- The pie chart shows the distribution of stances across all companies (or filtered subset)
- Stance colors are centralized in `constants/stances.ts` using `Record<Stance, string>` for type safety
- Custom Bulma-styled components replace Buefy (DataTable, SvgIcon)
- Native HTML form elements with Bulma CSS classes (no component library dependency)
- Smooth scrolling implemented via CSS (`scroll-behavior: smooth`) and Vue Router's `scrollBehavior`
- Template refs are properly typed (e.g., `const topSection = ref<HTMLElement>()`)
- Type inference is maximized - explicit type annotations only where necessary
- Primary brand color is green (#018002) set via Bulma CSS variables

## Migration Notes

This project was migrated from Nuxt 2 to Nuxt 3 in February 2025:
- Replaced Buefy with custom Bulma components (Buefy has no Vue 3 support)
- Upgraded vue-chartjs from v3 to v5
- Removed vue-scrollto in favor of native browser smooth scroll
- Updated lifecycle hooks (`beforeDestroy` → `beforeUnmount`)
- Moved `static/` → `public/` directory

This project was migrated from Nuxt 3 to Nuxt 4 in February 2026:
- Moved `assets/`, `components/`, `layouts/`, `pages/`, `middleware/`, `plugins/`, `data/` into `app/` (new `srcDir` default)
- Removed `hid` prop from meta tags (Unhead v2 removed it)
- Updated `compatibilityDate` to `2026-02-27`

This project was fully migrated to TypeScript and Composition API in February 2026:
- Migrated all components from Options API to Composition API with `<script setup lang="ts">`
- Converted `data/index.js` to `data/index.ts` with full type definitions
- Added comprehensive TypeScript types in `types/index.ts`
- Enabled strict TypeScript mode with comprehensive compiler options
- Improved type safety with proper ref typing and interface definitions
