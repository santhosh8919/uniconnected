import React, { useState } from "react";

const Hackathons = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchTerm, setSearchTerm] = useState("");

  const [hackathons, setHackathons] = useState([
    {
      id: 1,
      title: "TechFest 2025",
      organizer: "IIT Bombay",
      date: "2025-08-15",
      endDate: "2025-08-17",
      location: "Mumbai, India",
      mode: "Hybrid",
      prize: "₹5,00,000",
      participants: 2500,
      description:
        "India's largest technology festival with multiple tracks including AI/ML, Web Development, and IoT.",
      technologies: ["AI/ML", "Web Development", "IoT", "Blockchain"],
      difficulty: "Intermediate",
      status: "upcoming",
      isRegistered: false,
      registrationDeadline: "2025-08-10",
      image: "🏆",
    },
    {
      id: 2,
      title: "Smart India Hackathon",
      organizer: "Government of India",
      date: "2025-09-01",
      endDate: "2025-09-03",
      location: "Multiple Cities",
      mode: "Offline",
      prize: "₹1,00,000",
      participants: 10000,
      description:
        "National level hackathon to solve real-world problems faced by various government departments.",
      technologies: ["Full Stack", "Mobile App", "Data Analytics", "AI"],
      difficulty: "Advanced",
      status: "upcoming",
      isRegistered: true,
      registrationDeadline: "2025-08-25",
      image: "🇮🇳",
    },
    {
      id: 3,
      title: "HackWithInfy",
      organizer: "Infosys",
      date: "2025-07-20",
      endDate: "2025-07-22",
      location: "Bangalore, India",
      mode: "Online",
      prize: "₹3,00,000",
      participants: 5000,
      description:
        "Innovation challenge for students to showcase their coding skills and problem-solving abilities.",
      technologies: ["Java", "Python", "JavaScript", "Cloud"],
      difficulty: "Beginner",
      status: "ongoing",
      isRegistered: true,
      registrationDeadline: "2025-07-15",
      image: "💻",
    },
    {
      id: 4,
      title: "CodeFest 2025",
      organizer: "IIT Delhi",
      date: "2025-06-15",
      endDate: "2025-06-17",
      location: "Delhi, India",
      mode: "Offline",
      prize: "₹2,00,000",
      participants: 1500,
      description:
        "Annual coding competition focusing on algorithmic challenges and software development.",
      technologies: ["Algorithms", "Data Structures", "System Design"],
      difficulty: "Advanced",
      status: "completed",
      isRegistered: true,
      registrationDeadline: "2025-06-10",
      image: "🎯",
      result: "Finalist",
    },
  ]);

  const handleRegister = (id) => {
    setHackathons((prev) =>
      prev.map((hackathon) =>
        hackathon.id === id ? { ...hackathon, isRegistered: true } : hackathon
      )
    );
  };

  const handleUnregister = (id) => {
    setHackathons((prev) =>
      prev.map((hackathon) =>
        hackathon.id === id ? { ...hackathon, isRegistered: false } : hackathon
      )
    );
  };

  const getFilteredHackathons = () => {
    return hackathons.filter((hackathon) => {
      const matchesSearch =
        hackathon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hackathon.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hackathon.technologies.some((tech) =>
          tech.toLowerCase().includes(searchTerm.toLowerCase())
        );

      if (activeTab === "all") return matchesSearch;
      if (activeTab === "registered")
        return matchesSearch && hackathon.isRegistered;
      return matchesSearch && hackathon.status === activeTab;
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "ongoing":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isRegistrationOpen = (hackathon) => {
    const deadline = new Date(hackathon.registrationDeadline);
    const now = new Date();
    return deadline > now && hackathon.status === "upcoming";
  };

  const renderHackathonCard = (hackathon) => (
    <div
      key={hackathon.id}
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4">
        <div className="text-4xl">{hackathon.image}</div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {hackathon.title}
              </h3>
              <p className="text-sm text-gray-600">by {hackathon.organizer}</p>
            </div>

            <div className="flex flex-col items-end space-y-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  hackathon.status
                )}`}>
                {hackathon.status.charAt(0).toUpperCase() +
                  hackathon.status.slice(1)}
              </span>
              {hackathon.result && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {hackathon.result}
                </span>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-700 mt-2 mb-3">
            {hackathon.description}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-500">Date</p>
              <p className="text-sm font-medium">
                {new Date(hackathon.date).toLocaleDateString()} -{" "}
                {new Date(hackathon.endDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Location</p>
              <p className="text-sm font-medium">
                {hackathon.location} ({hackathon.mode})
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Prize Pool</p>
              <p className="text-sm font-medium text-green-600">
                {hackathon.prize}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Participants</p>
              <p className="text-sm font-medium">
                {hackathon.participants.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Technologies</p>
            <div className="flex flex-wrap gap-2">
              {hackathon.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(
                  hackathon.difficulty
                )}`}>
                {hackathon.difficulty}
              </span>
              {hackathon.status === "upcoming" && (
                <span className="text-xs text-gray-500">
                  Registration deadline:{" "}
                  {new Date(
                    hackathon.registrationDeadline
                  ).toLocaleDateString()}
                </span>
              )}
            </div>

            <div className="flex space-x-2">
              {hackathon.status === "upcoming" && (
                <>
                  {hackathon.isRegistered ? (
                    <button
                      onClick={() => handleUnregister(hackathon.id)}
                      className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700">
                      Unregister
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRegister(hackathon.id)}
                      disabled={!isRegistrationOpen(hackathon)}
                      className={`px-4 py-2 text-sm rounded-lg ${
                        isRegistrationOpen(hackathon)
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}>
                      {isRegistrationOpen(hackathon)
                        ? "Register"
                        : "Registration Closed"}
                    </button>
                  )}
                </>
              )}

              <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Hackathons</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search hackathons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 overflow-x-auto">
        {[
          { id: "all", label: "All", count: hackathons.length },
          {
            id: "upcoming",
            label: "Upcoming",
            count: hackathons.filter((h) => h.status === "upcoming").length,
          },
          {
            id: "ongoing",
            label: "Ongoing",
            count: hackathons.filter((h) => h.status === "ongoing").length,
          },
          {
            id: "completed",
            label: "Completed",
            count: hackathons.filter((h) => h.status === "completed").length,
          },
          {
            id: "registered",
            label: "My Registrations",
            count: hackathons.filter((h) => h.isRegistered).length,
          },
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
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                activeTab === tab.id ? "bg-blue-500" : "bg-gray-300"
              }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Hackathons List */}
      <div className="space-y-6">
        {getFilteredHackathons().length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <span className="text-6xl mb-4 block">🏆</span>
            <p className="text-xl mb-2">No hackathons found</p>
            <p className="text-sm">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Check back later for new hackathons"}
            </p>
          </div>
        ) : (
          getFilteredHackathons().map(renderHackathonCard)
        )}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Your Hackathon Journey
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {hackathons.filter((h) => h.isRegistered).length}
            </p>
            <p className="text-sm text-gray-600">Registered</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {
                hackathons.filter(
                  (h) => h.status === "completed" && h.isRegistered
                ).length
              }
            </p>
            <p className="text-sm text-gray-600">Participated</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              {hackathons.filter((h) => h.result).length}
            </p>
            <p className="text-sm text-gray-600">Awards</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">
              {hackathons.filter((h) => h.status === "upcoming").length}
            </p>
            <p className="text-sm text-gray-600">Upcoming</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hackathons;
