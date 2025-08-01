// API utility functions for UniConnect frontend

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Helper function to check if user is in demo mode
const isDemoMode = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    user?.isDemo === true || !user?.token || user?.token?.startsWith("demo_")
  );
};

// Helper function to get auth token
const getAuthToken = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = user?.token;

    // Debug logging
    if (!token) {
      console.warn("🚫 No auth token found. User needs to log in.");
      console.log("📋 User data in localStorage:", user);
      // Clear any partial data and redirect
      localStorage.removeItem("user");
      window.location.href = "/";
      return null;
    }

    // Check token expiration
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (Date.now() > payload.exp * 1000) {
      console.warn("⏰ Token has expired");
      localStorage.removeItem("user");
      window.location.href = "/";
      return null;
    }

    return token;
  } catch (error) {
    console.error("🔑 Error getting auth token:", error);
    localStorage.removeItem("user");
    window.location.href = "/";
    return null;
  }
};

// Helper function to make authenticated requests
const authenticatedRequest = async (url, options = {}) => {
  // Check for demo mode first
  if (isDemoMode()) {
    throw new Error(
      "Demo mode: Cannot make API calls. Please login with real account to save changes."
    );
  }

  const token = getAuthToken();

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // Handle validation errors with detailed information
      if (response.status === 400 && errorData.errors) {
        const validationMessages = errorData.errors
          .map((err) => `${err.field}: ${err.message}`)
          .join("; ");
        throw new Error(`Validation failed: ${validationMessages}`);
      }

      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  } catch (error) {
    // Enhanced error handling for connection issues
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error(
        "Backend server is not running. Please start the backend server on http://localhost:5000"
      );
    }
    throw error;
  }
};

// User API functions
export const userAPI = {
  // Get user profile by ID
  getProfile: async (userId) => {
    return authenticatedRequest(`/users/profile/${userId}`);
  },

  // Get current user's own profile
  getMyProfile: async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?._id) {
      throw new Error("No user ID found in localStorage");
    }
    return authenticatedRequest(`/users/profile/${user._id}`);
  },

  // Update user profile
  updateProfile: async (profileData) => {
    return authenticatedRequest("/users/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  },

  // Update user preferences
  updatePreferences: async (preferences) => {
    return authenticatedRequest("/users/preferences", {
      method: "PUT",
      body: JSON.stringify(preferences),
    });
  },

  // Search users
  searchUsers: async (searchParams) => {
    const queryString = new URLSearchParams(searchParams).toString();
    return authenticatedRequest(`/users/search?${queryString}`);
  },

  // Get connection suggestions
  getSuggestions: async (limit = 10) => {
    return authenticatedRequest(`/users/suggestions?limit=${limit}`);
  },
};

// Auth API functions
export const authAPI = {
  // Login user
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Login failed");
      }

      return response.json();
    } catch (error) {
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error(
          "Backend server is not running. Please start the backend server on http://localhost:5000"
        );
      }
      throw error;
    }
  },

  // Register user
  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Registration failed");
      }

      return response.json();
    } catch (error) {
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error(
          "Backend server is not running. Please start the backend server on http://localhost:5000"
        );
      }
      throw error;
    }
  },

  // Verify token
  verifyToken: async () => {
    return authenticatedRequest("/auth/verify");
  },
};

// Connection API functions
export const connectionAPI = {
  // Send connection request
  sendRequest: async (recipientId, message = "") => {
    return authenticatedRequest("/connections/send", {
      method: "POST",
      body: JSON.stringify({ recipientId, message }),
    });
  },

  // Accept connection request
  acceptRequest: async (connectionId) => {
    return authenticatedRequest(`/connections/${connectionId}/respond`, {
      method: "PUT",
      body: JSON.stringify({ response: "accept" }),
    });
  },

  // Reject connection request
  rejectRequest: async (connectionId) => {
    return authenticatedRequest(`/connections/${connectionId}/respond`, {
      method: "PUT",
      body: JSON.stringify({ response: "reject" }),
    });
  },

  // Get connection requests
  getRequests: async (type = "both", status = "pending") => {
    const params = new URLSearchParams();
    if (type !== "both") params.append("type", type);
    if (status) params.append("status", status);

    const queryString = params.toString();
    return authenticatedRequest(
      `/connections/requests${queryString ? `?${queryString}` : ""}`
    );
  },

  // Get user connections
  getConnections: async () => {
    return authenticatedRequest("/connections");
  },

  // Remove connection
  removeConnection: async (connectionId) => {
    return authenticatedRequest(`/connections/${connectionId}`, {
      method: "DELETE",
    });
  },

  // Get connection statistics
  getStats: async () => {
    return authenticatedRequest("/connections/stats");
  },
};

