import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UserGroupIcon, 
  ChatBubbleLeftRightIcon, 
  BriefcaseIcon, 
  VideoCameraIcon,
  ArrowTrendingUpIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    connections: 0,
    pendingRequests: 0,
    messages: 0,
    jobApplications: 0,
    webinarsAttended: 0,
    profileViews: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/student');
      setStats(response.data.stats);
      setRecentActivities(response.data.recentActivities);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color, trend }: any) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ${color}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500 font-medium">{trend}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color.replace('border-l-4', 'bg-opacity-10')}`}>
          <Icon className="w-8 h-8 text-current" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.fullName}!</h1>
            <p className="text-blue-100 text-lg">
              {user?.branch} • {user?.year} Year • {user?.college}
            </p>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm">Today's Date</p>
            <p className="text-xl font-semibold">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={UserGroupIcon}
          title="Connections"
          value={stats.connections}
          color="text-blue-600 border-l-4 border-blue-500"
          trend="+12% this month"
        />
        <StatCard
          icon={ChatBubbleLeftRightIcon}
          title="Messages"
          value={stats.messages}
          color="text-green-600 border-l-4 border-green-500"
          trend="+8% this week"
        />
        <StatCard
          icon={BriefcaseIcon}
          title="Job Applications"
          value={stats.jobApplications}
          color="text-purple-600 border-l-4 border-purple-500"
          trend="+3 this month"
        />
        <StatCard
          icon={VideoCameraIcon}
          title="Webinars Attended"
          value={stats.webinarsAttended}
          color="text-orange-600 border-l-4 border-orange-500"
          trend="+2 this week"
        />
        <StatCard
          icon={UserGroupIcon}
          title="Pending Requests"
          value={stats.pendingRequests}
          color="text-yellow-600 border-l-4 border-yellow-500"
        />
        <StatCard
          icon={ArrowTrendingUpIcon}
          title="Profile Views"
          value={stats.profileViews}
          color="text-teal-600 border-l-4 border-teal-500"
          trend="+15% this month"
        />
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity: any, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No recent activities</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">Upcoming Events</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Tech Talk: AI & Machine Learning</p>
                <p className="text-xs text-gray-500">Tomorrow at 2:00 PM</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CalendarIcon className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Career Fair 2025</p>
                <p className="text-xs text-gray-500">March 15, 2025</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <CalendarIcon className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Alumni Networking Event</p>
                <p className="text-xs text-gray-500">March 20, 2025</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentDashboard;