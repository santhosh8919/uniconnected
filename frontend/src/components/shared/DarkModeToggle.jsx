import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

const DarkModeToggle = ({ className = "" }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        isDarkMode ? "bg-blue-600" : "bg-gray-200"
      } ${className}`}
      role="switch"
      aria-checked={isDarkMode}
      aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}>
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          isDarkMode ? "translate-x-6" : "translate-x-1"
        }`}
      />
      <span className="sr-only">
        {isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      </span>
    </button>
  );
};

export default DarkModeToggle;