// Error handling utility
export const handleAPIError = (error) => {
  console.error("API Error:", error);

  // Handle specific error cases
  if (error.message.includes("Backend server is not running")) {
    return "🚨 Backend server is not running!\n\nTo fix this:\n1. Open a new terminal\n2. Run: cd backend\n3. Run: npm start\n4. Wait for 'Server running on port 5000'\n5. Try again";
  }

  if (error.message.includes("401") || error.message.includes("Unauthorized")) {
    // Token expired or invalid, redirect to login
    localStorage.removeItem("user");
    window.location.href = "/login";
    return "Session expired. Please login again.";
  }

  if (error.message.includes("Network") || error.name === "TypeError") {
    return "Network error. Please check if the backend server is running on http://localhost:5000";
  }

  if (error.message.includes("Failed to fetch")) {
    return "Connection failed. Make sure the backend server is running.";
  }

  return error.message || "An unexpected error occurred.";
};

// Chat API functions
export const chatAPI = {
  // Get conversation with a user
  getConversation: async (userId, page = 1, limit = 50) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    return authenticatedRequest(`/chat/conversation/${userId}?${params}`);
  },

  // Send a message
  sendMessage: async (recipientId, content, messageType = "text") => {
    return authenticatedRequest("/chat/send", {
      method: "POST",
      body: JSON.stringify({ recipientId, content, messageType }),
    });
  },

  // Get chat list
  getChats: async () => {
    return authenticatedRequest("/chat/chats");
  },

  // Mark messages as read
  markAsRead: async (userId) => {
    return authenticatedRequest(`/chat/read/${userId}`, {
      method: "PUT",
    });
  },

  // Get unread message count
  getUnreadCount: async () => {
    return authenticatedRequest("/chat/unread-count");
  },
};

// Job API functions
export const jobAPI = {
  // Get all jobs with optional filters
  getJobs: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.search) queryParams.append("search", filters.search);
    if (filters.type) queryParams.append("type", filters.type);
    if (filters.location) queryParams.append("location", filters.location);
    if (filters.postedByMe) queryParams.append("postedByMe", "true");

    return authenticatedRequest(`/jobs?${queryParams}`);
  },

  // Get a single job by ID
  getJob: async (jobId) => {
    return authenticatedRequest(`/jobs/${jobId}`);
  },

  // Create a new job
  createJob: async (jobData) => {
    return authenticatedRequest("/jobs", {
      method: "POST",
      body: JSON.stringify(jobData),
    });
  },

  // Update a job
  updateJob: async (jobId, jobData) => {
    return authenticatedRequest(`/jobs/${jobId}`, {
      method: "PUT",
      body: JSON.stringify(jobData),
    });
  },

  // Delete a job
  deleteJob: async (jobId) => {
    return authenticatedRequest(`/jobs/${jobId}`, {
      method: "DELETE",
    });
  },

  // Apply for a job
  applyForJob: async (jobId, applicationData = {}) => {
    return authenticatedRequest(`/jobs/${jobId}/apply`, {
      method: "POST",
      body: JSON.stringify(applicationData),
    });
  },

  // Get applications for a job
  getJobApplications: async (jobId) => {
    return authenticatedRequest(`/jobs/${jobId}/applications`);
  },

  // Get my job applications
  getMyApplications: async () => {
    return authenticatedRequest("/jobs/applications/me");
  },

  // Update application status
  updateApplicationStatus: async (jobId, applicationId, status) => {
    return authenticatedRequest(
      `/jobs/${jobId}/applications/${applicationId}`,
      {
        method: "PUT",
        body: JSON.stringify({ status }),
      }
    );
  },
};

export default {
  userAPI,
  authAPI,
  connectionAPI,
  chatAPI,
  jobAPI,
  handleAPIError,
};
