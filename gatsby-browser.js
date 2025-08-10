/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import CopyButton from './src/components/CopyButton';

require('prismjs/themes/prism-tomorrow.css');

export const onRouteUpdate = () => {
  // Add copy buttons to code blocks after page load
  setTimeout(addCopyButtonsToCodeBlocks, 100);
};

function addCopyButtonsToCodeBlocks() {
  const codeBlocks = document.querySelectorAll('.gatsby-highlight');

  codeBlocks.forEach((block) => {
    // Check if copy button already exists
    if (block.querySelector('.copy-button-container')) {
      return;
    }

    const preElement = block.querySelector('pre');
    if (preElement) {
      let code = preElement.textContent;

      // Check if this is a shell code block and handle $ prefix removal
      const isShellBlock =
        preElement.className.includes('language-shell') ||
        preElement.className.includes('language-bash') ||
        preElement.className.includes('language-sh');

      if (isShellBlock) {
        // For shell blocks, we don't need to remove $ since it's added via CSS
        // The textContent already doesn't include the CSS-generated content
        // But we should be aware this is a shell block for potential future enhancements
      }

      // Create copy button container
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'copy-button-container';

      // Create and mount React component
      const root = createRoot(buttonContainer);
      root.render(React.createElement(CopyButton, { textToCopy: code }));

      block.appendChild(buttonContainer);
    }
  });
}
