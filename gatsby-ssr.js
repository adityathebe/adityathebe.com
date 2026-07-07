import React from 'react';

const themeScript = `
(function () {
  var themeMode = 'auto';

  try {
    var storedThemeMode = window.localStorage.getItem('theme');

    if (storedThemeMode === 'auto' || storedThemeMode === 'light' || storedThemeMode === 'dark') {
      themeMode = storedThemeMode;
    }
  } catch (error) {}

  var prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  var resolvedTheme = themeMode === 'auto' ? (prefersDarkMode ? 'dark' : 'light') : themeMode;

  document.documentElement.setAttribute('data-theme', resolvedTheme);
  document.documentElement.setAttribute('data-theme-mode', themeMode);
})();
`;

export const onRenderBody = ({ setHeadComponents, setPostBodyComponents }) => {
  setHeadComponents([<script key="theme" dangerouslySetInnerHTML={{ __html: themeScript }} />]);

  setPostBodyComponents([<script key="analytics" async defer src="https://stats.adityathebe.com/latest.js" />]);
};
