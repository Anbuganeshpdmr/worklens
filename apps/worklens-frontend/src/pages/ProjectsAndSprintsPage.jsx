import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getActiveProjects, getActiveSprints } from "../api/projects";
import "../styles/ProjectsAndSprintsPage.css";

function ProjectsAndSprintsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    Promise.all([getActiveProjects(), getActiveSprints()])
      .then(([projectData, sprintData]) => {
        if (!mounted) return;
        setProjects(toItems(projectData));
        setSprints(toItems(sprintData));
      })
      .catch((err) => {
        if (mounted)
          setError(err.message || "Failed to load projects and sprints.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  function retry() {
    setLoading(true);
    setError("");
    Promise.all([getActiveProjects(), getActiveSprints()])
      .then(([projectData, sprintData]) => {
        setProjects(toItems(projectData));
        setSprints(toItems(sprintData));
      })
      .catch((err) =>
        setError(err.message || "Failed to load projects and sprints."),
      )
      .finally(() => setLoading(false));
  }

  return (
    <div className="projects-page">
      <main className="projects-page__main">
        <header className="projects-page__header">
          <div>
            <p className="projects-page__eyebrow">Workspace overview</p>
            <h1 className="projects-page__title">Projects And Sprints</h1>
            <p className="projects-page__subtitle">
              Keep track of the work currently in motion.
            </p>
          </div>
          <div className="projects-page__header-icon" aria-hidden="true">
            <i className="bi bi-kanban" />
          </div>
        </header>

        {error && (
          <div className="projects-page__error" role="alert">
            <i className="bi bi-exclamation-circle" />
            <span>{error}</span>
            <button type="button" onClick={retry}>
              Try again
            </button>
          </div>
        )}

        <section
          className="projects-page__section"
          aria-labelledby="active-projects-title"
        >
          <div className="projects-page__section-heading">
            <div>
              <p className="projects-page__section-kicker">Portfolio</p>
              <h2 id="active-projects-title">Active projects</h2>
            </div>
            <span className="projects-page__count">
              {projects.length} active
            </span>
          </div>
          <div className="projects-page__project-rail">
            {loading ? (
              <LoadingCards count={3} />
            ) : projects.length ? (
              projects.map((project, index) => (
                <ProjectCard key={getId(project, index)} project={project} />
              ))
            ) : (
              <EmptyState label="No active projects" />
            )}
          </div>
        </section>

        <section
          className="projects-page__section projects-page__section--sprints"
          aria-labelledby="active-sprints-title"
        >
          <div className="projects-page__section-heading">
            <div>
              <p className="projects-page__section-kicker">Delivery cycle</p>
              <h2 id="active-sprints-title">Active Sprints</h2>
            </div>
            <span className="projects-page__count">
              {sprints.length} active
            </span>
          </div>
          <div className="projects-page__sprint-grid">
            {loading ? (
              <LoadingCards count={6} />
            ) : sprints.length ? (
              sprints.map((sprint, index) => (
                <SprintCard
                  key={getSprintId(sprint, index)}
                  sprint={sprint}
                  onOpen={() =>
                    navigate(
                      `/sprints/${getSprintId(sprint, index)}/activities`,
                    )
                  }
                />
              ))
            ) : (
              <EmptyState label="No active sprints" />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function ProjectCard({ project }) {
  const title = getText(
    project,
    ["name", "projectName", "title"],
    "Untitled project",
  );
  const id = getText(project, ["projectId", "id", "code"], "Project");
  const description = getText(
    project,
    ["description", "summary"],
    "Active project",
  );
  const owner = getText(
    project,
    ["ownerName", "owner", "createdBy"],
    "Team workspace",
  );

  return (
    <article
      className="project-card"
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen();
        }
      }}
    >
      <div className="project-card__topline">
        <span className="project-card__icon">
          <i className="bi bi-folder2-open" />
        </span>
        <span className="project-card__status">Active</span>
      </div>
      <h3>{title}</h3>
      <p className="project-card__id">{id}</p>
      <p className="project-card__description">{description}</p>
      <div className="project-card__footer">
        <i className="bi bi-person" />
        <span>{owner}</span>
      </div>
    </article>
  );
}

function SprintCard({ sprint, onOpen }) {
  const title = getText(
    sprint,
    ["name", "sprintName", "title"],
    "Untitled sprint",
  );
  const project = getText(
    sprint,
    ["projectName", "project?.name"],
    "Active project",
  );
  const start = getDate(sprint, ["startDate", "startsOn", "startTime"]);
  const end = getDate(sprint, ["endDate", "endsOn", "endTime"]);

  return (
    <article
      className="sprint-card"
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen();
        }
      }}
    >
      <div className="sprint-card__topline">
        <span className="sprint-card__icon">
          <i className="bi bi-lightning-charge-fill" />
        </span>
        <span className="sprint-card__status">Active</span>
      </div>
      <h3>{title}</h3>
      <p className="sprint-card__project">
        <i className="bi bi-folder2" /> {project}
      </p>
      <div className="sprint-card__dates">
        <span>
          <small>Starts</small>
          {start}
        </span>
        <span>
          <small>Ends</small>
          {end}
        </span>
      </div>
      <button
        type="button"
        className="sprint-card__action"
        onClick={(event) => {
          event.stopPropagation();
          onOpen();
        }}
      >
        Open activities <i className="bi bi-arrow-up-right" />
      </button>
    </article>
  );
}

function LoadingCards({ count }) {
  return Array.from({ length: count }, (_, index) => (
    <div className="projects-page__skeleton" key={index} aria-hidden="true" />
  ));
}

function EmptyState({ label }) {
  return (
    <div className="projects-page__empty">
      <i className="bi bi-inbox" />
      <span>{label}</span>
    </div>
  );
}

function toItems(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.content)) return response.content;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.items)) return response.items;
  return [];
}

function getId(item, index = 0) {
  return getText(
    item,
    ["id", "projectId", "sprintId", "code"],
    `item-${index}`,
  );
}

function getSprintId(item, index = 0) {
  return getText(item, ["sprintId", "id", "code"], `sprint-${index}`);
}

function getText(item, fields, fallback) {
  for (const field of fields) {
    const value = field
      .split(".")
      .reduce((current, key) => current?.[key], item);
    if (value !== undefined && value !== null && String(value).trim())
      return String(value);
  }
  return fallback;
}

function getDate(item, fields) {
  const value = getText(item, fields, "Not scheduled");
  if (value === "Not scheduled") return value;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default ProjectsAndSprintsPage;
