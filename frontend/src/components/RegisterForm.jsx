import React, { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { authAPI, handleAPIError } from "../utils/api";

const RegisterForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    college: "",
    branch: "",
    year: "",
    isWorking: false,
    companyName: "",
    jobRole: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { isDarkMode } = useTheme();

  const colleges = [
    "Indian Institute of Technology (IIT) Delhi",
    "Indian Institute of Technology (IIT) Bombay",
    "Indian Institute of Technology (IIT) Madras",
    "Indian Institute of Technology (IIT) Kanpur",
    "Indian Institute of Technology (IIT) Kharagpur",
    "National Institute of Technology (NIT) Trichy",
    "National Institute of Technology (NIT) Warangal",
    "Delhi University",
    "Jawaharlal Nehru University",
    "University of Mumbai",
    "Anna University",
    "Osmania University",
    "Other",
  ];

  const branches = [
    "Computer Science Engineering",
    "Information Technology",
    "Electronics and Communication Engineering",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Chemical Engineering",
    "Aerospace Engineering",
    "Biotechnology",
    "Business Administration",
    "Commerce",
    "Economics",
    "Other",
  ];

  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Alumni"];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Prepare registration data
      const registrationData = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        college: formData.college,
        branch: formData.branch,
        year: formData.year,
      };

      // Add alumni-specific fields if year is Alumni
      if (formData.year === "Alumni") {
        registrationData.isWorking = formData.isWorking;
        if (formData.isWorking) {
          registrationData.companyName = formData.companyName;
          registrationData.jobRole = formData.jobRole;
        }
      }

      // Call registration API
      const response = await authAPI.register(registrationData);

      // Store user data with token in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...response.user,
          token: response.token,
        })
      );

      console.log("Registration successful:", response);

      // Redirect based on user role
      if (response.user.role === "alumni") {
        window.location.href = "/dashboard/alumni";
      } else {
        window.location.href = "/dashboard/student";
      }

      onClose();
    } catch (error) {
      console.error("Registration error:", error);
      setError(handleAPIError(error));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto`}>
        <div className="flex justify-between items-center mb-4">
          <h2
            className={`text-2xl font-bold ${
              isDarkMode ? "text-blue-400" : "text-blue-600"
            }`}>
            Register
          </h2>
          <button
            onClick={onClose}
            className={`${
              isDarkMode
                ? "text-gray-400 hover:text-gray-200"
                : "text-gray-500 hover:text-gray-700"
            } text-xl`}>
            ×
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div
            className={`mb-4 p-3 rounded-lg ${
              isDarkMode
                ? "bg-red-900 border-red-700 text-red-300"
                : "bg-red-100 border-red-400 text-red-700"
            } border`}>
            <div className="flex">
              <span className="mr-2">⚠️</span>
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className={`block text-sm font-medium ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              } mb-1`}>
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              className={`w-full px-3 py-2 border ${
                isDarkMode
                  ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              } mb-1`}>
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className={`w-full px-3 py-2 border ${
                isDarkMode
                  ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              } mb-1`}>
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className={`w-full px-3 py-2 border ${
                isDarkMode
                  ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter your password"
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              } mb-1`}>
              College *
            </label>
            <select
              name="college"
              value={formData.college}
              onChange={handleInputChange}
              required
              className={`w-full px-3 py-2 border ${
                isDarkMode
                  ? "border-gray-600 bg-gray-700 text-white"
                  : "border-gray-300 bg-white text-gray-900"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}>
              <option value="">Select your college</option>
              {colleges.map((college, index) => (
                <option key={index} value={college}>
                  {college}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className={`block text-sm font-medium ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              } mb-1`}>
              Branch *
            </label>
            <select
              name="branch"
              value={formData.branch}
              onChange={handleInputChange}
              required
              className={`w-full px-3 py-2 border ${
                isDarkMode
                  ? "border-gray-600 bg-gray-700 text-white"
                  : "border-gray-300 bg-white text-gray-900"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}>
              <option value="">Select your branch</option>
              {branches.map((branch, index) => (
                <option key={index} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className={`block text-sm font-medium ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              } mb-1`}>
              Year *
            </label>
            <select
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              required
              className={`w-full px-3 py-2 border ${
                isDarkMode
                  ? "border-gray-600 bg-gray-700 text-white"
                  : "border-gray-300 bg-white text-gray-900"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}>
              <option value="">Select your year</option>
              {years.map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {formData.year === "Alumni" && (
            <>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isWorking"
                  checked={formData.isWorking}
                  onChange={handleInputChange}
                  className={`mr-2 ${
                    isDarkMode ? "text-blue-500" : "text-blue-600"
                  }`}
                />
                <label
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                  Are you currently working?
                </label>
              </div>

              {formData.isWorking && (
                <>
                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      } mb-1`}>
                      Company Name *
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      required={formData.isWorking}
                      className={`w-full px-3 py-2 border ${
                        isDarkMode
                          ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                          : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Enter your company name"
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      } mb-1`}>
                      Role *
                    </label>
                    <input
                      type="text"
                      name="jobRole"
                      value={formData.jobRole}
                      onChange={handleInputChange}
                      required={formData.isWorking}
                      className={`w-full px-3 py-2 border ${
                        isDarkMode
                          ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                          : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Enter your role"
                    />
                  </div>
                </>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center ${
              loading
                ? "bg-gray-500 cursor-not-allowed text-white"
                : isDarkMode
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Account...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
