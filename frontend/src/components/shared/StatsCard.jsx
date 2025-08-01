import React from "react";

const StatsCard = ({
  icon,
  title,
  value,
  subtext,
  theme = "blue",
  isDarkMode,
}) => {
  const themeColors = {
    blue: {
      bg: isDarkMode ? "bg-blue-900/50" : "bg-blue-50",
      text: isDarkMode ? "text-blue-300" : "text-blue-800",
      value: isDarkMode ? "text-blue-400" : "text-blue-600",
    },
    green: {
      bg: isDarkMode ? "bg-green-900/50" : "bg-green-50",
      text: isDarkMode ? "text-green-300" : "text-green-800",
      value: isDarkMode ? "text-green-400" : "text-green-600",
    },
    purple: {
      bg: isDarkMode ? "bg-purple-900/50" : "bg-purple-50",
      text: isDarkMode ? "text-purple-300" : "text-purple-800",
      value: isDarkMode ? "text-purple-400" : "text-purple-600",
    },
    orange: {
      bg: isDarkMode ? "bg-orange-900/50" : "bg-orange-50",
      text: isDarkMode ? "text-orange-300" : "text-orange-800",
      value: isDarkMode ? "text-orange-400" : "text-orange-600",
    },
    pink: {
      bg: isDarkMode ? "bg-pink-900/50" : "bg-pink-50",
      text: isDarkMode ? "text-pink-300" : "text-pink-800",
      value: isDarkMode ? "text-pink-400" : "text-pink-600",
    },
  };

  const colors = themeColors[theme];

  return (
    <div
      className={`${colors.bg} rounded-lg p-6 text-center transform hover:scale-105 transition-all duration-300 ease-in-out cursor-default opacity-0 animate-fadeIn`}>
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className={`text-lg font-semibold ${colors.text}`}>{title}</h3>
      <p className={`text-2xl font-bold ${colors.value}`}>{value}</p>
      <p className={`text-sm ${colors.value}`}>{subtext}</p>
    </div>
  );
};

export default StatsCard;
