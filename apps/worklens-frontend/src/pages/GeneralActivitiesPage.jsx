import { useState, useEffect } from "react";
import GeneralActivityList from "../components/activities/GeneralActivityList";
import {
  getAllGeneralActivities,
  createGeneralActivity,
  updateGeneralActivity,
} from "../api/activities";
import { mapActivityDetails } from "../components/activities/projectMapper";
import { startGeneralActivity } from "../api/entry";
import AddGenActivityModal from "../components/activities/AddGenActivityModal";
import EditGenActivityModal from "../components/activities/EditGenActivityModal";

export default function GeneralActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [error, setError] = useState("");
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const fetchActivities = async () => {
    try {
      const response = await getAllGeneralActivities();
      const flattenedData = response.map((activity) =>
        mapActivityDetails(activity),
      );
      console.log("Flattened Data:", flattenedData);
      setActivities(flattenedData);
    } catch (error) {
      console.error("Error fetching activities:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

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

  return (
    <>
      {error && (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          <strong>Error:</strong> {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError(null)}
            aria-label="Close"
          ></button>
        </div>
      )}
      {editModal && (
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
      {addModal && (
        <AddGenActivityModal
          onClose={() => setAddModal(false)}
          handleSave={handleSave}
        />
      )}
      <div>
        <h1>General Activities</h1>
      </div>
      <div>
        <button onClick={() => setAddModal(true)}>New</button>
      </div>
      <GeneralActivityList
        activities={activities}
        onStartEntry={startEntry}
        onEditActivity={handleEditClick}
      />
    </>
  );
}
