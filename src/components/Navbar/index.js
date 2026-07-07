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

  useEffect(() => {
    const navElement = navRef.current;

    if (!navElement) {
      return undefined;
    }

    const updateVisualViewportOffset = () => {
      const visualViewport = window.visualViewport;
      const bottomOffset = visualViewport
        ? Math.max(0, window.innerHeight - visualViewport.height - visualViewport.offsetTop)
        : 0;
      const centerOffset = visualViewport
        ? visualViewport.offsetLeft + visualViewport.width / 2 - window.innerWidth / 2
        : 0;

      navElement.style.setProperty('--visual-viewport-bottom-offset', `${Math.round(bottomOffset)}px`);
      navElement.style.setProperty('--visual-viewport-center-offset', `${Math.round(centerOffset)}px`);
    };

    updateVisualViewportOffset();

    window.addEventListener('resize', updateVisualViewportOffset);
    window.addEventListener('orientationchange', updateVisualViewportOffset);
    window.visualViewport?.addEventListener('resize', updateVisualViewportOffset);
    window.visualViewport?.addEventListener('scroll', updateVisualViewportOffset);

    return () => {
      window.removeEventListener('resize', updateVisualViewportOffset);
      window.removeEventListener('orientationchange', updateVisualViewportOffset);
      window.visualViewport?.removeEventListener('resize', updateVisualViewportOffset);
      window.visualViewport?.removeEventListener('scroll', updateVisualViewportOffset);
      navElement.style.removeProperty('--visual-viewport-bottom-offset');
      navElement.style.removeProperty('--visual-viewport-center-offset');
    };
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
    <header className="site-header my-4 flex justify-between" role="banner">
      <Link className="site-home-link text-lg" to="/">
        Home
      </Link>

      <nav className="site-nav relative" ref={navRef} role="navigation">
        <div className="mobile-nav-controls">
          <Link className="mobile-home-button" to="/" onClick={closeMenu} aria-label="Home">
            <svg className="mobile-home-icon" viewBox="0 0 18 18" aria-hidden="true">
              <path d="M3.5 8.3 9 3.7l5.5 4.6" />
              <path d="M5.2 7.5v6.2h7.6V7.5" />
              <path d="M7.8 13.7v-3h2.4v3" />
            </svg>
          </Link>
          <span className="mobile-nav-divider" aria-hidden="true" />
          <button
            type="button"
            className="mobile-menu-button"
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            aria-controls="navigation-menu"
          >
            <svg className="mobile-menu-icon" viewBox="0 0 18 18" aria-hidden="true">
              <path className="mobile-menu-line mobile-menu-line-top" d="M5 7h8" />
              <path className="mobile-menu-line mobile-menu-line-bottom" d="M5 11h8" />
            </svg>
          </button>
        </div>

        <div className={`nav-menu${isMenuOpen ? ' is-open' : ''}`} id="navigation-menu">
          {links.map(({ url, label }) => (
            <Link key={url} className="nav-link" to={url} onClick={closeMenu}>
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
