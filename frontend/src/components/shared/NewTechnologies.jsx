import React, { useState } from "react";

const NewTechnologies = () => {
  const [activeTab, setActiveTab] = useState("trending");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [technologies, setTechnologies] = useState([
    {
      id: 1,
      name: "Next.js 14",
      category: "Web Development",
      description:
        "React framework with App Router, Server Components, and improved performance",
      popularity: 95,
      trendScore: 8.5,
      releasedDate: "2023-10-26",
      tags: ["React", "Full-stack", "SSR", "Performance"],
      difficulty: "Intermediate",
      learningResources: [
        { type: "Official Docs", url: "https://nextjs.org/docs", rating: 5 },
        { type: "Video Course", url: "#", rating: 4.8 },
        { type: "Tutorial", url: "#", rating: 4.5 },
      ],
      jobDemand: "High",
      companiesUsing: ["Vercel", "Netflix", "Uber"],
      githubStars: "118k",
      isBookmarked: false,
      communitySize: "Large",
      updates: [
        { date: "2024-01-15", title: "Performance improvements in App Router" },
        { date: "2024-02-10", title: "New caching strategies introduced" },
      ],
    },
    {
      id: 2,
      name: "Bun",
      category: "Runtime",
      description:
        "Fast all-in-one JavaScript runtime with bundler, test runner, and package manager",
      popularity: 78,
      trendScore: 9.2,
      releasedDate: "2023-09-08",
      tags: ["JavaScript", "Runtime", "Performance", "Bundler"],
      difficulty: "Beginner",
      learningResources: [
        { type: "Official Docs", url: "https://bun.sh/docs", rating: 4.7 },
        { type: "Getting Started", url: "#", rating: 4.5 },
        { type: "Comparison Guide", url: "#", rating: 4.3 },
      ],
      jobDemand: "Growing",
      companiesUsing: ["Discord", "Railway", "Supabase"],
      githubStars: "67k",
      isBookmarked: true,
      communitySize: "Medium",
      updates: [
        { date: "2024-01-20", title: "Windows support improved" },
        { date: "2024-02-05", title: "Better Node.js compatibility" },
      ],
    },
    {
      id: 3,
      name: "Astro 4.0",
      category: "Web Development",
      description:
        "Static site generator with island architecture and content collections",
      popularity: 65,
      trendScore: 7.8,
      releasedDate: "2023-12-05",
      tags: ["Static Sites", "Performance", "Multi-framework", "JAMstack"],
      difficulty: "Intermediate",
      learningResources: [
        { type: "Official Docs", url: "https://docs.astro.build", rating: 4.9 },
        { type: "Tutorial Series", url: "#", rating: 4.6 },
        { type: "Examples", url: "#", rating: 4.4 },
      ],
      jobDemand: "Medium",
      companiesUsing: ["The Guardian", "Firebase", "Google"],
      githubStars: "41k",
      isBookmarked: false,
      communitySize: "Growing",
      updates: [
        { date: "2024-01-10", title: "Dev toolbar enhancements" },
        { date: "2024-02-15", title: "Internationalization improvements" },
      ],
    },
    {
      id: 4,
      name: "Tauri 2.0",
      category: "Desktop Development",
      description:
        "Build smaller, faster, and more secure desktop applications with web technologies",
      popularity: 72,
      trendScore: 8.1,
      releasedDate: "2024-01-15",
      tags: ["Desktop", "Rust", "Cross-platform", "Security"],
      difficulty: "Advanced",
      learningResources: [
        {
          type: "Official Guide",
          url: "https://tauri.app/v1/guides/",
          rating: 4.6,
        },
        { type: "Examples", url: "#", rating: 4.3 },
        { type: "Community Guide", url: "#", rating: 4.1 },
      ],
      jobDemand: "Growing",
      companiesUsing: ["1Password", "Splice", "Whisk"],
      githubStars: "76k",
      isBookmarked: true,
      communitySize: "Medium",
      updates: [
        { date: "2024-01-15", title: "Mobile support (iOS/Android)" },
        { date: "2024-02-01", title: "Improved plugin system" },
      ],
    },
    {
      id: 5,
      name: "Drizzle ORM",
      category: "Database",
      description:
        "TypeScript ORM with zero runtime overhead and excellent type safety",
      popularity: 58,
      trendScore: 8.7,
      releasedDate: "2023-07-20",
      tags: ["TypeScript", "ORM", "Type Safety", "Performance"],
      difficulty: "Intermediate",
      learningResources: [
        {
          type: "Documentation",
          url: "https://orm.drizzle.team/",
          rating: 4.7,
        },
        { type: "Quick Start", url: "#", rating: 4.5 },
        { type: "Migration Guide", url: "#", rating: 4.2 },
      ],
      jobDemand: "Medium",
      companiesUsing: ["PlanetScale", "Neon", "Turso"],
      githubStars: "19k",
      isBookmarked: false,
      communitySize: "Growing",
      updates: [
        { date: "2024-01-25", title: "MySQL support improvements" },
        { date: "2024-02-12", title: "Better schema introspection" },
      ],
    },
    {
      id: 6,
      name: "Ollama",
      category: "AI/ML",
      description:
        "Run large language models locally with easy setup and management",
      popularity: 89,
      trendScore: 9.5,
      releasedDate: "2023-06-15",
      tags: ["AI", "LLM", "Local", "Open Source"],
      difficulty: "Beginner",
      learningResources: [
        {
          type: "GitHub Readme",
          url: "https://github.com/ollama/ollama",
          rating: 4.8,
        },
        { type: "Model Library", url: "#", rating: 4.6 },
        { type: "Integration Guide", url: "#", rating: 4.4 },
      ],
      jobDemand: "Very High",
      companiesUsing: [
        "Various Startups",
        "Research Labs",
        "Individual Developers",
      ],
      githubStars: "52k",
      isBookmarked: true,
      communitySize: "Large",
      updates: [
        { date: "2024-02-01", title: "New model formats support" },
        { date: "2024-02-20", title: "Performance optimizations" },
      ],
    },
  ]);

  const [bookmarks, setBookmarks] = useState([]);
  const [learningPath, setLearningPath] = useState([
    {
      id: 1,
      technology: "Next.js 14",
      status: "in-progress",
      progress: 65,
      startDate: "2025-07-01",
      estimatedCompletion: "2025-08-15",
      currentTopic: "Server Components",
      resources: ["Official Docs", "Video Course"],
      timeSpent: "24 hours",
    },
    {
      id: 2,
      technology: "Ollama",
      status: "planned",
      progress: 0,
      startDate: null,
      estimatedCompletion: "2025-09-01",
      currentTopic: "Getting Started",
      resources: ["GitHub Readme"],
      timeSpent: "0 hours",
    },
  ]);

  const categories = [
    "all",
    "Web Development",
    "AI/ML",
    "Database",
    "Runtime",
    "Desktop Development",
    "Mobile",
  ];

  const handleBookmark = (id) => {
    setTechnologies((prev) =>
      prev.map((tech) =>
        tech.id === id ? { ...tech, isBookmarked: !tech.isBookmarked } : tech
      )
    );
  };

  const addToLearningPath = (technology) => {
    const newPath = {
      id: learningPath.length + 1,
      technology: technology.name,
      status: "planned",
      progress: 0,
      startDate: null,
      estimatedCompletion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      currentTopic: "Getting Started",
      resources: technology.learningResources.map((r) => r.type),
      timeSpent: "0 hours",
    };
    setLearningPath((prev) => [...prev, newPath]);
  };

  const getFilteredTechnologies = () => {
    let filtered = technologies;

    if (activeTab === "bookmarked") {
      filtered = technologies.filter((tech) => tech.isBookmarked);
    } else if (activeTab === "learning") {
      const learningTechs = learningPath.map((lp) => lp.technology);
      filtered = technologies.filter((tech) =>
        learningTechs.includes(tech.name)
      );
    }

    filtered = filtered.filter((tech) => {
      const matchesSearch =
        tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tech.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tech.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === "all" || tech.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // Sort by trend score for trending tab
    if (activeTab === "trending") {
      filtered.sort((a, b) => b.trendScore - a.trendScore);
    }

    return filtered;
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

  const getJobDemandColor = (demand) => {
    switch (demand) {
      case "Very High":
        return "bg-red-100 text-red-800";
      case "High":
        return "bg-orange-100 text-orange-800";
      case "Growing":
        return "bg-blue-100 text-blue-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderTechnologyCard = (tech) => (
    <div
      key={tech.id}
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-xl font-bold text-gray-900">{tech.name}</h3>
            <button
              onClick={() => handleBookmark(tech.id)}
              className={`text-2xl ${
                tech.isBookmarked
                  ? "text-yellow-500"
                  : "text-gray-400 hover:text-yellow-500"
              }`}>
              {tech.isBookmarked ? "⭐" : "☆"}
            </button>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
              {tech.category}
            </span>
            <span
              className={`px-2 py-1 text-xs rounded ${getDifficultyColor(
                tech.difficulty
              )}`}>
              {tech.difficulty}
            </span>
            <span
              className={`px-2 py-1 text-xs rounded ${getJobDemandColor(
                tech.jobDemand
              )}`}>
              {tech.jobDemand} Demand
            </span>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center space-x-1 mb-1">
            <span className="text-sm text-gray-600">Trend Score:</span>
            <span className="font-bold text-blue-600">
              {tech.trendScore}/10
            </span>
          </div>
          <div className="text-xs text-gray-500">
            ⭐ {tech.githubStars} stars
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-700 mb-4">{tech.description}</p>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">Popularity</span>
          <span className="text-xs text-gray-600">{tech.popularity}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full"
            style={{ width: `${tech.popularity}%` }}></div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2">Technologies</p>
        <div className="flex flex-wrap gap-1">
          {tech.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
        <div>
          <p className="text-gray-500">Released</p>
          <p className="font-medium">
            {new Date(tech.releasedDate).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Community</p>
          <p className="font-medium">{tech.communitySize}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2">Learning Resources</p>
        <div className="space-y-1">
          {tech.learningResources.slice(0, 2).map((resource, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-xs">
              <span className="text-blue-600 hover:underline cursor-pointer">
                {resource.type}
              </span>
              <div className="flex items-center">
                <span className="text-yellow-500">★</span>
                <span className="ml-1 text-gray-600">{resource.rating}</span>
              </div>
            </div>
          ))}
          {tech.learningResources.length > 2 && (
            <div className="text-xs text-blue-600 hover:underline cursor-pointer">
              +{tech.learningResources.length - 2} more resources
            </div>
          )}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2">Companies Using</p>
        <p className="text-xs text-gray-700">
          {tech.companiesUsing.join(", ")}
        </p>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => addToLearningPath(tech)}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
          Add to Learning Path
        </button>
        <button className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
          View Resources
        </button>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200">
          Compare
        </button>
      </div>
    </div>
  );

  const renderLearningPathItem = (pathItem) => (
    <div
      key={pathItem.id}
      className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">{pathItem.technology}</h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            pathItem.status === "completed"
              ? "bg-green-100 text-green-800"
              : pathItem.status === "in-progress"
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-800"
          }`}>
          {pathItem.status.replace("-", " ")}
        </span>
      </div>

      {pathItem.status !== "planned" && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">Progress</span>
            <span className="text-xs text-gray-600">{pathItem.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${pathItem.progress}%` }}></div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-3 text-xs">
        <div>
          <p className="text-gray-500">Current Topic</p>
          <p className="font-medium">{pathItem.currentTopic}</p>
        </div>
        <div>
          <p className="text-gray-500">Time Spent</p>
          <p className="font-medium">{pathItem.timeSpent}</p>
        </div>
      </div>

      <div className="flex space-x-2">
        {pathItem.status === "planned" ? (
          <button className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
            Start Learning
          </button>
        ) : (
          <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
            Continue
          </button>
        )}
        <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200">
          Update Progress
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">New Technologies</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search technologies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 overflow-x-auto">
        {[
          { id: "trending", label: "Trending", count: technologies.length },
          {
            id: "bookmarked",
            label: "Bookmarked",
            count: technologies.filter((t) => t.isBookmarked).length,
          },
          {
            id: "learning",
            label: "Learning Path",
            count: learningPath.length,
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

      {/* Content */}
      {activeTab === "learning" ? (
        <div className="space-y-4">
          {learningPath.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <span className="text-6xl mb-4 block">📚</span>
              <p className="text-xl mb-2">No learning path set</p>
              <p className="text-sm">
                Add technologies to your learning path to track progress
              </p>
            </div>
          ) : (
            learningPath.map(renderLearningPathItem)
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {getFilteredTechnologies().length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <span className="text-6xl mb-4 block">🔍</span>
              <p className="text-xl mb-2">No technologies found</p>
              <p className="text-sm">
                {searchTerm || selectedCategory !== "all"
                  ? "Try adjusting your search or filters"
                  : "New technologies will appear here"}
              </p>
            </div>
          ) : (
            getFilteredTechnologies().map(renderTechnologyCard)
          )}
        </div>
      )}

      {/* Stats */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Your Learning Stats
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {technologies.filter((t) => t.isBookmarked).length}
            </p>
            <p className="text-sm text-gray-600">Bookmarked</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {learningPath.filter((lp) => lp.status === "in-progress").length}
            </p>
            <p className="text-sm text-gray-600">Currently Learning</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              {learningPath.filter((lp) => lp.status === "completed").length}
            </p>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">
              {Math.round(
                learningPath.reduce((acc, lp) => acc + lp.progress, 0) /
                  Math.max(learningPath.length, 1)
              )}
              %
            </p>
            <p className="text-sm text-gray-600">Avg Progress</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewTechnologies;
