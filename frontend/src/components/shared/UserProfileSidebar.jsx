import React from "react";

const UserProfileSidebar = ({ user, onLogout, isDarkMode }) => {
  return (
    <div
      className={`absolute bottom-0 w-64 p-6 border-t ${
        isDarkMode ? "border-gray-700" : "border-gray-200"
      } opacity-0 animate-slideIn`}>
      <div className="flex items-center space-x-3 mb-4">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.fullName}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            {user.fullName.charAt(0)}
          </div>
        )}
        <div className="flex-1">
          <p
            className={`text-sm font-medium ${
              isDarkMode ? "text-gray-200" : "text-gray-800"
            }`}>
            {user.fullName}
          </p>
          <p
            className={`text-xs ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}>
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </p>
        </div>
      </div>
      <button
        onClick={onLogout}
        className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
        Logout
      </button>
    </div>
  );
};

export default UserProfileSidebar;
