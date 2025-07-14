import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UsersIcon, 
  ChatBubbleLeftRightIcon, 
  BriefcaseIcon, 
  VideoCameraIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import api from '../../utils/api';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    students: 0,
    alumni: 0,
    connections: 0,
    jobPostings: 0,
    webinars: 0,
    activeUsers: 0,
    monthlyGrowth: 0
  });

  const [chartData, setChartData] = useState({
    userGrowth: [],
    connectionStats: [],
    userDistribution: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data.stats);
      setChartData(response.data.chartData);
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

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-indigo-100 text-lg">
              Monitor and manage your UniConnect platform
            </p>
          </div>
          <ChartBarIcon className="w-16 h-16 text-indigo-200" />
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={UsersIcon}
          title="Total Users"
          value={stats.totalUsers}
          color="text-blue-600 border-l-4 border-blue-500"
          trend={`+${stats.monthlyGrowth}% this month`}
        />
        <StatCard
          icon={UsersIcon}
          title="Students"
          value={stats.students}
          color="text-green-600 border-l-4 border-green-500"
        />
        <StatCard
          icon={UsersIcon}
          title="Alumni"
          value={stats.alumni}
          color="text-purple-600 border-l-4 border-purple-500"
        />
        <StatCard
          icon={ChatBubbleLeftRightIcon}
          title="Connections"
          value={stats.connections}
          color="text-orange-600 border-l-4 border-orange-500"
        />
        <StatCard
          icon={BriefcaseIcon}
          title="Job Postings"
          value={stats.jobPostings}
          color="text-teal-600 border-l-4 border-teal-500"
        />
        <StatCard
          icon={VideoCameraIcon}
          title="Webinars"
          value={stats.webinars}
          color="text-indigo-600 border-l-4 border-indigo-500"
        />
        <StatCard
          icon={ArrowTrendingUpIcon}
          title="Active Users"
          value={stats.activeUsers}
          color="text-pink-600 border-l-4 border-pink-500"
        />
        <StatCard
          icon={ChartBarIcon}
          title="Monthly Growth"
          value={`${stats.monthlyGrowth}%`}
          color="text-yellow-600 border-l-4 border-yellow-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">User Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.userGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Connection Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">Connection Statistics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.connectionStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="connections" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* User Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">User Distribution</h3>
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData.userDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.userDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;