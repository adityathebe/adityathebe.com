// @ts-check
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'gatsby';

import './navbar.css';
import DarkModeToggle from '../DarkMode';

// Mobile breakpoint matching CSS media query
const MOBILE_BREAKPOINT = 450;

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef(null);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // Handle clicks outside the navigation and escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;

    if (isMenuOpen && isMobile) {
      document.addEventListener('pointerdown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);

      return () => {
        document.removeEventListener('pointerdown', handleClickOutside);
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [isMenuOpen]);

  // Handle window resize - close menu when switching to desktop view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > MOBILE_BREAKPOINT && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMenuOpen]);

  const links = [
    { url: '/tags', label: 'Tags' },
    { url: '/uses', label: 'Uses' },
    { url: '/about', label: 'About' },
    { url: '/now', label: 'Now' },
    { url: '/links', label: 'Links' },
  ];

  return (
    <header className="my-4 flex justify-between" role="banner">
      <Link className="text-lg" to="/">
        Home
      </Link>

      <nav className="site-nav relative" ref={navRef} role="navigation">
        <input
          type="checkbox"
          id="nav-trigger"
          className="nav-trigger"
          checked={isMenuOpen}
          onChange={toggleMenu}
          aria-hidden="true"
        />
        <label
          htmlFor="nav-trigger"
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          aria-controls="navigation-menu"
          className="relative z-3"
        >
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

        <div
          className="trigger absolute top-0 right-0 z-2 flex border border-(--border-color-1) bg-(--bg-color) sm:rounded-md sm:border-0"
          id="navigation-menu"
        >
          {links.map(({ url, label }) => (
            <Link key={url} className="block pr-2 pl-6 sm:mr-4 sm:pl-0" to={url} onClick={closeMenu}>
              {label}
            </Link>
          ))}
          <DarkModeToggle />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
