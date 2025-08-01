import React, { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { authAPI, handleAPIError } from "../utils/api";

const LoginForm = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { isDarkMode } = useTheme();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Call login API
      const response = await authAPI.login(formData);

      // Store user data with token in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...response.user,
          token: response.token,
        })
      );

      console.log("Login successful:", response);

      // Redirect based on user role
      if (response.user.role === "alumni") {
        window.location.href = "/dashboard/alumni";
      } else {
        window.location.href = "/dashboard/student";
      }

      onClose();
    } catch (error) {
      console.error("Login error:", error);
      setError(handleAPIError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToRegister = () => {
    onClose();
    if (onSwitchToRegister) {
      onSwitchToRegister();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`rounded-lg p-6 w-full max-w-md ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}>
        <div className="flex justify-between items-center mb-4">
          <h2
            className={`text-2xl font-bold ${
              isDarkMode ? "text-blue-400" : "text-blue-600"
            }`}>
            Login
          </h2>
          <button
            onClick={onClose}
            className={`text-xl ${
              isDarkMode
                ? "text-gray-400 hover:text-gray-200"
                : "text-gray-500 hover:text-gray-700"
            }`}>
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
              className={`block text-sm font-medium mb-1 ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              }`}>
              Email/Username *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
              placeholder="Enter your email or username"
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-1 ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              }`}>
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input type="checkbox" id="remember" className="mr-2" />
              <label
                htmlFor="remember"
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}>
                Remember me
              </label>
            </div>
            <a
              href="#"
              className={`text-sm ${
                isDarkMode
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-500"
              }`}>
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center ${
              loading
                ? "bg-gray-500 cursor-not-allowed text-white"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>

          <div
            className={`text-center text-sm ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}>
            Don't have an account?{" "}
            <button
              type="button"
              onClick={handleSwitchToRegister}
              className={`${
                isDarkMode
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-500"
              }`}>
              Register here
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
