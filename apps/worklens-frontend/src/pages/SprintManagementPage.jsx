import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import SprintActivityList from "../components/activities/SprintActivitiesList";
import { getIndividualSprintDetails } from "../api/sprints";
import { mapSprintDetails } from "../components/activities/projectMapper";
import SprintActivitiesPage from "./SprintActivitiesPage";
import SprintActivitiesExecutePage from "./SprintActivitiesExecutePage";

export default function SprintManagementPage() {
  const { sprintId } = useParams();
  const [sprint, setSprint] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("manage");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSprint = async () => {
      try {
        setError("");
        const response = await getIndividualSprintDetails(sprintId);
        const sprint = mapSprintDetails(response);
        setSprint(sprint);
      } catch (error) {
        setError(error?.message || "Failed to load sprint details.");
      }
    };

    fetchSprint();
  }, [sprintId]);

  const SprintTitle = sprint?.sprintName || "Sprint";

  return (
    <div className="act-page">
      <main className="act-page__main">
        {/* Page Header */}
        <header className="act-page__header">
          <h1 className="act-page__title">
            Sprint: {sprint?.sprintName} ({sprint?.projectName})
            <button
              onClick={() => {
                navigate(`/projects/${sprint?.projectId}/activities`);
              }}
              className="btn btn-outline-primary"
            >
              Project
            </button>
          </h1>
          <p className="act-page__subtitle">Manage Sprints And Activities.</p>
        </header>

        {error && (
          <div className="act-page__error" role="alert">
            <i className="bi bi-exclamation-circle" /> {error}
          </div>
        )}

        {/* Switchable Tabs */}
        <div
          className="act-page__tabs"
          role="tablist"
          aria-label="Sprint sections"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "manage"}
            className={`act-page__tab${activeTab === "manage" ? " act-page__tab--active" : ""}`}
            onClick={() => setActiveTab("manage")}
          >
            Manage
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "test"}
            className={`act-page__tab${activeTab === "test" ? " act-page__tab--active" : ""}`}
            onClick={() => setActiveTab("test")}
          >
            Test
          </button>
        </div>

        {/* Tab Content */}
        <div className="act-page__content">
          {activeTab === "manage" && sprint && (
            <SprintActivityList sprint={sprint} />
          )}

          {activeTab === "test" && sprint && (
            <SprintActivitiesExecutePage sprint={sprint} />
            //     <SprintActivitiesPage />
          )}
        </div>
      </main>
    </div>
  );
}
