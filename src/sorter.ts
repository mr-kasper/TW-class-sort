import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Maps VS Code language IDs to Prettier parser names.
 */
function getPrettierParser(languageId: string): string {
  const parserMap: Record<string, string> = {
    html: 'html',
    javascript: 'babel',
    javascriptreact: 'babel',
    typescript: 'typescript',
    typescriptreact: 'typescript',
    vue: 'vue',
    svelte: 'html',
    astro: 'html',
    php: 'html',
  };

  return parserMap[languageId] || 'html';
}

/**
 * Tries to detect the tab width used in a source file by looking at indentation.
 */
function detectTabWidth(text: string): number | undefined {
  const lines = text.split('\n');
  const indentCounts: Record<number, number> = {};

  for (const line of lines) {
    const match = line.match(/^( +)\S/);
    if (match) {
      const spaces = match[1].length;
      // Only consider common indent widths
      for (const w of [2, 4, 8]) {
        if (spaces % w === 0) {
          indentCounts[w] = (indentCounts[w] || 0) + 1;
        }
      }
    }
  }

  // Return the most common indent width
  let best: number | undefined;
  let bestCount = 0;
  for (const [width, count] of Object.entries(indentCounts)) {
    if (count > bestCount) {
      bestCount = count;
      best = Number(width);
    }
  }

  return best;
}

/**
 * Sorts Tailwind CSS classes in the given text using prettier-plugin-tailwindcss.
 * Only class ordering is changed — no other Prettier formatting is applied.
 */
export async function sortTailwindClasses(
  text: string,
  languageId: string,
  fileUri: vscode.Uri,
): Promise<string> {
  // Dynamic import for ESM-only prettier v3
  const prettier = await import('prettier');

  const config = vscode.workspace.getConfiguration('tailwindClassSorter');
  const tailwindFunctions = config.get<string[]>('tailwindFunctions', ['clsx', 'cn', 'cva', 'tw']);
  const tailwindAttributes = config.get<string[]>('tailwindAttributes', ['class', 'className']);
  const tailwindConfigPath = config.get<string>('tailwindConfigPath', '');
  const tailwindStylesheet = config.get<string>('tailwindStylesheet', '');

  const workspaceFolder = vscode.workspace.getWorkspaceFolder(fileUri);
  const workspaceRoot = workspaceFolder?.uri.fsPath || path.dirname(fileUri.fsPath);

  // Try to resolve the user's existing prettier config so we don't reformat their code
  const filePath = fileUri.fsPath;
  let userConfig: Record<string, any> = {};
  try {
    const resolved = await prettier.resolveConfig(filePath);
    if (resolved) {
      userConfig = resolved;
    }
  } catch {
    // No user config found — that's fine, we'll use safe defaults
  }

  // Detect indentation style from the file content
  const useTabs = text.includes('\t');
  const tabWidth = userConfig.tabWidth ?? detectTabWidth(text) ?? 2;

  // Load the tailwind plugin (ESM module)
  const tailwindPlugin = await import('prettier-plugin-tailwindcss');

  // Build prettier options — merge user config + our overrides for minimal reformatting
  const prettierOptions: Record<string, any> = {
    // Safe defaults that minimize reformatting
    printWidth: 10000,
    htmlWhitespaceSensitivity: 'ignore' as const,

    // Apply user's prettier config (if any) so code style is preserved
    ...userConfig,

    // These must always be set by us
    parser: getPrettierParser(languageId),
    filepath: filePath,
    plugins: [tailwindPlugin.default ?? tailwindPlugin],
    tailwindFunctions,
    tailwindAttributes,

    // If no user config, infer from file
    tabWidth,
    useTabs,
  };

  // Tailwind v4: specify the CSS entry point stylesheet
  if (tailwindStylesheet) {
    prettierOptions.tailwindStylesheet = path.resolve(workspaceRoot, tailwindStylesheet);
  }

  // Tailwind v3: specify the JS config file
  if (tailwindConfigPath) {
    prettierOptions.tailwindConfig = path.resolve(workspaceRoot, tailwindConfigPath);
  }

  // Preserve trailing newline state
  const hadTrailingNewline = text.endsWith('\n');

  try {
    let formatted = await prettier.format(text, prettierOptions);

    // Prettier always adds a trailing newline — restore original state
    // to avoid false-positive diffs
    if (!hadTrailingNewline && formatted.endsWith('\n')) {
      formatted = formatted.replace(/\n$/, '');
    }

    return formatted;
  } catch (error: any) {
    // If the parser fails (e.g. unsupported syntax), log and re-throw
    console.error('[Tailwind Class Sorter] Prettier format error:', error.message);
    throw error;
  }
}
