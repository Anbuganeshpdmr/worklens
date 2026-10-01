import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getActiveProjects,
  getActiveSprints,
} from "../api/projects";
import "../styles/HomePage.css";

function HomePage() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadActiveProjects();
    loadActiveSprints();
  }, []);

  const loadActiveProjects = async () => {
    try {
      const data = await getActiveProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load active projects:", error);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadActiveSprints = async () => {
    try {
      const data = await getActiveSprints();
      console.log("Active Sprints:", data);
      setSprints(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load active sprints:", error);
      setSprints([]);
    }
  };

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}/activities`);
  };

  const handleSprintClick = (sprintId) => {
    navigate(`/sprints/${sprintId}/activities`);
  };

  return (
    <div className="projects-sprints-page">
      <h1>Projects and Sprints</h1>

      {isLoading ? (
        <p>Loading projects...</p>
      ) : projects.length > 0 ? (
        <div className="projects-sprints-board">
          {projects.map((project) => {
            const projectSprints = sprints.filter(
              (sprint) => sprint.projectId === project.projectId
            );

            return (
              <div
                className="home-project-column"
                key={project.projectId}
              >
                <div
                  className="home-project-card"
                  onClick={() =>
                    handleProjectClick(project.projectId)
                  }
                >
                  <div
                    className="home-project-card-name"
                    title={project.projectName}
                  >
                    {project.projectName}
                  </div>

                  <div className="home-project-card-count">
                    {project.activeSprints} sprints
                  </div>
                </div>

                <div className="home-sprints-list">
                  {projectSprints.length > 0 ? (
                    projectSprints.map((sprint) => (
                      <div
                        className="home-sprint-card"
                        key={sprint.sprintId}
                        onClick={() =>
                          handleSprintClick(sprint.sprintId)
                        }
                      >
                        <span
                          className="home-sprint-card-name"
                          title={sprint.sprintName}
                        >
                          {sprint.sprintName}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="home-no-sprints">
                      No active sprints
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No active projects</p>
      )}
    </div>
  );
}

export default HomePage;