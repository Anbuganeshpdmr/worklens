import { useState, useEffect } from "react";
import { getSelectedSprintActivities } from "../api/sprintActivities";
import { flattenSprintActivity } from "../components/sprint-activities/SprintActivityMapper";
import SprintActivityExecuteList from "./SprintActivityExecuteList";

export default function SprintActivitiesExecutionPage({ sprint }) {
  const [error, setError] = useState("");
  const [sprintActivities, setSprintActivities] = useState([]);

  const fetchSprintActivities = async () => {
    // Implementation for fetching sprint activities
    try {
      const response = await getSelectedSprintActivities(sprint.sprintId);
      const flattenedData = response.map((activity) =>
        flattenSprintActivity(activity),
      );
      console.log("Flattened Data:", flattenedData);
      setSprintActivities(flattenedData);
    } catch (error) {
      setError(error?.message || "Failed to load sprint activities.");
    }
  };

  useEffect(() => {
    fetchSprintActivities();
  }, []);

  return (
    <>
      <SprintActivityExecuteList sprintActivities={sprintActivities} />
    </>
  );
}
