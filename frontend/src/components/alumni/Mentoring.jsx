import React, { useState } from "react";

const Mentoring = () => {
  const [activeTab, setActiveTab] = useState("mentees");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [mentees, setMentees] = useState([
    {
      id: 1,
      name: "Rahul Kumar",
      university: "IIT Delhi",
      major: "Computer Science",
      year: "3rd Year",
      goals: "Software Engineering at FAANG",
      interests: ["Web Development", "Data Structures", "System Design"],
      status: "active",
      joinDate: "2025-06-15",
      lastSession: "2025-07-22",
      nextSession: "2025-07-29",
      progress: 75,
      avatar: "👨‍💻",
      totalSessions: 12,
      achievements: ["Completed DSA Bootcamp", "Built 3 Projects"],
      currentFocus: "Preparing for interviews",
    },
    {
      id: 2,
      name: "Priya Sharma",
      university: "BITS Pilani",
      major: "Information Technology",
      year: "2nd Year",
      goals: "Frontend Development Career",
      interests: ["React", "UI/UX Design", "JavaScript"],
      status: "active",
      joinDate: "2025-07-01",
      lastSession: "2025-07-20",
      nextSession: "2025-07-27",
      progress: 45,
      avatar: "👩‍💻",
      totalSessions: 6,
      achievements: ["Completed React Basics", "Portfolio Website"],
      currentFocus: "Advanced React concepts",
    },
    {
      id: 3,
      name: "Arjun Patel",
      university: "NIT Trichy",
      major: "Electronics",
      year: "4th Year",
      goals: "Transition to Software Development",
      interests: ["Python", "Machine Learning", "Backend Development"],
      status: "completed",
      joinDate: "2025-04-01",
      lastSession: "2025-06-30",
      nextSession: null,
      progress: 100,
      avatar: "👨‍🎓",
      totalSessions: 20,
      achievements: [
        "Career Transition",
        "Got Placement at Startup",
        "Built ML Project",
      ],
      currentFocus: "Program completed successfully",
    },
  ]);

  const [mentorshipRequests, setMentorshipRequests] = useState([
    {
      id: 4,
      name: "Sneha Reddy",
      university: "VIT Chennai",
      major: "Computer Science",
      year: "1st Year",
      goals: "Learn Programming Fundamentals",
      interests: ["Python", "Web Development", "Mobile Apps"],
      requestDate: "2025-07-25",
      message:
        "Hi! I am a first-year student looking for guidance in programming. I want to build strong fundamentals and eventually work in tech.",
      avatar: "👩‍🎓",
      urgency: "medium",
    },
    {
      id: 5,
      name: "Karthik Menon",
      university: "IIIT Hyderabad",
      major: "Data Science",
      year: "3rd Year",
      goals: "Data Science Career Guidance",
      interests: ["Machine Learning", "Statistics", "Python"],
      requestDate: "2025-07-24",
      message:
        "Looking for a mentor to guide me through my data science journey and help with career planning.",
      avatar: "👨‍🔬",
      urgency: "high",
    },
  ]);

  const [sessions, setSessions] = useState([
    {
      id: 1,
      menteeId: 1,
      menteeName: "Rahul Kumar",
      date: "2025-07-29",
      time: "10:00 AM",
      duration: "60 minutes",
      type: "video",
      topic: "System Design Interview Prep",
      status: "scheduled",
      notes: "",
      agenda: ["Scalability concepts", "Database design", "Mock interview"],
    },
    {
      id: 2,
      menteeId: 2,
      menteeName: "Priya Sharma",
      date: "2025-07-27",
      time: "2:00 PM",
      duration: "45 minutes",
      type: "video",
      topic: "React State Management",
      status: "scheduled",
      notes: "",
      agenda: ["Redux basics", "Context API", "Best practices"],
    },
    {
      id: 3,
      menteeId: 1,
      menteeName: "Rahul Kumar",
      date: "2025-07-22",
      time: "10:00 AM",
      duration: "60 minutes",
      type: "video",
      topic: "Resume Review & Career Guidance",
      status: "completed",
      notes:
        "Discussed project highlights, improved resume format, shared interview tips",
      agenda: [
        "Resume optimization",
        "Project discussion",
        "Interview strategies",
      ],
    },
  ]);

  const [mentorProfile, setMentorProfile] = useState({
    totalMentees: 15,
    activeMentees: 2,
    completedPrograms: 8,
    totalSessions: 120,
    rating: 4.8,
    specializations: [
      "Software Engineering",
      "Career Guidance",
      "Technical Interviews",
    ],
    availability: {
      monday: "10:00 AM - 6:00 PM",
      tuesday: "2:00 PM - 8:00 PM",
      wednesday: "Not Available",
      thursday: "10:00 AM - 4:00 PM",
      friday: "1:00 PM - 7:00 PM",
      weekend: "Flexible",
    },
    bio: "Senior Software Engineer with 8+ years of experience in full-stack development. Passionate about helping students transition into tech careers.",
    hourlyRate: "Free for students",
  });

  const handleAcceptRequest = (id) => {
    const request = mentorshipRequests.find((req) => req.id === id);
    if (request) {
      const newMentee = {
        ...request,
        status: "active",
        joinDate: new Date().toISOString().split("T")[0],
        progress: 0,
        totalSessions: 0,
        achievements: [],
        currentFocus: "Getting started",
      };
      setMentees((prev) => [...prev, newMentee]);
      setMentorshipRequests((prev) => prev.filter((req) => req.id !== id));
    }
  };

  const handleRejectRequest = (id) => {
    setMentorshipRequests((prev) => prev.filter((req) => req.id !== id));
  };

  const getFilteredMentees = () => {
    return mentees.filter((mentee) => {
      const matchesSearch =
        mentee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentee.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentee.major.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || mentee.status === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  };

  const getUpcomingSessions = () => {
    return sessions
      .filter((session) => session.status === "scheduled")
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const renderMenteeCard = (mentee) => (
    <div
      key={mentee.id}
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4">
        <div className="text-4xl">{mentee.avatar}</div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{mentee.name}</h3>
              <p className="text-blue-600 font-semibold">{mentee.university}</p>
              <p className="text-sm text-gray-600">
                {mentee.major} • {mentee.year}
              </p>
            </div>

            <div className="flex flex-col items-end space-y-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  mentee.status === "active"
                    ? "bg-green-100 text-green-800"
                    : mentee.status === "completed"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}>
                {mentee.status.charAt(0).toUpperCase() + mentee.status.slice(1)}
              </span>
              <div className="text-right text-xs text-gray-500">
                <p>{mentee.totalSessions} sessions</p>
                <p>{mentee.progress}% progress</p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm font-medium text-gray-800 mb-1">
              Goal: {mentee.goals}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Current Focus: {mentee.currentFocus}
            </p>

            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-2">Interests</p>
              <div className="flex flex-wrap gap-1">
                {mentee.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {mentee.achievements.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-2">Achievements</p>
                <div className="flex flex-wrap gap-1">
                  {mentee.achievements.map((achievement, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                      🏆 {achievement}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {mentee.status === "active" && (
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-1">Progress</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${mentee.progress}%` }}></div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4 text-xs text-gray-600">
            <div>
              <p>Joined: {new Date(mentee.joinDate).toLocaleDateString()}</p>
              {mentee.lastSession && (
                <p>
                  Last Session:{" "}
                  {new Date(mentee.lastSession).toLocaleDateString()}
                </p>
              )}
            </div>
            <div>
              {mentee.nextSession && (
                <p className="text-blue-600">
                  Next Session:{" "}
                  {new Date(mentee.nextSession).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          <div className="flex space-x-2">
            {mentee.status === "active" && (
              <>
                <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                  Schedule Session
                </button>
                <button className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
                  Send Message
                </button>
                <button className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700">
                  Update Progress
                </button>
              </>
            )}
            <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200">
              View Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRequestCard = (request) => (
    <div
      key={request.id}
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4">
        <div className="text-4xl">{request.avatar}</div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {request.name}
              </h3>
              <p className="text-blue-600 font-semibold">
                {request.university}
              </p>
              <p className="text-sm text-gray-600">
                {request.major} • {request.year}
              </p>
            </div>

            <div className="flex flex-col items-end space-y-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  request.urgency === "high"
                    ? "bg-red-100 text-red-800"
                    : request.urgency === "medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}>
                {request.urgency} priority
              </span>
              <p className="text-xs text-gray-500">
                {new Date(request.requestDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <p className="text-sm font-medium text-gray-800 mb-2">
            Goal: {request.goals}
          </p>

          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Interests</p>
            <div className="flex flex-wrap gap-1">
              {request.interests.map((interest, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {interest}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Message</p>
            <p className="text-sm text-gray-700 italic">"{request.message}"</p>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => handleAcceptRequest(request.id)}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
              Accept Request
            </button>
            <button
              onClick={() => handleRejectRequest(request.id)}
              className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700">
              Decline
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Mentoring</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search mentees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Update Availability
          </button>
        </div>
      </div>

      {/* Mentor Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">
            {mentorProfile.activeMentees}
          </p>
          <p className="text-sm text-gray-600">Active Mentees</p>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <p className="text-2xl font-bold text-green-600">
            {mentorProfile.completedPrograms}
          </p>
          <p className="text-sm text-gray-600">Completed Programs</p>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <p className="text-2xl font-bold text-purple-600">
            {mentorProfile.totalSessions}
          </p>
          <p className="text-sm text-gray-600">Total Sessions</p>
        </div>
        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <p className="text-2xl font-bold text-yellow-600">
            {mentorProfile.rating}
          </p>
          <p className="text-sm text-gray-600">Average Rating</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 overflow-x-auto">
        {[
          { id: "mentees", label: "My Mentees", count: mentees.length },
          {
            id: "requests",
            label: "New Requests",
            count: mentorshipRequests.length,
          },
          {
            id: "sessions",
            label: "Upcoming Sessions",
            count: getUpcomingSessions().length,
          },
          { id: "profile", label: "Mentor Profile", count: null },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}>
            <span>{tab.label}</span>
            {tab.count !== null && (
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.id ? "bg-blue-500" : "bg-gray-300"
                }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content based on active tab */}
      {activeTab === "mentees" && (
        <div>
          {/* Category Filter */}
          <div className="mb-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Mentees</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="space-y-6">
            {getFilteredMentees().length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <span className="text-6xl mb-4 block">👥</span>
                <p className="text-xl mb-2">No mentees found</p>
                <p className="text-sm">
                  Start accepting mentorship requests to build your mentee
                  network
                </p>
              </div>
            ) : (
              getFilteredMentees().map(renderMenteeCard)
            )}
          </div>
        </div>
      )}

      {activeTab === "requests" && (
        <div className="space-y-6">
          {mentorshipRequests.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <span className="text-6xl mb-4 block">📩</span>
              <p className="text-xl mb-2">No pending requests</p>
              <p className="text-sm">
                New mentorship requests will appear here
              </p>
            </div>
          ) : (
            mentorshipRequests.map(renderRequestCard)
          )}
        </div>
      )}

      {activeTab === "sessions" && (
        <div className="space-y-4">
          {getUpcomingSessions().length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <span className="text-6xl mb-4 block">📅</span>
              <p className="text-xl mb-2">No upcoming sessions</p>
              <p className="text-sm">Schedule sessions with your mentees</p>
            </div>
          ) : (
            getUpcomingSessions().map((session) => (
              <div
                key={session.id}
                className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {session.topic}
                    </h3>
                    <p className="text-sm text-blue-600">
                      with {session.menteeName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(session.date).toLocaleDateString()} at{" "}
                      {session.time} ({session.duration})
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                      Join Session
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200">
                      Reschedule
                    </button>
                  </div>
                </div>
                {session.agenda && session.agenda.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Agenda:</p>
                    <ul className="text-sm text-gray-700">
                      {session.agenda.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "profile" && (
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Mentor Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={mentorProfile.bio}
                  onChange={(e) =>
                    setMentorProfile((prev) => ({
                      ...prev,
                      bio: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specializations
                </label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {mentorProfile.specializations.map((spec, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {spec} ✕
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Add specialization"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-md font-semibold text-gray-800 mb-3">
                Availability
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(mentorProfile.availability).map(
                  ([day, time]) => (
                    <div key={day} className="flex items-center space-x-4">
                      <label className="w-20 text-sm text-gray-700 capitalize">
                        {day}:
                      </label>
                      <input
                        type="text"
                        value={time}
                        onChange={(e) =>
                          setMentorProfile((prev) => ({
                            ...prev,
                            availability: {
                              ...prev.availability,
                              [day]: e.target.value,
                            },
                          }))
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="mt-6 flex space-x-4">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Save Changes
              </button>
              <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                Preview Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mentoring;
