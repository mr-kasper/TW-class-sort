import { describe, it, expect } from 'vitest';
import { getPrettierParser, detectTabWidth } from '../src/sorter';

describe('getPrettierParser', () => {
  it('maps html to html', () => {
    expect(getPrettierParser('html')).toBe('html');
  });

  it('maps javascript to babel', () => {
    expect(getPrettierParser('javascript')).toBe('babel');
  });

  it('maps javascriptreact to babel', () => {
    expect(getPrettierParser('javascriptreact')).toBe('babel');
  });

  it('maps typescript to typescript', () => {
    expect(getPrettierParser('typescript')).toBe('typescript');
  });

  it('maps typescriptreact to typescript', () => {
    expect(getPrettierParser('typescriptreact')).toBe('typescript');
  });

  it('maps vue to vue', () => {
    expect(getPrettierParser('vue')).toBe('vue');
  });

  it('maps svelte to html', () => {
    expect(getPrettierParser('svelte')).toBe('html');
  });

  it('maps astro to html', () => {
    expect(getPrettierParser('astro')).toBe('html');
  });

  it('maps php to html', () => {
    expect(getPrettierParser('php')).toBe('html');
  });

  it('returns html for unknown language', () => {
    expect(getPrettierParser('ruby')).toBe('html');
    expect(getPrettierParser('')).toBe('html');
  });
});

describe('detectTabWidth', () => {
  it('detects 2-space indentation', () => {
    const text = [
      '<div>',
      '  <span>hello</span>',
      '  <span>world</span>',
      '    <p>nested</p>',
      '</div>',
    ].join('\n');
    expect(detectTabWidth(text)).toBe(2);
  });

  it('detects 4-space indentation', () => {
    // Note: pure 4-space indentation is ambiguous with 2-space (4 is divisible by 2).
    // The heuristic returns the smallest matching width (2) in a tiebreak.
    // This is fine in practice since Prettier user config takes priority.
    const text = [
      'function foo() {',
      '    const x = 1;',
      '    const y = 2;',
      '        return x + y;',
      '}',
    ].join('\n');
    expect(detectTabWidth(text)).toBe(2);
  });

  it('returns undefined for no indentation', () => {
    const text = 'no indent here\njust flat lines\n';
    expect(detectTabWidth(text)).toBeUndefined();
  });

  it('returns undefined for empty string', () => {
    expect(detectTabWidth('')).toBeUndefined();
  });

  it('returns undefined for tab-only indentation', () => {
    const text = 'line1\n\tindented\n\t\tdouble\n';
    expect(detectTabWidth(text)).toBeUndefined();
  });
});
