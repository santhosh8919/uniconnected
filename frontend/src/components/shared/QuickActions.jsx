import React from "react";

const ActionButton = ({ icon, label, onClick, color = "blue", isDarkMode }) => {
  const colorClasses = {
    blue: "bg-blue-600 hover:bg-blue-700",
    purple: "bg-purple-600 hover:bg-purple-700",
    green: "bg-green-600 hover:bg-green-700",
    indigo: "bg-indigo-600 hover:bg-indigo-700",
    orange: "bg-orange-600 hover:bg-orange-700",
    pink: "bg-pink-600 hover:bg-pink-700",
  };

  return (
    <button
      onClick={onClick}
      className={`p-4 ${colorClasses[color]} text-white rounded-lg transition-all duration-200 transform hover:scale-105 opacity-0 animate-scaleIn`}>
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-sm font-medium">{label}</div>
    </button>
  );
};

const QuickActions = ({ actions, isDarkMode }) => {
  return (
    <div className="mt-8 opacity-0 animate-fadeIn">
      <h3
        className={`text-lg font-semibold ${
          isDarkMode ? "text-gray-100" : "text-gray-800"
        } mb-4`}>
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {actions.map((action, index) => (
          <ActionButton key={index} {...action} isDarkMode={isDarkMode} />
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
