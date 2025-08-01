import api from "./api";

export const jobsApi = {
  // Get all jobs with optional filters
  getJobs: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.append("search", filters.search);
      if (filters.type) queryParams.append("type", filters.type);
      if (filters.location) queryParams.append("location", filters.location);

      const response = await api.get(`/jobs?${queryParams}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch jobs");
    }
  },

  // Get a single job by ID
  getJob: async (jobId) => {
    try {
      const response = await api.get(`/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch job details"
      );
    }
  },

  // Create a new job (for alumni)
  createJob: async (jobData) => {
    try {
      const response = await api.post("/jobs", jobData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to create job");
    }
  },

  // Update a job (for alumni who posted it)
  updateJob: async (jobId, jobData) => {
    try {
      const response = await api.put(`/jobs/${jobId}`, jobData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update job");
    }
  },

  // Delete a job (for alumni who posted it)
  deleteJob: async (jobId) => {
    try {
      const response = await api.delete(`/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to delete job");
    }
  },

  // Apply for a job (for students)
  applyForJob: async (jobId) => {
    try {
      const response = await api.post(`/jobs/${jobId}/apply`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to apply for job"
      );
    }
  },

  // Get applications for a job (for alumni who posted it)
  getJobApplications: async (jobId) => {
    try {
      const response = await api.get(`/jobs/${jobId}/applications`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch job applications"
      );
    }
  },

  // Update application status (for alumni who posted the job)
  updateApplicationStatus: async (jobId, applicationId, status) => {
    try {
      const response = await api.put(
        `/jobs/${jobId}/applications/${applicationId}`,
        { status }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update application status"
      );
    }
  },
};

export default jobsApi;
