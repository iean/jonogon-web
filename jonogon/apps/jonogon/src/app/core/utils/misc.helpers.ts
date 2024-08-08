export function getFileSizeFormat(value: number | string): string {
  value = Number(value);
  if (value === null || value === undefined || isNaN(value)) {
    return '';
  }

  if (value < 1024) {
    return `${value} bytes`;
  }

  if (value < 1024 * 1024) {
    const kbValue = Math.round(value / 1024);
    return `${kbValue} KB`;
  }

  if (value < 1024 * 1024 * 1024) {
    const mbValue = Math.round(value / (1024 * 1024));
    return `${mbValue} MB`;
  }

  const gbValue = Math.round(value / (1024 * 1024 * 1024));
  return `${gbValue} GB`;
}
