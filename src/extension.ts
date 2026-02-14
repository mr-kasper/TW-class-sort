import * as vscode from 'vscode';
import { sortTailwindClasses } from './sorter';

let formatOnSaveDisposable: vscode.Disposable | undefined;

export function activate(context: vscode.ExtensionContext) {
  // Register the sort command
  const sortCommand = vscode.commands.registerCommand(
    'tailwindClassSorter.sortClasses',
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showWarningMessage('No active editor found.');
        return;
      }

      try {
        const result = await sortClassesInEditor(editor);
        if (result === 'sorted') {
          vscode.window.showInformationMessage('Tailwind CSS classes sorted successfully!');
        } else if (result === 'unchanged') {
          vscode.window.showInformationMessage('Tailwind CSS classes are already sorted.');
        } else {
          vscode.window.showWarningMessage('Failed to apply edits — the editor may have changed.');
        }
      } catch (error: any) {
        vscode.window.showErrorMessage(
          `Failed to sort Tailwind CSS classes: ${error.message || error}`,
        );
      }
    },
  );

  context.subscriptions.push(sortCommand);

  // Set up format on save if enabled
  setupFormatOnSave(context);

  // Listen for configuration changes
  const configWatcher = vscode.workspace.onDidChangeConfiguration((e) => {
    if (e.affectsConfiguration('tailwindClassSorter.formatOnSave')) {
      setupFormatOnSave(context);
    }
  });

  context.subscriptions.push(configWatcher);
}

function setupFormatOnSave(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration('tailwindClassSorter');
  const formatOnSave = config.get<boolean>('formatOnSave', false);

  // Dispose existing listener if any
  if (formatOnSaveDisposable) {
    formatOnSaveDisposable.dispose();
    formatOnSaveDisposable = undefined;
  }

  if (formatOnSave) {
    formatOnSaveDisposable = vscode.workspace.onWillSaveTextDocument((event) => {
      const supportedLanguages = [
        'html',
        'javascript',
        'javascriptreact',
        'typescript',
        'typescriptreact',
        'vue',
        'svelte',
        'astro',
        'php',
      ];

      if (!supportedLanguages.includes(event.document.languageId)) {
        return;
      }

      event.waitUntil(getSortEdits(event.document));
    });

    context.subscriptions.push(formatOnSaveDisposable);
  }
}

async function getSortEdits(document: vscode.TextDocument): Promise<vscode.TextEdit[]> {
  try {
    const originalText = document.getText();
    const sorted = await sortTailwindClasses(originalText, document.languageId, document.uri);

    if (sorted === originalText) {
      return [];
    }

    const fullRange = new vscode.Range(
      document.positionAt(0),
      document.positionAt(originalText.length),
    );

    return [vscode.TextEdit.replace(fullRange, sorted)];
  } catch (error: any) {
    // Silently fail on save — don't block the user from saving their file
    console.error('[Tailwind Class Sorter] Sort on save failed:', error.message || error);
    return [];
  }
}

async function sortClassesInEditor(
  editor: vscode.TextEditor,
): Promise<'sorted' | 'unchanged' | 'failed'> {
  const document = editor.document;
  const originalText = document.getText();
  const sorted = await sortTailwindClasses(originalText, document.languageId, document.uri);

  if (sorted === originalText) {
    return 'unchanged';
  }

  const fullRange = new vscode.Range(
    document.positionAt(0),
    document.positionAt(originalText.length),
  );

  const success = await editor.edit((editBuilder) => {
    editBuilder.replace(fullRange, sorted);
  });

  return success ? 'sorted' : 'failed';
}

export function deactivate() {
  if (formatOnSaveDisposable) {
    formatOnSaveDisposable.dispose();
  }
}
