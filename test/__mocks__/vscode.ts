/**
 * Minimal mock of the 'vscode' module for unit tests.
 * Only stubs the APIs actually used by sorter.ts.
 */

export const Uri = {
  file: (path: string) => ({ fsPath: path, scheme: 'file' }),
  parse: (str: string) => ({ fsPath: str, scheme: 'file' }),
};

export const workspace = {
  getConfiguration: (_section?: string) => ({
    get: <T>(key: string, defaultValue: T): T => defaultValue,
  }),
  getWorkspaceFolder: (_uri: any) => undefined,
};

export const window = {
  activeTextEditor: undefined,
  showInformationMessage: () => {},
  showWarningMessage: () => {},
  showErrorMessage: () => {},
};

export class Range {
  constructor(
    public start: any,
    public end: any,
  ) {}
}

export class Position {
  constructor(
    public line: number,
    public character: number,
  ) {}
}

export const TextEdit = {
  replace: (range: any, text: string) => ({ range, newText: text }),
};

export const commands = {
  registerCommand: () => ({ dispose: () => {} }),
};

// DiagnosticSeverity enum
export enum DiagnosticSeverity {
  Error = 0,
  Warning = 1,
  Information = 2,
  Hint = 3,
}
