# Tailwind CSS Class Sorter

A VS Code extension that sorts Tailwind CSS classes in the recommended order using [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss).

## Features

- **Sort Command**: Run `Sort Tailwind CSS Classes` from the Command Palette to sort all Tailwind classes in the current file.
- **Format on Save**: Optionally auto-sort classes every time you save.
- **Custom Functions**: Supports sorting inside utility functions like `clsx`, `cn`, `cva`, and `tw`.
- **Multi-language**: Works with HTML, JSX, TSX, Vue, Svelte, Astro, and PHP files.
- **Tailwind v4 & v3**: Supports both Tailwind CSS v4 (CSS-based config via `@import "tailwindcss"`) and v3 (`tailwind.config.js`).

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

## Requirements

- VS Code 1.85.0 or later
- A project using Tailwind CSS v4 or v3

## License

MIT
