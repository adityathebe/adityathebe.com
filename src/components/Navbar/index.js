// @ts-check
import React from 'react';
import { Link } from 'gatsby';

import './navbar.css';
import DarkModeToggle from '../DarkMode';

import moon from './moon.png';
import sun from './sun.png';

class Navbar extends React.Component {
  state = {
    theme: null,
  };

  componentDidMount() {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
      setTheme(currentTheme);
      this.setState({ theme: currentTheme });
    }
  }

  render() {
    return (
      <header className="site-header" role="banner">
        <div className="head-wrapper">
          <Link className="site-title" to="/">
            Home
          </Link>

          <nav className="site-nav">
            <input type="checkbox" id="nav-trigger" className="nav-trigger" />
            <label htmlFor="nav-trigger">
              <span className="menu-icon">
                <svg viewBox="0 0 18 15" width="18px" height="15px">
                  <path
                    fill="#424242"
                    d="M18,1.484c0,0.82-0.665,1.484-1.484,1.484H1.484C0.665,2.969,0,2.304,0,1.484l0,0C0,0.665,0.665,0,1.484,0 h15.031C17.335,0,18,0.665,18,1.484L18,1.484z"
                  />
                  <path
                    fill="#424242"
                    d="M18,7.516C18,8.335,17.335,9,16.516,9H1.484C0.665,9,0,8.335,0,7.516l0,0c0-0.82,0.665-1.484,1.484-1.484 h15.031C17.335,6.031,18,6.696,18,7.516L18,7.516z"
                  />
                  <path
                    fill="#424242"
                    d="M18,13.516C18,14.335,17.335,15,16.516,15H1.484C0.665,15,0,14.335,0,13.516l0,0 c0-0.82,0.665-1.484,1.484-1.484h15.031C17.335,12.031,18,12.696,18,13.516L18,13.516z"
                  />
                </svg>
              </span>
            </label>

            <div className="trigger">
              <Link className="page-link" to="/portfolio">
                Portfolio
              </Link>
              <Link className="page-link" to="/uses">
                Uses
              </Link>
              <DarkModeToggle
                icons={{
                  checked: (
                    <img
                      src={moon}
                      width="16"
                      height="16"
                      role="presentation"
                      style={{ pointerEvents: 'none' }}
                    />
                  ),
                  unchecked: (
                    <img
                      src={sun}
                      width="16"
                      height="16"
                      role="presentation"
                      style={{ pointerEvents: 'none' }}
                    />
                  ),
                }}
                checked={this.state.theme === 'dark'}
                onChange={e => {
                  const newTheme =
                    this.state.theme === 'dark' ? 'light' : 'dark';
                  this.setState({ theme: newTheme });
                  changeTheme();
                }}
              />
            </div>
          </nav>
        </div>
      </header>
    );
  }
}

export default Navbar;

function setTheme(themeName) {
  document.documentElement.classList.add('transition');
  document.documentElement.setAttribute('data-theme', themeName);
  window.setTimeout(
    () => document.documentElement.classList.remove('transition'),
    600
  );
}

function changeTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
  localStorage.setItem('theme', newTheme);
}
