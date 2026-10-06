import React, { useState, useEffect } from "react";
import { getSprints } from "../api/sprints";
import SprintList from "../components/SprintList";

export default function Project_SprintPage({projectId}) {

    const [sprints, setSprints] = useState([]);
    const [sprintsLoading, setSprintsLoading] = useState(false);
    const [sprintsError, setSprintsError] = useState("");

    const fetchSprints = async () => {
        setSprintsLoading(true);
        setSprintsError("");
        try {
          const response = await getSprints();

          const sprints = response.data || response.sprints || [];
          console.log("Fetched sprints:", sprints);
          console.log("Project ID from props:", projectId);

            //const filteredSprints = sprints.filter((sprint) => sprint.projectId === projectId);
            const filteredSprints = sprints.filter(
            (sprint) => String(sprint.projectId) === String(projectId)
          );
            console.log("Filtered sprints for projectId", projectId, ":", filteredSprints);
            //setSprints(response.sprints || response.data);

          setSprints(filteredSprints);
        } catch (err) {
          setSprintsError(err.message || "Failed to load sprints");
          setSprints([]);
        } finally {
          setSprintsLoading(false);
        }
    };

    useEffect(() => {
        fetchSprints();
    }, []);

  return (
    <div className="project-sprint-page">
      <h2>Project Sprints</h2>
      <SprintList 
        sprints={sprints}
        isLoading={sprintsLoading}
        error={sprintsError}
        onEdit={null}
      />
    </div>
  );
}