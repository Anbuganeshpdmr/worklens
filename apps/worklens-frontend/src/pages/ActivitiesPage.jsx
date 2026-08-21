import "../styles/activities/ActivitiesPage.css";

/**
 * ActivitiesPage — project-level activity management.
 *
 * This page is a placeholder. UI and functionality are to be
 * determined once the design is finalised.
 *
 * Route: /activities
 * API will use: GET /activity  (see src/api/activities.js → getActivities)
 */
function ActivitiesPage() {
  return (
    <div className="act-page">
      <main className="act-page__main">
        <div className="act-page__placeholder">
          <div className="act-page__placeholder-icon">
            <i className="bi bi-journal-text" />
          </div>
          <h2 className="act-page__placeholder-title">Activities</h2>
          <p className="act-page__placeholder-desc">
            Project-level activity management. UI coming soon.
          </p>
        </div>
      </main>
    </div>
  );
}

export default ActivitiesPage;
