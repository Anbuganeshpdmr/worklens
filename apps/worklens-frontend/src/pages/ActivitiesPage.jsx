import "../styles/activities/ActivitiesPage.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getIndividualProjectDetails } from "../api/projects";
import { mapProjectDetails } from "../components/activities/projectMapper";
import ActivityList from "../components/activities/ActivityList";

function ActivitiesPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState("activities");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setError("");
        const response = await getIndividualProjectDetails(projectId);
        const projectData = mapProjectDetails(response);
        setProject(projectData);
      } catch (error) {
        setError(error?.message || "Failed to load project details.");
      }
    };

    fetchProject();
  }, [projectId]);

  const projectTitle = project?.projectName || "Project";

  return (
    <div className="act-page">
      <main className="act-page__main">
        {/* Page Header */}
        <header className="act-page__header">
          <h1 className="act-page__title">{projectTitle}-Activities</h1>
          <p className="act-page__subtitle">
            Manage activities and sprints for this project.
            {/* Switchable Tabs */}
            <div
              className="act-page__tabs"
              role="tablist"
              aria-label="Activities sections"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "activities"}
                className={`act-page__tab${activeTab === "activities" ? " act-page__tab--active" : ""}`}
                onClick={() => setActiveTab("activities")}
              >
                Activities
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "sprints"}
                className={`act-page__tab${activeTab === "sprints" ? " act-page__tab--active" : ""}`}
                onClick={() => setActiveTab("sprints")}
              >
                Sprints
              </button>
            </div>
          </p>
        </header>

        {error && (
          <div className="act-page__error" role="alert">
            <i className="bi bi-exclamation-circle" /> {error}
          </div>
        )}

        {/* Tab Content */}
        <div className="act-page__content">
          {activeTab === "activities" && <ActivityList projectId={projectId} />}

          {activeTab === "sprints" && (
            <h1>
              List of Sprints with Metrics under this Project
              <p>-- Under Development --</p>
            </h1>
            // <SeparateComponent projectId={projectId} />
          )}
        </div>
      </main>
    </div>
  );
}

export default ActivitiesPage;
