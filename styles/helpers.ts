export function classNames(
  optional: Record<string, boolean | undefined>,
  additional?: string[]
): string {
  var names = additional ?? [];

  var keys = Object.keys(optional);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (optional[key]) {
      names.push(key);
    }
  }

  return names.join(" ");
}
