import React, { useEffect, useState } from 'react';

import './darkModeToggle.css';

const THEME_STORAGE_KEY = 'theme';
const DARK_MODE_QUERY = '(prefers-color-scheme: dark)';
const THEME_MODES = ['auto', 'light', 'dark'];
const THEME_LABELS = {
  auto: 'Auto',
  light: 'Light',
  dark: 'Dark',
};

function isThemeMode(themeMode) {
  return THEME_MODES.includes(themeMode);
}

function getNextThemeMode(themeMode) {
  const currentIndex = THEME_MODES.indexOf(themeMode);

  if (currentIndex === -1) {
    return 'auto';
  }

  return THEME_MODES[(currentIndex + 1) % THEME_MODES.length];
}

function getPreferredColorScheme() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'light';
  }

  return window.matchMedia(DARK_MODE_QUERY).matches ? 'dark' : 'light';
}

function resolveTheme(themeMode) {
  return themeMode === 'auto' ? getPreferredColorScheme() : themeMode;
}

function applyTheme(themeMode) {
  if (typeof document === 'undefined') {
    return;
  }

  document.documentElement.setAttribute('data-theme', resolveTheme(themeMode));
  document.documentElement.setAttribute('data-theme-mode', themeMode);
}

function getStoredThemeMode() {
  if (typeof window === 'undefined') {
    return 'auto';
  }

  try {
    const storedThemeMode = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isThemeMode(storedThemeMode) ? storedThemeMode : 'auto';
  } catch {
    return 'auto';
  }
}

function storeThemeMode(themeMode) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);
  } catch {
    return;
  }
}

function ThemeIcon({ themeMode }) {
  if (themeMode === 'light') {
    return (
      <svg className="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </svg>
    );
  }

  if (themeMode === 'dark') {
    return (
      <svg className="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.5 14.5A8 8 0 0 1 9.5 3.5 8.5 8.5 0 1 0 20.5 14.5Z" />
      </svg>
    );
  }

  return (
    <svg className="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="7" />
      <path className="theme-icon-fill" d="M12 5a7 7 0 0 1 0 14Z" />
    </svg>
  );
}

export default function DarkModeToggle() {
  const [themeMode, setThemeMode] = useState('auto');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedThemeMode = getStoredThemeMode();
    setThemeMode(storedThemeMode);
    applyTheme(storedThemeMode);
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) {
      return undefined;
    }

    applyTheme(themeMode);

    if (themeMode !== 'auto' || typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined;
    }

    const mediaQuery = window.matchMedia(DARK_MODE_QUERY);
    const handleColorSchemeChange = () => {
      applyTheme('auto');
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleColorSchemeChange);

      return () => {
        mediaQuery.removeEventListener('change', handleColorSchemeChange);
      };
    }

    mediaQuery.addListener(handleColorSchemeChange);

    return () => {
      mediaQuery.removeListener(handleColorSchemeChange);
    };
  }, [isReady, themeMode]);

  const handleThemeChange = () => {
    const nextThemeMode = getNextThemeMode(themeMode);

    setThemeMode(nextThemeMode);
    storeThemeMode(nextThemeMode);
    applyTheme(nextThemeMode);
  };

  return (
    <span className="theme-switch-wrapper">
      <button
        className="theme-button"
        type="button"
        onClick={handleThemeChange}
        aria-label={`Theme: ${THEME_LABELS[themeMode]}. Switch to ${THEME_LABELS[getNextThemeMode(themeMode)]}.`}
        title={`Theme: ${THEME_LABELS[themeMode]}`}
      >
        <ThemeIcon themeMode={themeMode} />
        <span className="theme-button-label">{THEME_LABELS[themeMode]}</span>
      </button>
    </span>
  );
}
