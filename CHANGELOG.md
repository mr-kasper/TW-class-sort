# Changelog

## [0.0.3] - 2026-02-25

### Changed

- Updated README settings table with new preserve options
- Added test suite (vitest) with 28 unit & integration tests
- Reduced VSIX package size by excluding test files

### Fixed

- Added `onCommand` activation event so the sort command is always available
- Added `TW Class Sort` output channel for activation diagnostics
- Added VS Code debug launch configurations for extension development

## [0.0.2] - 2026-02-24

### Changed

- Upgraded `prettier-plugin-tailwindcss` from 0.6.x to **0.7.2** (Tailwind v4 fallback by default, regex support for attributes/functions, monorepo improvements)
- Upgraded `prettier` to ^3.8.0, `typescript` to ^5.9.0, `@types/node` to ^22.0.0
- Added `tailwindPreserveWhitespace` setting — preserve extra whitespace between classes
- Added `tailwindPreserveDuplicates` setting — keep duplicate classes (useful for Blade/Fluid)

## [0.0.1] - 2026-02-14

### Added

- Sort Tailwind CSS classes via Command Palette (`Sort Tailwind CSS Classes`)
- Optional format-on-save support
- Tailwind CSS v4 support (`tailwindStylesheet` option)
- Tailwind CSS v3 support (`tailwindConfigPath` option)
- Configurable `tailwindFunctions` (clsx, cn, cva, tw)
- Configurable `tailwindAttributes` (class, className)
- Supports HTML, JSX, TSX, Vue, Svelte, Astro, and PHP files
- Reads user's `.prettierrc` to preserve code style
