import { useState, useEffect, useMemo } from "react";
import GeneralActivityList from "../components/activities/GeneralActivityList";
import GeneralActivitiesSearchHeader from "../components/activities/GeneralActivitiesSearchHeader";
import {
  getAllGeneralActivities,
  createGeneralActivity,
  updateGeneralActivity,
} from "../api/activities";
import { getCategories } from "../api/category";
import { mapActivityDetails } from "../components/activities/projectMapper";
import { startGeneralActivity } from "../api/entry";
import AddGenActivityModal from "../components/activities/AddGenActivityModal";
import EditGenActivityModal from "../components/activities/EditGenActivityModal";
import "../styles/activities/GeneralActivitiesPage.css";

export default function GeneralActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [error, setError] = useState("");
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);

  useEffect(() => {
    let mounted = true;

    getAllGeneralActivities()
      .then((response) => {
        if (!mounted) return;
        const flattenedData = response.map((activity) =>
          mapActivityDetails(activity),
        );
        console.log("Flattened Data:", flattenedData);
        setActivities(flattenedData);
      })
      .catch((error) => {
        console.error("Error fetching activities:", error);
      });

    getCategories()
      .then((response) => {
        if (!mounted) return;
        if (Array.isArray(response)) {
          setCategoriesList(response);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch categories list directly:", err);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Merge categories from API and activities data to ensure complete list
  const availableCategories = useMemo(() => {
    const catMap = new Map();

    categoriesList.forEach((c) => {
      if (c && c.id) {
        catMap.set(c.id, {
          id: c.id,
          name: c.name || `Category ${c.id}`,
          colourCode: c.colourCode || null,
        });
      }
    });

    activities.forEach((act) => {
      if (act.categoryId && !catMap.has(act.categoryId)) {
        catMap.set(act.categoryId, {
          id: act.categoryId,
          name: act.categoryName || `Category ${act.categoryId}`,
          colourCode: act.categoryColourCode || null,
        });
      }
    });

    return Array.from(catMap.values());
  }, [categoriesList, activities]);

  // Handle Category Multi-select Toggles
  const handleCategoryToggle = (categoryId) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const handleSelectAllCategories = () => {
    setSelectedCategoryIds(availableCategories.map((c) => c.id));
  };

  const handleClearCategoryFilter = () => {
    setSelectedCategoryIds([]);
  };

  const handleResetAllFilters = () => {
    setSearchTerm("");
    setSelectedCategoryIds([]);
  };

  // Filter activities based on title search and category multiselect
  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      const matchesTitle =
        !searchTerm.trim() ||
        act.title?.toLowerCase().includes(searchTerm.trim().toLowerCase());

      const matchesCategory =
        selectedCategoryIds.length === 0 ||
        selectedCategoryIds.includes(act.categoryId);

      return matchesTitle && matchesCategory;
    });
  }, [activities, searchTerm, selectedCategoryIds]);

  const startEntry = async (activity) => {
    console.log("Clicked Activity");
    console.log(activity);
    console.log("Activity: ", activity.activityId);
    try {
      await startGeneralActivity(activity.activityId);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const handleSave = async ({ category, title, description }) => {
    try {
      const response = await createGeneralActivity({
        categoryId: category,
        title,
        description,
      });

      const newActivity = mapActivityDetails(response.data || response);
      handleAddActivity(newActivity);
      setAddModal(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEditClick = (activity) => {
    setEditModal(true);
    setSelectedActivity(activity);
  };

  const handleEdit = async (formData) => {
    try {
      const response = await updateGeneralActivity(formData);
      const editedActivity = mapActivityDetails(response.data || response);
      handleEditActivity(editedActivity);
      setEditModal(false);
    } catch (error) {
      setError(error.message);
    }
  };

  // 1. Function to add the new item to the existing state
  const handleAddActivity = (newActivity) => {
    setActivities((prev) => [newActivity, ...prev]);
  };

  // 2. Function to update an edited item in the existing state
  const handleEditActivity = (updatedActivity) => {
    setActivities((prev) =>
      prev.map((act) =>
        act.activityId === updatedActivity.activityId ? updatedActivity : act,
      ),
    );
  };

  const isFiltered = Boolean(searchTerm.trim()) || selectedCategoryIds.length > 0;

  return (
    <div className="gen-act-page">
      {/* Error Alert */}
      {error && (
        <div className="gen-act-alert" role="alert">
          <div className="gen-act-alert__content">
            <i className="bi bi-exclamation-circle-fill" />
            <span>
              <strong>Error:</strong> {error}
            </span>
          </div>
          <button
            type="button"
            className="gen-act-alert__close"
            onClick={() => setError("")}
            aria-label="Close error message"
          >
            ×
          </button>
        </div>
      )}

      {/* Edit Activity Modal */}
      {editModal && selectedActivity && (
        <EditGenActivityModal
          onClose={() => {
            setEditModal(false);
            setSelectedActivity(null);
          }}
          key={selectedActivity.activityId}
          activity={selectedActivity}
          handleEdit={handleEdit}
        />
      )}

      {/* Add Activity Modal */}
      {addModal && (
        <AddGenActivityModal
          onClose={() => setAddModal(false)}
          handleSave={handleSave}
        />
      )}

      {/* Page Header */}
      <header className="gen-act-header">
        <div className="gen-act-header__content">
          <p className="gen-act-eyebrow">Workflow / Activities</p>
          <h1 className="gen-act-title">General Activities</h1>
          <p className="gen-act-subtitle">
            Manage routine tasks, administrative activities, and non-project entries.
          </p>
        </div>

        <div className="gen-act-header__actions">
          <span className="gen-act-stat-pill">
            Total Activities: <strong>{activities.length}</strong>
          </span>
          <button
            type="button"
            className="gen-act-btn-new"
            onClick={() => setAddModal(true)}
          >
            <i className="bi bi-plus-lg" />
            <span>New Activity</span>
          </button>
        </div>
      </header>

      {/* Search Header with Title Search and Category Multiselect */}
      <GeneralActivitiesSearchHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categories={availableCategories}
        selectedCategoryIds={selectedCategoryIds}
        onCategoryToggle={handleCategoryToggle}
        onSelectAllCategories={handleSelectAllCategories}
        onClearCategoryFilter={handleClearCategoryFilter}
        onResetAllFilters={handleResetAllFilters}
        totalCount={activities.length}
        filteredCount={filteredActivities.length}
      />

      {/* Activities Table List */}
      <GeneralActivityList
        activities={filteredActivities}
        onStartEntry={startEntry}
        onEditActivity={handleEditClick}
        onResetFilters={handleResetAllFilters}
        onNewActivity={() => setAddModal(true)}
        isFiltered={isFiltered}
      />
    </div>
  );
}
