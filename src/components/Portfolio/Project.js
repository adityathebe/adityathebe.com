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
  const { sourceCodeUrl, demoUrl } = project;
  return (
    <div className="project-card">
      <div className="project-card__left-col">
        <Image alt={'hey'} fluid={project.image.childImageSharp.fluid}></Image>
      </div>

      <div className="right-col">
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <p className="project-card__project-name">{project.name}</p>
          <span className="project-card__project-type">{project.type}</span>
        </div>
        <p className={'project-card__project_duration'}>
          {durationFormatter(project.duration)}
        </p>
        <div className="project-card__project-btns">
          <a target="_blank" rel="noopener noreferrer" href={sourceCodeUrl}>
            <button disabled={sourceCodeUrl ? false : true}>Source Code</button>
          </a>
          <a target="_blank" rel="noopener noreferrer" href={demoUrl}>
            <button disabled={demoUrl ? false : true}>Visit</button>
          </a>
        </div>

        <div className={'project_card__project_description'}>
          <p>{project.description}</p>
        </div>

        <p className={'project_card__project_skills'}>
          {project.skills.map(x => {
            return <span className="project-skill-tag">{'#' + x}</span>;
          })}
        </p>
      </div>
    </div>
  );
};
