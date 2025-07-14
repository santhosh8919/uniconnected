import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HomeIcon, 
  UsersIcon, 
  ChatBubbleLeftRightIcon,
  BriefcaseIcon,
  VideoCameraIcon,
  UserGroupIcon,
  ChartBarIcon,
  BellIcon,
  UserCircleIcon,
  CogIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  const studentLinks = [
    { path: '/dashboard', icon: HomeIcon, label: 'Dashboard' },
    { path: '/connections', icon: UsersIcon, label: 'Connections' },
    { path: '/chat', icon: ChatBubbleLeftRightIcon, label: 'Chat' },
    { path: '/jobs', icon: BriefcaseIcon, label: 'Jobs' },
    { path: '/webinars', icon: VideoCameraIcon, label: 'Webinars' },
    { path: '/profile', icon: UserCircleIcon, label: 'Profile' },
  ];

  const alumniLinks = [
    { path: '/dashboard', icon: HomeIcon, label: 'Dashboard' },
    { path: '/requests', icon: UsersIcon, label: 'Requests' },
    { path: '/chat', icon: ChatBubbleLeftRightIcon, label: 'Chat' },
    { path: '/jobs', icon: BriefcaseIcon, label: 'Jobs' },
    { path: '/webinars', icon: VideoCameraIcon, label: 'Webinars' },
    { path: '/groups', icon: UserGroupIcon, label: 'Groups' },
    { path: '/analytics', icon: ChartBarIcon, label: 'Analytics' },
    { path: '/profile', icon: UserCircleIcon, label: 'Profile' },
  ];

  const adminLinks = [
    { path: '/admin', icon: HomeIcon, label: 'Dashboard' },
    { path: '/admin/users', icon: UsersIcon, label: 'Users' },
    { path: '/admin/connections', icon: ChatBubbleLeftRightIcon, label: 'Connections' },
    { path: '/admin/jobs', icon: BriefcaseIcon, label: 'Jobs' },
    { path: '/admin/webinars', icon: VideoCameraIcon, label: 'Webinars' },
    { path: '/admin/analytics', icon: ChartBarIcon, label: 'Analytics' },
    { path: '/admin/settings', icon: CogIcon, label: 'Settings' },
  ];

  const getLinks = () => {
    switch (user?.role) {
      case 'student':
        return studentLinks;
      case 'alumni':
        return alumniLinks;
      case 'admin':
        return adminLinks;
      default:
        return studentLinks;
    }
  };

  return (
    <motion.div 
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-50"
    >
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">U</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800">UniConnect</h1>
        </div>

        <nav className="space-y-2">
          {getLinks().map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <link.icon className="w-5 h-5" />
              <span className="font-medium">{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.fullName?.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">{user?.fullName}</p>
                <p className="text-gray-500 text-xs capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;