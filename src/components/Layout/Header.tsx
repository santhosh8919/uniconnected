import React, { useState } from 'react';
import { BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(3);

  return (
    <header className="fixed top-0 left-64 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <BellIcon className="w-6 h-6" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notifications}
              </span>
            )}
          </motion.button>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.fullName?.charAt(0)}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">{user?.fullName}</p>
              <p className="text-gray-500 text-xs">{user?.college}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;