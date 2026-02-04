// @ts-check
import React, { useEffect, useRef, useState, useCallback } from 'react';
import './toc.css';

/**
 * @typedef {Object} TOCItem
 * @property {string} url
 * @property {string} title
 * @property {TOCItem[]} [items]
 */

/**
 * @typedef {Object} TableOfContentsProps
 * @property {TOCItem[]} [items]
 * @property {string} [html]
 * @property {React.RefObject<HTMLElement>} contentRef
 * @property {number} [maxDepth=3]
 */

/**
 * Recursively render a single TOC item
 * @param {Object} props
 * @param {TOCItem} props.item
 * @param {string} props.activeId
 * @param {(id: string) => void} props.onClick
 * @param {number} props.depth
 * @param {number} props.maxDepth
 */
const TOCItem = ({ item, activeId, onClick, depth, maxDepth }) => {
  const id = item.url?.slice(1) || '';
  const isActive = activeId === id;

  const handleClick = (e) => {
    e.preventDefault();
    if (id) onClick(id);
  };

  const hasChildren = item.items && item.items.length > 0 && depth < maxDepth;

  return (
    <li className="toc-item">
      <a
        href={item.url}
        className={`toc-link depth-${depth} ${isActive ? 'active' : ''}`}
        onClick={handleClick}
        aria-current={isActive ? 'true' : undefined}
      >
        {item.title}
      </a>
      {hasChildren && (
        <ul className="toc-list nested">
          {item.items.map((child) => (
            <TOCItem
              key={child.url}
              item={child}
              activeId={activeId}
              onClick={onClick}
              depth={depth + 1}
              maxDepth={maxDepth}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

/**
 * Shared hook for TOC logic
 * @param {Object} params
 * @param {React.RefObject<HTMLElement>} params.contentRef
 * @param {(expanded: boolean) => void} [params.setIsExpanded]
 * @returns {{ activeId: string, scrollToHeading: (id: string) => void }}
 */
const useTableOfContents = ({ contentRef, setIsExpanded }) => {
  const [activeId, setActiveId] = useState('');
  const observerRef = useRef(null);
  const isProgrammaticScrollRef = useRef(false);
  const lastActiveIdRef = useRef('');

  // Scroll to heading with offset for sticky header
  const scrollToHeading = useCallback(
    (id) => {
      if (typeof document === 'undefined' || !contentRef.current) return;

      // Pause observer during programmatic scroll
      isProgrammaticScrollRef.current = true;
      setActiveId(id);
      lastActiveIdRef.current = id;

      // Collapse mobile TOC after clicking
      if (setIsExpanded) setIsExpanded(false);

      const element = contentRef.current.querySelector(`[id="${id}"]`);
      if (element) {
        const offset = 80; // Height of sticky header + padding
        const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
        const y = elementTop - offset;

        window.scrollTo({ top: y, behavior: 'smooth' });

        // Update URL hash without polluting history
        if (typeof window !== 'undefined') {
          window.history.replaceState(null, '', `#${id}`);
        }
      }

      // Re-enable observer after animation completes
      setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 600);
    },
    [contentRef, setIsExpanded]
  );

  // Setup IntersectionObserver
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined' || !contentRef.current) return;

    const observerCallback = (entries) => {
      if (isProgrammaticScrollRef.current) return;

      // Get all intersecting entries
      const intersecting = entries.filter((e) => e.isIntersecting);

      if (intersecting.length > 0) {
        // Sort by top position and pick the first one (closest to top)
        intersecting.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const newActiveId = intersecting[0].target.id;

        if (newActiveId !== lastActiveIdRef.current) {
          setActiveId(newActiveId);
          lastActiveIdRef.current = newActiveId;
        }
      }
      // If nothing is intersecting, keep the last activeId (don't clear it)
    };

    observerRef.current = new IntersectionObserver(observerCallback, {
      rootMargin: '-15% 0px -70% 0px',
      threshold: 0,
    });

    // Observe all h2, h3 elements within the content
    const headings = contentRef.current.querySelectorAll('h2[id], h3[id], h4[id]');
    headings.forEach((heading) => {
      if (observerRef.current) {
        observerRef.current.observe(heading);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [contentRef]);

  // Handle initial hash on page load
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hash = window.location.hash;
    if (hash) {
      const id = hash.slice(1);
      const timer = setTimeout(() => {
        scrollToHeading(id);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [scrollToHeading]);

  // Handle browser back/forward buttons
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        scrollToHeading(hash.slice(1));
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [scrollToHeading]);

  return { activeId, scrollToHeading };
};

/**
 * Render TOC content (shared between desktop and mobile)
 * @param {Object} props
 * @param {TOCItem[]} [props.items]
 * @param {string} [props.html]
 * @param {string} props.activeId
 * @param {(id: string) => void} props.onClick
 * @param {number} props.maxDepth
 */
const TOCContent = ({ items = [], html, activeId, onClick, maxDepth }) => {
  if (html) {
    return <div className="toc-html-content" dangerouslySetInnerHTML={{ __html: html }} />;
  }

  return (
    <ul className="toc-list">
      {items.map((item) => (
        <TOCItem key={item.url} item={item} activeId={activeId} onClick={onClick} depth={1} maxDepth={maxDepth} />
      ))}
    </ul>
  );
};

/**
 * Desktop Sidebar Table of Contents
 * @param {TableOfContentsProps} props
 */
export const TableOfContentsSidebar = ({ items = [], html, contentRef, maxDepth = 3 }) => {
  const tocRef = useRef(null);
  const { activeId, scrollToHeading } = useTableOfContents({ contentRef });

  // Attach click handlers to HTML TOC links (for MarkdownRemark)
  useEffect(() => {
    if (!tocRef.current || !html) return;

    const links = tocRef.current.querySelectorAll('a[href^="#"]');
    const handleClick = (e) => {
      const href = e.currentTarget.getAttribute('href');
      if (href) {
        e.preventDefault();
        scrollToHeading(href.slice(1));
      }
    };

    links.forEach((link) => link.addEventListener('click', handleClick));
    return () => links.forEach((link) => link.removeEventListener('click', handleClick));
  }, [html, scrollToHeading]);

  if ((!items || items.length === 0) && !html) return null;

  return (
    <nav ref={tocRef} className="toc-sidebar" role="navigation" aria-label="Table of contents">
      <div className="toc-container">
        <h3 className="toc-title">Contents</h3>
        <TOCContent items={items} html={html} activeId={activeId} onClick={scrollToHeading} maxDepth={maxDepth} />
      </div>
    </nav>
  );
};

/**
 * Mobile Collapsible Table of Contents
 * @param {TableOfContentsProps} props
 */
export const MobileTableOfContents = ({ items = [], html, contentRef, maxDepth = 3 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const mobileTocRef = useRef(null);
  const { activeId, scrollToHeading } = useTableOfContents({ contentRef, setIsExpanded });

  // Attach click handlers for mobile TOC
  useEffect(() => {
    if (!mobileTocRef.current) return;

    const links = mobileTocRef.current.querySelectorAll('a[href^="#"]');
    const handleClick = (e) => {
      const href = e.currentTarget.getAttribute('href');
      if (href) {
        e.preventDefault();
        scrollToHeading(href.slice(1));
      }
    };

    links.forEach((link) => link.addEventListener('click', handleClick));
    return () => links.forEach((link) => link.removeEventListener('click', handleClick));
  }, [html, items, scrollToHeading]);

  if ((!items || items.length === 0) && !html) return null;

  return (
    <div className="toc-mobile" ref={mobileTocRef}>
      <button className="toc-mobile-toggle" onClick={() => setIsExpanded(!isExpanded)} aria-expanded={isExpanded}>
        <span>{isExpanded ? '−' : '+'}</span>
        <span>Table of Contents</span>
      </button>
      {isExpanded && (
        <div className="toc-mobile-content">
          <TOCContent items={items} html={html} activeId={activeId} onClick={scrollToHeading} maxDepth={maxDepth} />
        </div>
      )}
    </div>
  );
};

// Default export is the sidebar version for backward compatibility
export default TableOfContentsSidebar;
