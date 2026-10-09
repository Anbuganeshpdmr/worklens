import apiClient from "./axios";

export async function getProjects() {
  const response = await apiClient.get("/projects");
  return {
    projects: Array.isArray(response.data) ? response.data : [],
  };
}

export async function createProject(projectName) {
  const response = await apiClient.post("/projects", null, {
    params: { projectName },
  });
  return response.data;
}

export async function updateProject(projectId, projectData) {
  return apiClient.put(`/projects/${projectId}`, projectData);
}

export async function getStatusByRecord(recordName) {
  const response = await apiClient.get(`/status/records/${recordName}/applicable`);
  return Array.isArray(response.data) ? response.data : [];
}

export async function getIndividualProjectDetails(projectId) {
  const response = await apiClient.get(`/projects/${projectId}`);
  return response.data;
}

export async function getActiveProjects() {
  const response = await apiClient.get("/projects/active");
  return response.data;
}

export async function getActiveSprints() {
  const response = await apiClient.get("/sprints/active");
  return response.data;
}