# TW Class Sort (Prettier)

[![Visual Studio Marketplace](https://img.shields.io/visual-studio-marketplace/v/mr-kasper.tw-class-sort-prettier?label=VS%20Code%20Marketplace&color=0F172A)](https://marketplace.visualstudio.com/items?itemName=mr-kasper.tw-class-sort-prettier)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/mr-kasper/TW-class-sort/blob/main/LICENSE)
[![GitHub Issues](https://img.shields.io/github/issues/mr-kasper/TW-class-sort)](https://github.com/mr-kasper/TW-class-sort/issues)

A VS Code extension that automatically sorts Tailwind CSS classes in the [recommended order](https://tailwindcss.com/blog/automatic-class-sorting-with-prettier) using [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss). No Prettier setup required — just install and run.

## Features

- **Sort Command** — Run `Sort Tailwind CSS Classes` from the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
- **Format on Save** — Optionally auto-sort classes every time you save a file
- **Tailwind v4 & v3** — Supports both Tailwind CSS v4 (CSS-based config via `@import "tailwindcss"`) and v3 (`tailwind.config.js`)
- **Utility Functions** — Sorts classes inside `clsx()`, `cn()`, `cva()`, `tw()`, and any custom functions you configure
- **Multi-language** — Works with HTML, JSX, TSX, Vue, Svelte, Astro, and PHP files
- **Respects Your Config** — Reads your existing `.prettierrc` to preserve code style; only class order changes

## Usage

1. Open a file containing Tailwind CSS classes.
2. Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`).
3. Run **Sort Tailwind CSS Classes**.

### Format on Save

Enable automatic sorting on save in your VS Code settings:

```json
{
  "tailwindClassSorter.formatOnSave": true
}
```

## Extension Settings

| Setting                                  | Type       | Default                       | Description                                                                                                    |
| ---------------------------------------- | ---------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `tailwindClassSorter.formatOnSave`       | `boolean`  | `false`                       | Automatically sort Tailwind CSS classes on file save                                                           |
| `tailwindClassSorter.tailwindStylesheet` | `string`   | `""`                          | **(Tailwind v4)** Path to your Tailwind CSS entry point (e.g. `./src/app.css`). Leave empty for auto-detection |
| `tailwindClassSorter.tailwindConfigPath` | `string`   | `""`                          | **(Tailwind v3)** Path to `tailwind.config.js` (relative to workspace root). Leave empty for auto-detection    |
| `tailwindClassSorter.tailwindFunctions`  | `string[]` | `["clsx", "cn", "cva", "tw"]` | Function names whose arguments should have their Tailwind classes sorted                                       |
| `tailwindClassSorter.tailwindAttributes` | `string[]` | `["class", "className"]`      | HTML/JSX attributes whose values should have their Tailwind classes sorted                                     |

## Example

**Before:**

```html
<div class="p-4 flex bg-white items-center shadow-lg rounded-lg justify-between">Hello</div>
```

**After:**

```html
<div class="flex items-center justify-between rounded-lg bg-white p-4 shadow-lg">Hello</div>
```

## How It Works

This extension uses [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss) under the hood to sort your classes into Tailwind's recommended order. It bundles Prettier and the plugin internally — you don't need to install or configure either in your project.

The sorting follows the same order as Tailwind's official Prettier plugin: layout utilities first (like `flex`, `grid`), then spacing, sizing, typography, backgrounds, borders, effects, and finally state modifiers (`hover:`, `focus:`, `dark:`, etc.).

## Requirements

- VS Code 1.85.0 or later
- A project using Tailwind CSS v4 or v3

## Contributing

Found a bug or have a feature request? [Open an issue](https://github.com/mr-kasper/TW-class-sort/issues) on GitHub.

Pull requests are welcome!

## License

[MIT](https://github.com/mr-kasper/TW-class-sort/blob/main/LICENSE) — made by [@mr-kasper](https://github.com/mr-kasper)
