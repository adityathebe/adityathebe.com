// @ts-check
import React from 'react';
import Image from 'gatsby-image';

// @ts-ignore
import ProjectCSS from './Project.module.css';

function durationFormatter(duration) {
  const [start, end] = duration;
  return start + ' to ' + (end || 'ongoing');
}

export default ({ project }) => {
  return (
    <div className={ProjectCSS.card}>
      <div className={ProjectCSS.leftCol}>
        <p className={ProjectCSS.projectName}>{project.name}</p>
        <p className={ProjectCSS.projectDuration}>
          {durationFormatter(project.duration)}
        </p>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={project.sourceCodeUrl}
        >
          <button>Source Code</button>
        </a>
        <a target="_blank" rel="noopener noreferrer" href={project.demoUrl}>
          <button>Visit</button>
        </a>

        <div className={ProjectCSS.projectDescription}>
          <p>{project.description}</p>
        </div>

        <p className={ProjectCSS.projectSkills}>{project.skills.join(' - ')}</p>
      </div>
      <div className={ProjectCSS.rightCol}>
        <Image alt={'hey'} fixed={project.image.childImageSharp.fixed}></Image>
      </div>
    </div>
  );
};
