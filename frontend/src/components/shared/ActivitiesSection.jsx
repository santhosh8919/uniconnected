import React from "react";

const ActivityCard = ({ icon, title, timestamp, isDarkMode }) => {
  return (
    <div
      className={`flex items-center space-x-3 p-3 ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } rounded-lg hover:shadow-md transition-shadow duration-200 opacity-0 animate-slideIn`}>
      <span className="text-2xl">{icon}</span>
      <div className="flex-1">
        <p
          className={`text-sm font-medium ${
            isDarkMode ? "text-gray-200" : "text-gray-800"
          }`}>
          {title}
        </p>
        <p
          className={`text-xs ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}>
          {timestamp}
        </p>
      </div>
    </div>
  );
};

const ActivitiesSection = ({ title, activities, isDarkMode }) => {
  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-700" : "bg-gray-50"
      } rounded-lg p-6 opacity-0 animate-slideIn`}>
      <h3
        className={`text-lg font-semibold ${
          isDarkMode ? "text-gray-100" : "text-gray-800"
        } mb-4`}>
        {title}
      </h3>
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <ActivityCard
            key={index}
            icon={activity.icon}
            title={activity.title}
            timestamp={activity.timestamp}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>
    </div>
  );
};

export default ActivitiesSection;
