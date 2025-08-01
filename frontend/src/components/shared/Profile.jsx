import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { userAPI, handleAPIError } from "../../utils/api";

const Profile = ({ userType }) => {
  const { isDarkMode } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    college: "",
    branch: "",
    year: "",
    fullName: "",
    role: "",
    _id: "",
  });

  const [profileData, setProfileData] = useState({
    bio: "",
    skills: [],
    socialLinks: {
      linkedin: "",
      github: "",
      twitter: "",
    },
    // Alumni specific fields
    companyName: "",
    jobRole: "",
    isWorking: false,
    profilePicture: "",
    achievements: "",
    preferences: {
      emailNotifications: true,
      profileVisibility: "public",
    },
  });

  useEffect(() => {
    fetchUserProfile();
  }, [userType]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if user is logged in
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        throw new Error(
          "No user data found. Please log in to view your profile."
        );
      }

      if (!user.token) {
        // User data exists but no token - try to work with local data
        console.warn(
          "No authentication token found. Working with local data only."
        );
        setLoginData({
          email: user.email || "",
          college: user.college || "",
          branch: user.branch || "",
          year: user.year || "",
          fullName: user.fullName || "",
          role: user.role || "",
          _id: user._id || "",
        });

        // Set some default profile data for demo mode
        setProfileData({
          bio: "This is demo mode. To save changes, please login with real authentication.",
          skills: ["JavaScript", "React", "Node.js"],
          socialLinks: {
            linkedin: "",
            github: "",
            twitter: "",
          },
          companyName: user.companyName || "",
          jobRole: user.jobRole || "",
          isWorking: user.isWorking || false,
          profilePicture: "",
          achievements: "",
          preferences: {
            emailNotifications: true,
            profileVisibility: "public",
          },
        });

        setLoading(false);
        setError(
          "Demo mode: Profile changes won't be saved. Please create/login with real account to save changes."
        );
        return;
      }

      // Get user data from API
      const response = await userAPI.getMyProfile();
      const userData = response.user; // Set login data (non-editable)
      setLoginData({
        email: userData.email || "",
        college: userData.college || "",
        branch: userData.branch || "",
        year: userData.year || "",
        fullName: userData.fullName || "",
        role: userData.role || "",
        _id: userData._id || "",
      });

      // Set profile data (editable)
      setProfileData({
        bio: userData.bio || "",
        skills: userData.skills || [],
        socialLinks: {
          linkedin: userData.socialLinks?.linkedin || "",
          github: userData.socialLinks?.github || "",
          twitter: userData.socialLinks?.twitter || "",
        },
        companyName: userData.companyName || "",
        jobRole: userData.jobRole || "",
        isWorking: userData.isWorking || false,
        profilePicture: userData.profilePicture || "",
        achievements: userData.achievements || "",
        preferences: {
          emailNotifications: userData.preferences?.emailNotifications ?? true,
          profileVisibility:
            userData.preferences?.profileVisibility || "public",
        },
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError(handleAPIError(error));

      // Fallback to localStorage if API fails
      const localUser = JSON.parse(localStorage.getItem("user"));
      if (localUser) {
        setLoginData({
          email: localUser.email || "",
          college: localUser.college || "",
          branch: localUser.branch || "",
          year: localUser.year || "",
          fullName: localUser.fullName || "",
          role: localUser.role || "",
          _id: localUser._id || "",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      setSaveLoading(true);
      setError(null);

      // Check if user is logged in
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        throw new Error(
          "No user data found. Please log in to save your profile."
        );
      }

      if (!user.token) {
        throw new Error(
          "Authentication required. Please log in again to save changes."
        );
      }

      // Prepare data for API (exclude non-editable fields)
      // Filter out empty social links and validate URLs to avoid validation errors
      const filteredSocialLinks = {};
      Object.entries(profileData.socialLinks).forEach(([key, value]) => {
        if (value && value.trim() !== "") {
          const trimmedValue = value.trim();
          // Basic URL validation - ensure it starts with http:// or https://
          if (
            trimmedValue.startsWith("http://") ||
            trimmedValue.startsWith("https://")
          ) {
            filteredSocialLinks[key] = trimmedValue;
          } else {
            // Add https:// if missing
            filteredSocialLinks[key] = `https://${trimmedValue}`;
          }
        }
      });

      const updateData = {
        bio: profileData.bio,
        skills: profileData.skills,
        socialLinks: filteredSocialLinks,
      };

      // Add alumni-specific fields if user is alumni
      if (userType === "alumni" || loginData.role === "alumni") {
        updateData.companyName = profileData.companyName;
        updateData.jobRole = profileData.jobRole;
        updateData.isWorking = profileData.isWorking;
      }

      // Call API to update profile
      console.log("Sending profile update:", updateData);
      console.log("User token:", user.token?.substring(0, 20) + "...");

      const response = await userAPI.updateProfile(updateData);
      console.log("Profile update response:", response);

      // Update preferences separately if they changed
      console.log("Updating preferences:", profileData.preferences);
      await userAPI.updatePreferences(profileData.preferences);

      // Update localStorage with new data
      const updatedUser = { ...user, ...response.user };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      console.log("Profile updated successfully:", response);
      setIsEditing(false);

      // Show success message
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      const errorMessage = handleAPIError(error);

      // Check if this is a demo mode error
      if (error.message && error.message.includes("Demo mode")) {
        setError(
          "You're viewing demo data. Please log in with a real account to save changes."
        );
        alert(
          "Demo Mode: Please log in with a real account to save profile changes."
        );
      } else {
        setError(errorMessage);
        alert(`Error saving profile: ${errorMessage}`);
      }
    } finally {
      setSaveLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSkillAdd = (skill) => {
    if (skill && !profileData.skills.includes(skill)) {
      setProfileData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setProfileData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } rounded-lg shadow-md p-6`}>
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div
            className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
              isDarkMode ? "border-blue-400" : "border-blue-600"
            }`}></div>
          <span
            className={`ml-3 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}>
            Loading profile...
          </span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            isDarkMode
              ? "bg-red-900 border-red-700 text-red-300"
              : "bg-red-100 border-red-400 text-red-700"
          } border`}>
          <div className="flex">
            <span className="mr-2">⚠️</span>
            <div>
              <p className="font-medium">Error loading profile</p>
              <p className="text-sm mt-1">{error}</p>
              <button
                onClick={fetchUserProfile}
                className={`mt-2 text-sm underline ${
                  isDarkMode
                    ? "text-red-300 hover:text-red-200"
                    : "text-red-700 hover:text-red-800"
                }`}>
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Demo Mode Indicator */}
      {loginData._id && loginData._id.includes("demo") && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            isDarkMode
              ? "bg-blue-900 border-blue-700 text-blue-300"
              : "bg-blue-100 border-blue-400 text-blue-700"
          } border`}>
          <div className="flex items-center">
            <span className="mr-2">ℹ️</span>
            <div>
              <p className="font-medium">Demo Mode</p>
              <p className="text-sm mt-1">
                You're viewing demo data. Please log in with a real account to
                save changes.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Profile Content */}
      {!loading && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2
              className={`text-2xl font-bold ${
                isDarkMode ? "text-gray-100" : "text-gray-800"
              }`}>
              Profile
            </h2>
            <button
              onClick={isEditing ? handleSave : handleEdit}
              disabled={saveLoading}
              className={`px-4 py-2 rounded-lg flex items-center ${
                isEditing
                  ? saveLoading
                    ? "bg-gray-500 cursor-not-allowed text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}>
              {saveLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : isEditing ? (
                "Save"
              ) : (
                "Edit"
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Picture */}
            <div className="md:col-span-2 flex justify-center">
              <div className="relative">
                <div
                  className={`w-32 h-32 ${
                    isDarkMode ? "bg-gray-600" : "bg-gray-300"
                  } rounded-full flex items-center justify-center`}>
                  <span
                    className={`text-4xl ${
                      isDarkMode ? "text-gray-200" : "text-gray-600"
                    }`}>
                    {loginData.fullName.charAt(0) || "U"}
                  </span>
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700">
                    📷
                  </button>
                )}
              </div>
            </div>

            {/* Login Information (Read-Only) */}
            <div className="md:col-span-2">
              <h3
                className={`text-lg font-semibold ${
                  isDarkMode ? "text-gray-200" : "text-gray-800"
                } mb-4 flex items-center`}>
                <span className="mr-2">🔐</span>
                Account Information (From Registration)
              </h3>
              <div
                className={`${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-gray-50 border-gray-200"
                } border rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4`}>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    } mb-1`}>
                    Full Name
                  </label>
                  <p
                    className={`${
                      isDarkMode ? "text-gray-200" : "text-gray-900"
                    } font-medium`}>
                    {loginData.fullName || "Not provided"}
                  </p>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    } mb-1`}>
                    Email Address
                  </label>
                  <p
                    className={`${
                      isDarkMode ? "text-gray-200" : "text-gray-900"
                    } font-medium`}>
                    {loginData.email || "Not provided"}
                  </p>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    } mb-1`}>
                    College
                  </label>
                  <p
                    className={`${
                      isDarkMode ? "text-gray-200" : "text-gray-900"
                    } font-medium`}>
                    {loginData.college || "Not provided"}
                  </p>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    } mb-1`}>
                    Branch
                  </label>
                  <p
                    className={`${
                      isDarkMode ? "text-gray-200" : "text-gray-900"
                    } font-medium`}>
                    {loginData.branch || "Not provided"}
                  </p>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    } mb-1`}>
                    Year/Status
                  </label>
                  <p
                    className={`${
                      isDarkMode ? "text-gray-200" : "text-gray-900"
                    } font-medium`}>
                    {loginData.year || "Not provided"}
                  </p>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    } mb-1`}>
                    User Role
                  </label>
                  <p
                    className={`${
                      isDarkMode ? "text-gray-200" : "text-gray-900"
                    } font-medium capitalize`}>
                    {loginData.role || "Not provided"}
                  </p>
                </div>

                <div className="flex items-center">
                  <span className="text-sm text-blue-500">ℹ️</span>
                  <span
                    className={`text-xs ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    } ml-2`}>
                    Contact support to update this information
                  </span>
                </div>
              </div>
            </div>

            {/* Preferences Section */}
            <div className="md:col-span-2">
              <h3
                className={`text-lg font-semibold ${
                  isDarkMode ? "text-gray-200" : "text-gray-800"
                } mb-4 flex items-center`}>
                <span className="mr-2">⚙️</span>
                Privacy & Preferences
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    } mb-1`}>
                    Profile Visibility
                  </label>
                  {isEditing ? (
                    <select
                      value={profileData.preferences.profileVisibility}
                      onChange={(e) =>
                        handleInputChange("preferences", {
                          ...profileData.preferences,
                          profileVisibility: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 border ${
                        isDarkMode
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}>
                      <option value="public">Public</option>
                      <option value="connections">Connections Only</option>
                      <option value="private">Private</option>
                    </select>
                  ) : (
                    <p
                      className={`${
                        isDarkMode ? "text-gray-200" : "text-gray-900"
                      } capitalize`}>
                      {profileData.preferences.profileVisibility}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    } mb-1`}>
                    Email Notifications
                  </label>
                  {isEditing ? (
                    <select
                      value={profileData.preferences.emailNotifications}
                      onChange={(e) =>
                        handleInputChange("preferences", {
                          ...profileData.preferences,
                          emailNotifications: e.target.value === "true",
                        })
                      }
                      className={`w-full px-3 py-2 border ${
                        isDarkMode
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}>
                      <option value="true">Enabled</option>
                      <option value="false">Disabled</option>
                    </select>
                  ) : (
                    <p
                      className={`${
                        isDarkMode ? "text-gray-200" : "text-gray-900"
                      }`}>
                      {profileData.preferences.emailNotifications
                        ? "Enabled"
                        : "Disabled"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Editable Profile Information */}
            <div className="md:col-span-2">
              <h3
                className={`text-lg font-semibold ${
                  isDarkMode ? "text-gray-200" : "text-gray-800"
                } mb-4 flex items-center`}>
                <span className="mr-2">✏️</span>
                Profile Details (Editable)
              </h3>
            </div>

            {/* Alumni specific fields */}
            {(userType === "alumni" || loginData.role === "alumni") && (
              <>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    } mb-1`}>
                    Company
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.companyName}
                      onChange={(e) =>
                        handleInputChange("companyName", e.target.value)
                      }
                      className={`w-full px-3 py-2 border ${
                        isDarkMode
                          ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                          : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Enter your company name"
                    />
                  ) : (
                    <p
                      className={`${
                        isDarkMode ? "text-gray-200" : "text-gray-900"
                      }`}>
                      {profileData.companyName || "Not specified"}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    } mb-1`}>
                    Job Role
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.jobRole}
                      onChange={(e) =>
                        handleInputChange("jobRole", e.target.value)
                      }
                      className={`w-full px-3 py-2 border ${
                        isDarkMode
                          ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                          : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Enter your job role"
                    />
                  ) : (
                    <p
                      className={`${
                        isDarkMode ? "text-gray-200" : "text-gray-900"
                      }`}>
                      {profileData.jobRole || "Not specified"}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    } mb-1`}>
                    Years of Experience
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.experience || ""}
                      onChange={(e) =>
                        handleInputChange("experience", e.target.value)
                      }
                      className={`w-full px-3 py-2 border ${
                        isDarkMode
                          ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                          : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="e.g., 5+ years"
                    />
                  ) : (
                    <p
                      className={`${
                        isDarkMode ? "text-gray-200" : "text-gray-900"
                      }`}>
                      {profileData.experience || "Not specified"}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    } mb-1`}>
                    Working Status
                  </label>
                  {isEditing ? (
                    <select
                      value={profileData.isWorking}
                      onChange={(e) =>
                        handleInputChange(
                          "isWorking",
                          e.target.value === "true"
                        )
                      }
                      className={`w-full px-3 py-2 border ${
                        isDarkMode
                          ? "border-gray-600 bg-gray-700 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}>
                      <option value="true">Currently Working</option>
                      <option value="false">Not Currently Working</option>
                    </select>
                  ) : (
                    <p
                      className={`${
                        isDarkMode ? "text-gray-200" : "text-gray-900"
                      }`}>
                      {profileData.isWorking
                        ? "Currently Working"
                        : "Not Currently Working"}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Bio */}
            <div className="md:col-span-2">
              <label
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                } mb-1`}>
                Bio
              </label>
              {isEditing ? (
                <textarea
                  value={profileData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                      : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p
                  className={`${
                    isDarkMode ? "text-gray-200" : "text-gray-900"
                  }`}>
                  {profileData.bio}
                </p>
              )}
            </div>

            {/* Achievements/Notable Work (Alumni only) */}
            {(userType === "alumni" || loginData.role === "alumni") && (
              <div className="md:col-span-2">
                <label
                  className={`block text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } mb-1`}>
                  Key Achievements
                </label>
                {isEditing ? (
                  <textarea
                    value={profileData.achievements || ""}
                    onChange={(e) =>
                      handleInputChange("achievements", e.target.value)
                    }
                    rows={2}
                    className={`w-full px-3 py-2 border ${
                      isDarkMode
                        ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                        : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Notable achievements, awards, or recognition..."
                  />
                ) : (
                  <p
                    className={`${
                      isDarkMode ? "text-gray-200" : "text-gray-900"
                    }`}>
                    {profileData.achievements || "No achievements added yet"}
                  </p>
                )}
              </div>
            )}

            {/* Skills */}
            <div className="md:col-span-2">
              <label
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                } mb-1`}>
                Skills
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {profileData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className={`${
                      isDarkMode
                        ? "bg-blue-900 text-blue-300"
                        : "bg-blue-100 text-blue-800"
                    } px-3 py-1 rounded-full text-sm flex items-center`}>
                    {skill}
                    {isEditing && (
                      <button
                        onClick={() => handleSkillRemove(skill)}
                        className={`ml-2 ${
                          isDarkMode
                            ? "text-blue-400 hover:text-blue-200"
                            : "text-blue-600 hover:text-blue-800"
                        }`}>
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>
              {isEditing && (
                <input
                  type="text"
                  placeholder="Add a skill and press Enter"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSkillAdd(e.target.value);
                      e.target.value = "";
                    }
                  }}
                  className={`w-full px-3 py-2 border ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                      : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              )}
            </div>

            {/* Social Links */}
            <div className="md:col-span-2">
              <label
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                } mb-1`}>
                Social Links
              </label>
              <div className="space-y-2">
                {Object.entries(profileData.socialLinks).map(
                  ([platform, url]) => (
                    <div key={platform} className="flex items-center space-x-2">
                      <span
                        className={`w-20 text-sm ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        } capitalize`}>
                        {platform}:
                      </span>
                      {isEditing ? (
                        <input
                          type="url"
                          value={url}
                          onChange={(e) =>
                            handleInputChange("socialLinks", {
                              ...profileData.socialLinks,
                              [platform]: e.target.value,
                            })
                          }
                          className={`flex-1 px-3 py-1 border ${
                            isDarkMode
                              ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                              : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          placeholder={`https://www.${platform}.com/yourprofile`}
                        />
                      ) : (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${
                            isDarkMode
                              ? "text-blue-400 hover:text-blue-300"
                              : "text-blue-600 hover:text-blue-800"
                          }`}>
                          {url || "Not provided"}
                        </a>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
