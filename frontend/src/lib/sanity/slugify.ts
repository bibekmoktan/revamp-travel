export function slugify(input: unknown): string {
  const text = Array.isArray(input)
    ? input.map((c) => (typeof c === 'string' ? c : '')).join('')
    : typeof input === 'string'
      ? input
      : String(input ?? '');
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function extractText(children: unknown): string {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(extractText).join('');
  if (children && typeof children === 'object' && 'props' in children) {
    const props = (children as { props?: { children?: unknown } }).props;
    return extractText(props?.children);
  }
  return '';
}
