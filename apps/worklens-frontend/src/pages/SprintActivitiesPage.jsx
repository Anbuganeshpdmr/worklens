import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ActivityMetrics from "../components/sprint-activities/ActivityMetrics";
import ActivityFilterBar from "../components/sprint-activities/ActivityFilterBar";
import ActivitiesTable from "../components/sprint-activities/ActivitiesTable";
import EditorPanel from "../components/sprint-activities/EditorPanel";
import AddActivityModal from "../components/sprint-activities/AddActivityModal";
import { getSprintActivities } from "../api/activities";
import "../styles/sprint-activities/SprintActivitiesPage.css";

function SprintActivitiesPage() {
  const { sprintId } = useParams();
  const navigate = useNavigate();

  /* ── Raw data from API ─────────────────────────────────────── */
  const [allActivities, setAllActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  /* ── Filters ───────────────────────────────────────────────── */
  const [activeTab, setActiveTab] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  /* ── Sorting ───────────────────────────────────────────────── */
  const [sortField, setSortField] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");

  /* ── Inspector Drawer & Add Modal ──────────────────────────── */
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalParentId, setAddModalParentId] = useState(null);

  /* ── Fetch activities on mount or sprintId change ─────────── */
  const fetchActivities = useCallback(async () => {
    if (!sprintId) return;
    setLoading(true);
    setFetchError("");
    try {
      const data = await getSprintActivities(sprintId);
      const items = Array.isArray(data) ? data : (data?.content ?? []);
      console.log("Fetched sprint activities-1:", items);
      setAllActivities(items);
    } catch (err) {
      setFetchError(err.message || "Failed to load sprint activities.");
    } finally {
      setLoading(false);
    }
  }, [sprintId]);

  useEffect(() => {
    let mounted = true;
    if (!sprintId) {
      return;
    }

    async function loadData() {
      try {
        const data = await getSprintActivities(sprintId);
        console.log("Fetched sprint activities-2:", data);
        if (mounted) {
          const items = Array.isArray(data) ? data : (data?.content ?? []);
          setAllActivities(items);
          setFetchError("");
        }
      } catch (err) {
        if (mounted) {
          setFetchError(err.message || "Failed to load sprint activities.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, [sprintId]);

  /* ── Filter Tab Counts ─────────────────────────────────────── */
  const tabCounts = useMemo(() => {
    let notOnce = 0;
    let atleastOnce = 0;
    let needAgain = 0;

    for (const act of allActivities) {
      const statusName = String(
        act?.currentStatus?.statusName ??
          act?.simpleActivityInfo?.currentStatus?.statusName ??
          "",
      ).toLowerCase();

      if (statusName.includes("not executed") || !statusName) {
        notOnce++;
      } else if (
        statusName.includes("atleast") ||
        statusName.includes("passed")
      ) {
        atleastOnce++;
      } else if (statusName.includes("need")) {
        needAgain++;
      }
    }

    return {
      all: allActivities.length,
      "not-once": notOnce,
      "atleast-once": atleastOnce,
      "need-again": needAgain,
    };
  }, [allActivities]);

  /* ── Filter & Search ───────────────────────────────────────── */
  const filtered = useMemo(() => {
    return allActivities.filter((act) => {
      const info = act.simpleActivityInfo ?? {};
      const title = String(info.title ?? "").toLowerCase();
      const actId = String(
        info.activityId ?? act.sprintActivityId ?? "",
      ).toLowerCase();
      const typeName = String(info.activityType?.name ?? "").toLowerCase();
      const statusName = String(
        act.currentStatus?.statusName ?? info.currentStatus?.statusName ?? "",
      ).toLowerCase();

      // Search match
      if (searchText) {
        const query = searchText.toLowerCase();
        if (!title.includes(query) && !actId.includes(query)) return false;
      }

      // Type match
      if (typeFilter && typeName !== typeFilter.toLowerCase()) {
        return false;
      }

      // Status dropdown match
      if (statusFilter && statusName !== statusFilter.toLowerCase()) {
        return false;
      }

      // Status tab match
      if (activeTab === "not-once") {
        return statusName.includes("not executed") || !statusName;
      }
      if (activeTab === "atleast-once") {
        return statusName.includes("atleast") || statusName.includes("passed");
      }
      if (activeTab === "need-again") {
        return statusName.includes("need");
      }

      return true;
    });
  }, [allActivities, searchText, typeFilter, statusFilter, activeTab]);

  /* ── Sorting (All filtered activities available on page) ──── */
  const sorted = useMemo(() => {
    const list = [...filtered];
    return list.sort((a, b) => {
      const infoA = a.simpleActivityInfo ?? {};
      const infoB = b.simpleActivityInfo ?? {};

      let valA = "";
      let valB = "";

      if (sortField === "title") {
        valA = String(infoA.title ?? "").toLowerCase();
        valB = String(infoB.title ?? "").toLowerCase();
      } else if (sortField === "type") {
        valA = String(infoA.activityType?.name ?? "").toLowerCase();
        valB = String(infoB.activityType?.name ?? "").toLowerCase();
      } else if (sortField === "status") {
        valA = String(
          a.currentStatus?.statusName ?? infoA.currentStatus?.statusName ?? "",
        ).toLowerCase();
        valB = String(
          b.currentStatus?.statusName ?? infoB.currentStatus?.statusName ?? "",
        ).toLowerCase();
      } else if (sortField === "date") {
        valA = String(infoA.updatedOn || infoA.createdOn || "");
        valB = String(infoB.updatedOn || infoB.createdOn || "");
      }

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sortField, sortDirection]);

  /* ── Parent activities for modal dropdown ─────────────────── */
  const parentActivities = useMemo(() => {
    return allActivities.filter(
      (a) =>
        String(a.simpleActivityInfo?.activityType?.name ?? "").toLowerCase() ===
        "parent",
    );
  }, [allActivities]);

  /* ── Filter Handlers ───────────────────────────────────────── */
  function handleClearFilters() {
    setSearchText("");
    setTypeFilter("");
    setStatusFilter("");
    setActiveTab("all");
  }

  function handleSort(field) {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }

  /* ── Modal & Editor Handlers ───────────────────────────────── */
  function handleOpenAddActivity() {
    setAddModalParentId(null);
    setIsAddModalOpen(true);
  }

  function handleOpenAddScenario(parentId) {
    setAddModalParentId(parentId);
    setIsAddModalOpen(true);
  }

  function handleAddActivity(newActivity) {
    setAllActivities((prev) => [newActivity, ...prev]);
    setSelectedActivity(newActivity);
    setEditorOpen(true);
  }

  function handleSelectActivity(activity) {
    setSelectedActivity(activity);
    setEditorOpen(true);
  }

  function handleEditorUpdated(updated) {
    const updId = updated._id ?? updated.sprintActivityId;
    setAllActivities((prev) =>
      prev.map((a) =>
        a.sprintActivityId === updId
          ? {
              ...a,
              ...updated,
              simpleActivityInfo: {
                ...a.simpleActivityInfo,
                title:
                  updated.title ??
                  updated._title ??
                  a.simpleActivityInfo?.title,
                description:
                  updated.description ??
                  updated._description ??
                  a.simpleActivityInfo?.description,
                updatedOn: new Date().toISOString(),
              },
            }
          : a,
      ),
    );
    setSelectedActivity(updated);
  }

  function handleEditorClose() {
    setEditorOpen(false);
    setSelectedActivity(null);
  }

  const selectedId =
    selectedActivity?._id ?? selectedActivity?.sprintActivityId ?? null;

  return (
    <div className="sa-page">
      <div className="sa-page__body">
        <main className="sa-page__main">
          {/* Breadcrumb Navigation */}
          <nav className="sa-page__breadcrumb" aria-label="Breadcrumb">
            <button
              type="button"
              className="sa-page__bc-link"
              onClick={() => navigate("/home")}
            >
              Home
            </button>
            <span className="sa-page__bc-sep">›</span>
            <span
              className="sa-page__bc-link"
              onClick={() => navigate("/sprints")}
            >
              Sprints
            </span>
            <span className="sa-page__bc-sep">›</span>
            <span className="sa-page__bc-link">Sprint {sprintId}</span>
            <span className="sa-page__bc-sep">›</span>
            <span className="sa-page__bc-current">Activities</span>
          </nav>

          {/* Page Header */}
          <header className="sa-page__header">
            <div className="sa-page__header-left">
              <div className="sa-page__title-badge-wrap">
                <h1 className="sa-page__title">Sprint {sprintId} Activities</h1>
                <span className="sa-page__sprint-pill">Active Sprint</span>
              </div>
              <p className="sa-page__subtitle">
                Manage, execute, and monitor test scenarios and parent
                activities for this sprint.
              </p>
            </div>

            <div className="sa-page__header-right">
              {/* Add Activity Button */}
              <button
                type="button"
                className="sa-page__add-btn"
                onClick={handleOpenAddActivity}
              >
                <i className="bi bi-plus-lg" /> Add Activity
              </button>

              {/* Refresh Button */}
              <button
                type="button"
                className={`sa-page__icon-btn${loading ? " sa-page__icon-btn--spinning" : ""}`}
                title="Refresh activities list"
                onClick={fetchActivities}
                disabled={loading}
                aria-label="Refresh"
              >
                <i className="bi bi-arrow-clockwise" />
              </button>

              {/* Toggle Inspector Button */}
              <button
                type="button"
                className={`sa-page__editor-btn${editorOpen ? " sa-page__editor-btn--active" : ""}`}
                onClick={() =>
                  editorOpen ? handleEditorClose() : setEditorOpen(true)
                }
              >
                <i className="bi bi-layout-sidebar-inset-reverse" />
                <span>Inspector</span>
              </button>
            </div>
          </header>

          {/* Metrics Summary Bar */}
          <ActivityMetrics activities={allActivities} />

          {/* Filter & Search Bar */}
          <ActivityFilterBar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            searchText={searchText}
            onSearchChange={setSearchText}
            typeFilter={typeFilter}
            onTypeChange={setTypeFilter}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            onClearFilters={handleClearFilters}
            total={allActivities.length}
            totalFiltered={sorted.length}
            tabCounts={tabCounts}
          />

          {/* Table (Rendering all activities without pagination) */}
          <ActivitiesTable
            activities={sorted}
            loading={loading}
            error={fetchError}
            selectedId={selectedId}
            onSelectActivity={handleSelectActivity}
            editorOpen={editorOpen}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            onAddScenario={handleOpenAddScenario}
            onClearFilters={handleClearFilters}
            onAddActivity={handleOpenAddActivity}
            onRetry={fetchActivities}
          />
        </main>

        {/* Inspector Drawer */}
        {editorOpen && (
          <EditorPanel
            activity={selectedActivity}
            onClose={handleEditorClose}
            onUpdated={handleEditorUpdated}
          />
        )}
      </div>

      {/* Add Activity / Scenario Modal Dialog */}
      <AddActivityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddActivity}
        parentActivities={parentActivities}
        initialParentId={addModalParentId}
      />
    </div>
  );
}

export default SprintActivitiesPage;
