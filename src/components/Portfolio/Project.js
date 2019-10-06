// @ts-check
import React from 'react';

import './Project.css'

export default ({ project }) => {
  return (
    <div className="project-card">
      <p className="project-card--name">{project.name}</p>
      <p className="project-card--skills">{project.skills.join(' - ')}</p>
      <p className="project-card--description">{project.description}</p>
    </div>
    /**
     * Project Name
     * Description
     * Image
     * Tools and Libraries used
     * [Source Code]
     * [Demo Url]
     * Tags
     */
  );
};
