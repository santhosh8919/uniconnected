import React, { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";

const BackendHealthCheck = () => {
  const [isBackendRunning, setIsBackendRunning] = useState(false);
  const [checking, setChecking] = useState(true);
  const [lastCheck, setLastCheck] = useState(null);
  const { isDarkMode } = useTheme();

  const checkBackendHealth = async () => {
    try {
      setChecking(true);
      const response = await fetch("http://localhost:5000/api/health", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setIsBackendRunning(true);
      } else {
        setIsBackendRunning(false);
      }
    } catch (error) {
      setIsBackendRunning(false);
    } finally {
      setChecking(false);
      setLastCheck(new Date().toLocaleTimeString());
    }
  };

  useEffect(() => {
    checkBackendHealth();
    // Check every 30 seconds
    const interval = setInterval(checkBackendHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (checking) return isDarkMode ? "text-yellow-400" : "text-yellow-600";
    return isBackendRunning
      ? isDarkMode
        ? "text-green-400"
        : "text-green-600"
      : isDarkMode
      ? "text-red-400"
      : "text-red-600";
  };

  const getStatusIcon = () => {
    if (checking) return "🔄";
    return isBackendRunning ? "✅" : "❌";
  };

  const getStatusText = () => {
    if (checking) return "Checking...";
    return isBackendRunning ? "Backend Online" : "Backend Offline";
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-3 rounded-lg shadow-lg ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      } border`}>
      <div className="flex items-center space-x-2">
        <span className="text-lg">{getStatusIcon()}</span>
        <div>
          <p className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </p>
          {lastCheck && (
            <p
              className={`text-xs ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}>
              Last check: {lastCheck}
            </p>
          )}
        </div>
        <button
          onClick={checkBackendHealth}
          disabled={checking}
          className={`ml-2 px-2 py-1 text-xs rounded ${
            isDarkMode
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          } disabled:opacity-50`}>
          {checking ? "..." : "🔄"}
        </button>
      </div>

      {!isBackendRunning && !checking && (
        <div
          className={`mt-2 p-2 rounded text-xs ${
            isDarkMode ? "bg-red-900 text-red-300" : "bg-red-100 text-red-700"
          }`}>
          <p className="font-medium">Backend server is not running!</p>
          <p className="mt-1">To start the backend:</p>
          <ol className="mt-1 ml-3 list-decimal text-xs">
            <li>Open terminal</li>
            <li>
              Run: <code>cd backend</code>
            </li>
            <li>
              Run: <code>npm start</code>
            </li>
          </ol>
        </div>
      )}
    </div>
  );
};

export default BackendHealthCheck;
