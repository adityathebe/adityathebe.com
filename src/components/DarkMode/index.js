import React from 'react';

import './darkModeToggle.css';

export default class DarkModeToggle extends React.Component {
  switchTheme(e) {
    if (e.target.checked) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }

  componentDidMount() {
    const query = '.theme-switch input[type="checkbox"]';
    const toggleSwitch = document.querySelector(query);
    toggleSwitch.addEventListener('change', this.switchTheme, false);

    let currentTheme = localStorage.getItem('theme');
    if (!currentTheme) {
      const prefersDarkMode = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
      currentTheme = prefersDarkMode ? 'dark' : 'light';
    }

    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
      toggleSwitch.checked = true;
    }
  }

  render() {
    return (
      <span className="theme-switch-wrapper">
        <label className="theme-switch" htmlFor="checkbox">
          <input type="checkbox" id="checkbox" />
          <span className="slider round" />
        </label>
      </span>
    );
  }
}

/*
 * Thanks to
 * https://dev.to/ananyaneogi/create-a-dark-light-mode-switch-with-css-variables-34l8
 */
