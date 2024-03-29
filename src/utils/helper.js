/*
  Source : https://github.com/gaearon/overreacted.io/blob/master/src/utils/helpers.js
  Dan Abramov
*/

export function formatReadingTime(minutes) {
  let cups = Math.round(minutes / 5);
  if (cups > 5) {
    return `${new Array(Math.round(cups / Math.E)).fill('🍱').join('')} ${minutes} min read`;
  } else {
    return `${new Array(cups || 1).fill('☕️').join('')} ${minutes} min read`;
  }
}

// `lang` is optional and will default to the current user agent locale
export function formatPostDate(date, lang = 'en-US') {
  if (typeof Date.prototype.toLocaleDateString !== 'function') {
    return date;
  }

  date = new Date(date);
  const args = [lang, { day: '2-digit', month: 'short', year: 'numeric' }].filter(Boolean);
  return date.toLocaleDateString(...args);
}
