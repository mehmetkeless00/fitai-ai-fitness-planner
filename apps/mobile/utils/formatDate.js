const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Always Gregorian — avoids the iOS Hijri calendar bug when device region is Arabic.
export function formatDate(dateStr, lang) {
  const d = new Date(dateStr);
  const day = d.getDate();
  const month = d.getMonth();
  const year = d.getFullYear();
  if (lang === 'tr') {
    return `${String(day).padStart(2, '0')}.${String(month + 1).padStart(2, '0')}.${year}`;
  }
  return `${MONTHS_EN[month]} ${day}, ${year}`;
}
