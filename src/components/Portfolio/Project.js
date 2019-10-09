// @ts-check
import React from 'react';
import Image from 'gatsby-image';

// @ts-ignore
import './Project.css';

function durationFormatter(duration) {
  const [start, end] = duration;
  return start + ' to ' + (end || 'ongoing');
}

export default ({ project }) => {
  return (
    <div className="project-card">
      <div className="project-card__left-col">
        <Image alt={'hey'} fluid={project.image.childImageSharp.fluid}></Image>
      </div>

      <div className="right-col">
        <p className="project-card__project-name">{project.name}</p>
        <p className={'project-card__project_duration'}>
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

        <div className={'project_card__project_description'}>
          <p>{project.description}</p>
        </div>

        <p className={'project_card__project_skills'}>
          {project.skills.join(' - ')}
        </p>
      </div>
    </div>
  );
};
