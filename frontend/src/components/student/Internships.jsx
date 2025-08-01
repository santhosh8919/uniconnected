import React, { useState } from "react";

const Internships = () => {
  const [activeTab, setActiveTab] = useState("available");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    duration: "",
    stipend: "",
    company: "",
  });

  const [internships, setInternships] = useState([
    {
      id: 1,
      title: "Software Development Intern",
      company: "Google",
      location: "Bangalore, India",
      type: "Full-time",
      duration: "3 months",
      stipend: "₹50,000/month",
      description:
        "Work on cutting-edge technologies and contribute to products used by billions of users.",
      requirements: [
        "Strong programming skills",
        "Knowledge of Data Structures",
        "Experience with Java/Python",
      ],
      technologies: ["Java", "Python", "SQL", "Git"],
      applicationDeadline: "2025-08-30",
      startDate: "2025-09-15",
      status: "available",
      isApplied: false,
      remote: false,
      logo: "🔍",
      postedDate: "2025-07-20",
    },
    {
      id: 2,
      title: "Frontend Development Intern",
      company: "Microsoft",
      location: "Hyderabad, India",
      type: "Full-time",
      duration: "6 months",
      stipend: "₹45,000/month",
      description:
        "Build responsive web applications and work with modern frontend frameworks.",
      requirements: [
        "React.js experience",
        "HTML/CSS/JavaScript",
        "UI/UX understanding",
      ],
      technologies: ["React", "TypeScript", "Azure", "CSS"],
      applicationDeadline: "2025-08-25",
      startDate: "2025-09-01",
      status: "available",
      isApplied: true,
      remote: true,
      logo: "🪟",
      postedDate: "2025-07-18",
    },
    {
      id: 3,
      title: "Data Science Intern",
      company: "Amazon",
      location: "Mumbai, India",
      type: "Full-time",
      duration: "4 months",
      stipend: "₹48,000/month",
      description:
        "Analyze large datasets and build machine learning models for recommendation systems.",
      requirements: [
        "Python programming",
        "Machine Learning basics",
        "Statistics knowledge",
      ],
      technologies: ["Python", "TensorFlow", "AWS", "SQL"],
      applicationDeadline: "2025-07-25",
      startDate: "2025-08-15",
      status: "ongoing",
      isApplied: true,
      remote: false,
      logo: "📦",
      postedDate: "2025-07-10",
    },
    {
      id: 4,
      title: "Mobile App Development Intern",
      company: "Flipkart",
      location: "Bangalore, India",
      type: "Part-time",
      duration: "3 months",
      stipend: "₹30,000/month",
      description:
        "Develop mobile applications for e-commerce platform with millions of users.",
      requirements: [
        "Android/iOS development",
        "Mobile UI/UX",
        "API integration",
      ],
      technologies: ["React Native", "JavaScript", "APIs", "Mobile"],
      applicationDeadline: "2025-06-30",
      startDate: "2025-07-15",
      status: "completed",
      isApplied: true,
      remote: false,
      logo: "🛒",
      postedDate: "2025-06-15",
      result: "Completed Successfully",
    },
  ]);

  const handleApply = (id) => {
    setInternships((prev) =>
      prev.map((internship) =>
        internship.id === id ? { ...internship, isApplied: true } : internship
      )
    );
  };

  const handleWithdraw = (id) => {
    setInternships((prev) =>
      prev.map((internship) =>
        internship.id === id ? { ...internship, isApplied: false } : internship
      )
    );
  };

  const getFilteredInternships = () => {
    return internships.filter((internship) => {
      const matchesSearch =
        internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.technologies.some((tech) =>
          tech.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesFilters =
        (!filters.location ||
          internship.location
            .toLowerCase()
            .includes(filters.location.toLowerCase())) &&
        (!filters.duration || internship.duration === filters.duration) &&
        (!filters.company ||
          internship.company
            .toLowerCase()
            .includes(filters.company.toLowerCase()));

      if (activeTab === "all") return matchesSearch && matchesFilters;
      if (activeTab === "applied")
        return matchesSearch && matchesFilters && internship.isApplied;
      return matchesSearch && matchesFilters && internship.status === activeTab;
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "ongoing":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isApplicationOpen = (internship) => {
    const deadline = new Date(internship.applicationDeadline);
    const now = new Date();
    return deadline > now && internship.status === "available";
  };

  const renderInternshipCard = (internship) => (
    <div
      key={internship.id}
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4">
        <div className="text-4xl">{internship.logo}</div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {internship.title}
              </h3>
              <p className="text-lg text-blue-600 font-semibold">
                {internship.company}
              </p>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-sm text-gray-600">
                  📍 {internship.location}
                </span>
                {internship.remote && (
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                    Remote
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end space-y-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  internship.status
                )}`}>
                {internship.status.charAt(0).toUpperCase() +
                  internship.status.slice(1)}
              </span>
              {internship.isApplied && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Applied
                </span>
              )}
              {internship.result && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {internship.result}
                </span>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-700 mb-4">{internship.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-500">Duration</p>
              <p className="text-sm font-medium">{internship.duration}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Stipend</p>
              <p className="text-sm font-medium text-green-600">
                {internship.stipend}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Type</p>
              <p className="text-sm font-medium">{internship.type}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Start Date</p>
              <p className="text-sm font-medium">
                {new Date(internship.startDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Technologies</p>
            <div className="flex flex-wrap gap-2">
              {internship.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Requirements</p>
            <ul className="text-sm text-gray-700 space-y-1">
              {internship.requirements.map((req, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  {req}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              {internship.status === "available" && (
                <span>
                  Apply by:{" "}
                  {new Date(
                    internship.applicationDeadline
                  ).toLocaleDateString()}
                </span>
              )}
              <span className="ml-4">
                Posted: {new Date(internship.postedDate).toLocaleDateString()}
              </span>
            </div>

            <div className="flex space-x-2">
              {internship.status === "available" && (
                <>
                  {internship.isApplied ? (
                    <button
                      onClick={() => handleWithdraw(internship.id)}
                      className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700">
                      Withdraw
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApply(internship.id)}
                      disabled={!isApplicationOpen(internship)}
                      className={`px-4 py-2 text-sm rounded-lg ${
                        isApplicationOpen(internship)
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}>
                      {isApplicationOpen(internship)
                        ? "Apply Now"
                        : "Applications Closed"}
                    </button>
                  )}
                </>
              )}

              <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200">
                View Details
              </button>

              <button className="px-4 py-2 bg-green-100 text-green-700 text-sm rounded-lg hover:bg-green-200">
                Save
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
        <h2 className="text-2xl font-bold text-gray-800">Internships</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search internships..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Post Internship
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <select
          value={filters.location}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, location: e.target.value }))
          }
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Locations</option>
          <option value="bangalore">Bangalore</option>
          <option value="mumbai">Mumbai</option>
          <option value="hyderabad">Hyderabad</option>
          <option value="delhi">Delhi</option>
        </select>

        <select
          value={filters.duration}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, duration: e.target.value }))
          }
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Durations</option>
          <option value="3 months">3 months</option>
          <option value="4 months">4 months</option>
          <option value="6 months">6 months</option>
        </select>

        <input
          type="text"
          placeholder="Company"
          value={filters.company}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, company: e.target.value }))
          }
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={() =>
            setFilters({ location: "", duration: "", stipend: "", company: "" })
          }
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
          Clear Filters
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 overflow-x-auto">
        {[
          { id: "all", label: "All", count: internships.length },
          {
            id: "available",
            label: "Available",
            count: internships.filter((i) => i.status === "available").length,
          },
          {
            id: "ongoing",
            label: "Ongoing",
            count: internships.filter((i) => i.status === "ongoing").length,
          },
          {
            id: "completed",
            label: "Completed",
            count: internships.filter((i) => i.status === "completed").length,
          },
          {
            id: "applied",
            label: "My Applications",
            count: internships.filter((i) => i.isApplied).length,
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

      {/* Internships List */}
      <div className="space-y-6">
        {getFilteredInternships().length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <span className="text-6xl mb-4 block">💼</span>
            <p className="text-xl mb-2">No internships found</p>
            <p className="text-sm">
              {searchTerm || Object.values(filters).some((f) => f)
                ? "Try adjusting your search or filters"
                : "Check back later for new opportunities"}
            </p>
          </div>
        ) : (
          getFilteredInternships().map(renderInternshipCard)
        )}
      </div>

      {/* Stats */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Your Internship Journey
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {internships.filter((i) => i.isApplied).length}
            </p>
            <p className="text-sm text-gray-600">Applications</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {
                internships.filter((i) => i.status === "ongoing" && i.isApplied)
                  .length
              }
            </p>
            <p className="text-sm text-gray-600">Ongoing</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              {internships.filter((i) => i.result).length}
            </p>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">
              {internships.filter((i) => i.status === "available").length}
            </p>
            <p className="text-sm text-gray-600">Available</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Internships;
