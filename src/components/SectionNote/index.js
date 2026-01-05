import React from 'react';

import './index.css';

const SectionNote = ({ children, className = '' }) => {
  const classes = ['section-notes', className].filter(Boolean).join(' ');
  return (
    <aside className={classes} role="note">
      {children}
    </aside>
  );
};

export default SectionNote;
