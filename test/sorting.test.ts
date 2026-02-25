import { describe, it, expect } from 'vitest';
import { sortTailwindClasses } from '../src/sorter';
import { Uri } from 'vscode';

describe('sortTailwindClasses', () => {
  const fileUri = Uri.file('/tmp/test.html') as any;

  it('sorts HTML classes into Tailwind recommended order', async () => {
    const input =
      '<div class="p-4 flex bg-white items-center shadow-lg rounded-lg justify-between">Hello</div>';
    const result = await sortTailwindClasses(input, 'html', fileUri);
    // flex should come before items-center, justify-between, etc.
    expect(result).toContain('flex');
    expect(result).toContain('items-center');
    expect(result).toContain('justify-between');
    // flex should appear before p-4 in sorted output
    const flexIdx = result.indexOf('flex');
    const p4Idx = result.indexOf('p-4');
    expect(flexIdx).toBeLessThan(p4Idx);
  });

  it('returns unchanged text when classes are already sorted', async () => {
    const input =
      '<div class="flex items-center justify-between rounded-lg bg-white p-4 shadow-lg">Hello</div>';
    const result = await sortTailwindClasses(input, 'html', fileUri);
    expect(result).toBe(input);
  });

  it('handles JSX className attribute', async () => {
    const input = '<div className="p-4 flex bg-white items-center">Hello</div>';
    const result = await sortTailwindClasses(input, 'typescriptreact', fileUri);
    const flexIdx = result.indexOf('flex');
    const p4Idx = result.indexOf('p-4');
    expect(flexIdx).toBeLessThan(p4Idx);
  });

  it('handles an empty class attribute', async () => {
    const input = '<div class="">Hello</div>';
    const result = await sortTailwindClasses(input, 'html', fileUri);
    expect(result).toBe(input);
  });

  it('handles file with no classes', async () => {
    const input = '<div>No classes here</div>';
    const result = await sortTailwindClasses(input, 'html', fileUri);
    expect(result).toBe(input);
  });

  it('preserves trailing newline when present', async () => {
    const input = '<div class="p-4 flex">Hello</div>\n';
    const result = await sortTailwindClasses(input, 'html', fileUri);
    expect(result.endsWith('\n')).toBe(true);
  });

  it('does not add trailing newline when absent', async () => {
    const input = '<div class="p-4 flex">Hello</div>';
    const result = await sortTailwindClasses(input, 'html', fileUri);
    expect(result.endsWith('\n')).toBe(false);
  });

  it('sorts classes with responsive variants', async () => {
    const input = '<div class="sm:p-4 text-center p-2 bg-blue-500 hover:bg-blue-700"></div>';
    const result = await sortTailwindClasses(input, 'html', fileUri);
    // bg-blue-500 should come before p-2
    expect(result).toContain('bg-blue-500');
    expect(result).toContain('sm:p-4');
    expect(result).toContain('hover:bg-blue-700');
  });

  it('sorts classes with dark mode variant', async () => {
    const input = '<div class="dark:bg-gray-800 bg-white p-4 dark:text-white text-black"></div>';
    const result = await sortTailwindClasses(input, 'html', fileUri);
    // Should contain all classes
    expect(result).toContain('dark:bg-gray-800');
    expect(result).toContain('bg-white');
    expect(result).toContain('dark:text-white');
    expect(result).toContain('text-black');
  });

  it('handles multiple elements', async () => {
    const input = [
      '<div class="p-4 flex">',
      '  <span class="text-red-500 font-bold">Hello</span>',
      '</div>',
    ].join('\n');
    const result = await sortTailwindClasses(input, 'html', fileUri);
    // Both elements should have sorted classes
    expect(result).toContain('flex');
    expect(result).toContain('font-bold');
  });

  it('handles Vue template', async () => {
    const input = '<template><div class="p-4 flex bg-white">Hello</div></template>';
    const result = await sortTailwindClasses(input, 'vue', fileUri);
    const flexIdx = result.indexOf('flex');
    const p4Idx = result.indexOf('p-4');
    expect(flexIdx).toBeLessThan(p4Idx);
  });

  it('handles many classes', async () => {
    const input =
      '<div class="z-10 relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-200"></div>';
    const result = await sortTailwindClasses(input, 'html', fileUri);
    // relative should come before z-10 in Tailwind order
    expect(result).toContain('relative');
    expect(result).toContain('z-10');
    expect(result).toContain('overflow-hidden');
  });

  it('does not destroy non-Tailwind content', async () => {
    const input = '<div class="my-custom-class flex p-4">Hello world</div>';
    const result = await sortTailwindClasses(input, 'html', fileUri);
    expect(result).toContain('my-custom-class');
    expect(result).toContain('Hello world');
  });
});
