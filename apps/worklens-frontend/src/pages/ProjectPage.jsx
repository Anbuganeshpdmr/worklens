import { useState, useEffect } from "react";
//import Sidebar from "../components/Sidebar";
//import Navbar from "../components/Navbar";
import ProjectList from "../components/ProjectList";
import SprintList from "../components/SprintList";
import AddProjectModal from "../modals/AddProjectModal";
import AddSprintModal from "../modals/AddSprintModal";
import EditProjectModal from "../modals/EditProjectModal";
import EditSprintModal from "../modals/EditSprintModal";
import { getProjects, createProject, updateProject } from "../api/projects";
import { getSprints, createSprint, updateSprint } from "../api/sprints";
import "../styles/ProjectPage.css";

const TABS = {
  PROJECT: "project",
  SPRINT: "sprint",
};

function ProjectPage() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const role = userInfo?.role;

  // Tab state
  const [activeTab, setActiveTab] = useState(TABS.PROJECT);

  // Project state
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState("");
  const [projectsModalOpen, setProjectsModalOpen] = useState(false);
  const [projectsModalLoading, setProjectsModalLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [editProject, setEditProject] = useState(null);
  const [editProjectModalOpen, setEditProjectModalOpen] = useState(false);

  // Sprint state
  const [sprints, setSprints] = useState([]);
  const [sprintsLoading, setSprintsLoading] = useState(false);
  const [sprintsError, setSprintsError] = useState("");
  const [sprintsModalOpen, setSprintsModalOpen] = useState(false);
  const [sprintsModalLoading, setSprintsModalLoading] = useState(false);

  const [editSprint, setEditSprint] = useState(null);
  const [editSprintModalOpen, setEditSprintModalOpen] = useState(false);

  // Fetch projects
  const fetchProjects = async () => {
    setProjectsLoading(true);
    setProjectsError("");
    try {
      const data = await getProjects();
      setProjects(data.projects || data.data || []);
    } catch (err) {
      setProjectsError(err.message || "Failed to load projects");
      setProjects([]);
    } finally {
      setProjectsLoading(false);
    }
  };

  // Fetch sprints
  const fetchSprints = async () => {
    setSprintsLoading(true);
    setSprintsError("");
    try {
      const data = await getSprints();
      setSprints(data.sprints || data.data || []);
    } catch (err) {
      setSprintsError(err.message || "Failed to load sprints");
      setSprints([]);
    } finally {
      setSprintsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (activeTab === TABS.PROJECT) {
      fetchProjects();
    } else {
      fetchSprints();
    }
  }, [activeTab]);

  // Handle add project
  const handleAddProject = async (projectName) => {
    console.log("CREATE PROJECT CALLED:", projectName);

    setProjectsModalLoading(true);

    try {
      await createProject(projectName);
      console.log("CREATE PROJECT SUCCESS");

      setProjectsModalOpen(false);
      await fetchProjects();
      setSuccessMessage("Project successfully added!");

      setTimeout(() => {
        setSuccessMessage("");
      }, 2000);
    } catch (err) {
      console.error("CREATE PROJECT ERROR:", err);
      throw err;
    } finally {
      setProjectsModalLoading(false);
    }
  };

  // Handle add sprint
  const handleAddSprint = async (projectId, sprintName) => {
    setSprintsModalLoading(true);
    try {
      await createSprint(projectId, sprintName);
      //setSprintsModalOpen(false);
      // Refresh sprints list
      await fetchSprints();
      setSuccessMessage("Sprint successfully added!");

      setTimeout(() => {
        setSuccessMessage("");
      }, 2000);
    } catch (err) {
      throw err;
    } finally {
      setSprintsModalLoading(false);
    }
  };

  // Handle edit project
  const handleEditProject = async (data) => {
    setProjectsModalLoading(true);

    try {
      console.log("EDIT PROJECT DATA:", data);

      await updateProject(data.projectId, {
        //projectId: data.projectId,
        projectName: data.projectName,
        selectedRecordStatusId: data.selectedRecordStatusId,
      });

      setEditProjectModalOpen(false);
      setEditProject(null);

      await fetchProjects();

      setSuccessMessage("Project successfully updated!");

      setTimeout(() => {
        setSuccessMessage("");
      }, 2000);
    } catch (err) {
      console.error("UPDATE PROJECT ERROR:", err);
      throw err;
    } finally {
      setProjectsModalLoading(false);
    }
  };

  // Handle edit sprint
  const handleEditSprint = async (data) => {
    setSprintsModalLoading(true);

    try {
      console.log("EDIT SPRINT DATA:", data);

      await updateSprint(data.sprintId, {
        sprintName: data.sprintName,
        selectedRecordStatusId: data.selectedRecordStatusId,
      });

      setEditSprintModalOpen(false);
      setEditSprint(null);

      await fetchSprints();

      setSuccessMessage("Sprint successfully updated!");

      setTimeout(() => {
        setSuccessMessage("");
      }, 2000);
    } catch (err) {
      console.error("UPDATE SPRINT ERROR:", err);
      throw err;
    } finally {
      setSprintsModalLoading(false);
    }
  };

  // Determine which content to show
  const showProjects = activeTab === TABS.PROJECT;
  const showSprints = activeTab === TABS.SPRINT;

  return (
    <>
      {/* <Navbar /> */}
      <div className="project-page">
        {/* <Sidebar role={role} /> */}

        <main className="project-content">
          {successMessage && (
            <div className="modal-success-message">
              <span className="modal-success-icon">✓</span>
              {successMessage}
            </div>
          )}
          {/* Tab Navigation */}
          <div className="project-page__tabs">
            <button
              className={`project-page__tab ${
                showProjects ? "project-page__tab--active" : ""
              }`}
              onClick={() => setActiveTab(TABS.PROJECT)}
            >
              Project
            </button>
            <button
              className={`project-page__tab ${
                showSprints ? "project-page__tab--active" : ""
              }`}
              onClick={() => setActiveTab(TABS.SPRINT)}
            >
              Sprint
            </button>
          </div>

          {/* Project Tab Content */}
          {showProjects && (
            <>
              <header className="project-page__header">
                <div className="project-page__heading">
                  <h1 className="project-page__title">Projects</h1>
                  <p className="project-page__subtitle">
                    View and manage all projects and their modules.
                  </p>
                </div>

                <div className="project-page__actions">
                  <button
                    type="button"
                    className="project-page__action project-page__action--primary"
                    onClick={() => {
                      console.log("ADD PROJECT BUTTON CLICKED");
                      setProjectsModalOpen(true);
                    }}
                  >
                    <span className="project-page__action-icon">+</span>
                    <span>Add Project</span>
                  </button>
                </div>
              </header>

              {projectsError && (
                <div className="project-page__error">{projectsError}</div>
              )}

              <ProjectList
                projects={projects}
                isLoading={projectsLoading}
                currentPage={1}
                totalPages={1}
                onPageChange={() => {}}
                onEdit={(project) => {
                  setEditProject(project);
                  setEditProjectModalOpen(true);
                }}
              />
            </>
          )}

          {/* Sprint Tab Content */}
          {showSprints && (
            <>
              <header className="project-page__header">
                <div className="project-page__heading">
                  <h1 className="project-page__title">Sprints</h1>
                  <p className="project-page__subtitle">
                    View and manage all sprints across your projects.
                  </p>
                </div>

                <div className="project-page__actions">
                  <button
                    type="button"
                    className="project-page__action project-page__action--primary"
                    onClick={() => setSprintsModalOpen(true)}
                  >
                    <span className="project-page__action-icon">+</span>
                    <span>Add Sprint</span>
                  </button>
                </div>
              </header>

              {sprintsError && (
                <div className="project-page__error">{sprintsError}</div>
              )}

              <SprintList
                sprints={sprints}
                isLoading={sprintsLoading}
                currentPage={1}
                totalPages={1}
                onPageChange={() => {}}
                onEdit={(sprint) => {
                  setEditSprint(sprint);
                  setEditSprintModalOpen(true);
                }}
              />
            </>
          )}
        </main>

        {/* Add Project Modal */}
        <AddProjectModal
          isOpen={projectsModalOpen}
          onClose={() => setProjectsModalOpen(false)}
          onSave={handleAddProject}
          isLoading={projectsModalLoading}
        />

        {/* Add Sprint Modal */}
        <AddSprintModal
          isOpen={sprintsModalOpen}
          onClose={() => setSprintsModalOpen(false)}
          onSave={handleAddSprint}
          projects={projects}
          isLoading={sprintsModalLoading}
        />

        {/* Edit Project Modal */}
        <EditProjectModal
          isOpen={editProjectModalOpen}
          project={editProject}
          onClose={() => {
            setEditProjectModalOpen(false);
            setEditProject(null);
          }}
          onSave={handleEditProject}
          isLoading={projectsModalLoading}
        />

        {/* Edit Sprint Modal */}
        <EditSprintModal
          isOpen={editSprintModalOpen}
          sprint={editSprint}
          onClose={() => {
            setEditSprintModalOpen(false);
            setEditSprint(null);
          }}
          onSave={handleEditSprint}
          isLoading={sprintsModalLoading}
        />
      </div>
    </>
  );
}

export default ProjectPage;
