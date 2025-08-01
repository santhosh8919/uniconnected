import { useState, useEffect } from "react";
import { jobAPI } from "../utils/api";

const useJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    location: "",
    postedByMe: false,
  });

  // Fetch jobs whenever filters change
  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobAPI.getJobs(filters);
      setJobs(response.jobs);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createJob = async (jobData) => {
    try {
      setError(null);
      await jobAPI.createJob(jobData);
      await fetchJobs();
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    }
  };

  const updateJob = async (jobId, jobData) => {
    try {
      setError(null);
      await jobAPI.updateJob(jobId, jobData);
      await fetchJobs();
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    }
  };

  const deleteJob = async (jobId) => {
    try {
      setError(null);
      await jobAPI.deleteJob(jobId);
      await fetchJobs();
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    }
  };

  const applyForJob = async (jobId, applicationData) => {
    try {
      setError(null);
      await jobAPI.applyForJob(jobId, applicationData);
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    }
  };

  const getJobApplications = async (jobId) => {
    try {
      setError(null);
      const response = await jobAPI.getJobApplications(jobId);
      return response.applications;
    } catch (error) {
      setError(error.message);
      return [];
    }
  };

  const getMyApplications = async () => {
    try {
      setError(null);
      const response = await jobAPI.getMyApplications();
      return response.applications;
    } catch (error) {
      setError(error.message);
      return [];
    }
  };

  const updateApplicationStatus = async (jobId, applicationId, status) => {
    try {
      setError(null);
      await jobAPI.updateApplicationStatus(jobId, applicationId, status);
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    }
  };

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return {
    jobs,
    loading,
    error,
    filters,
    setFilters: updateFilters,
    createJob,
    updateJob,
    deleteJob,
    applyForJob,
    getJobApplications,
    getMyApplications,
    updateApplicationStatus,
  };
};

export default useJobs;
