// `lang` is optional and will default to the current user agent locale
export function formatPostDate(date, lang = 'en-US') {
  if (typeof Date.prototype.toLocaleDateString !== 'function') {
    return date;
  }

  date = new Date(date);
  const shortFormat = {
    day: '2-digit',
    month: 'short',
  };

  const fullFormat = {
    ...shortFormat,
    year: 'numeric',
  };

  return {
    short: date.toLocaleDateString(lang, shortFormat),
    full: date.toLocaleDateString(lang, fullFormat),
  };
}
