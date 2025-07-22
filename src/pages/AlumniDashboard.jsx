import { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

const sections = [
  { key: "profile", label: "Profile", icon: "bi-person-circle" },
  { key: "notifications", label: "Notifications", icon: "bi-bell" },
  { key: "connections", label: "Connections", icon: "bi-people" },
  { key: "myRequests", label: "My Requests", icon: "bi-envelope" },
  { key: "following", label: "Following", icon: "bi-person-plus" },
  { key: "followers", label: "Followers", icon: "bi-person-check" },
  { key: "chat", label: "Chat", icon: "bi-chat-dots" },
  { key: "hackathons", label: "Hackathons", icon: "bi-lightning" },
  { key: "internships", label: "Internships", icon: "bi-briefcase" },
  { key: "jobs", label: "Jobs", icon: "bi-briefcase-fill" },
  { key: "newTechnologies", label: "New Technologies", icon: "bi-cpu" },
  { key: "webinars", label: "Webinars", icon: "bi-camera-video" },
];

const defaultUser = {
  name: "Alumni Name",
  email: "alumni@email.com",
  branch: "CSE",
  year: "Alumni",
  image: null,
};

const sectionContent = (
  user,
  editProfile,
  setEditProfile,
  handleImageChange,
  handleSaveProfile,
  branch,
  setBranch,
  year,
  setYear,
  showResults,
  setShowResults,
  searchResults,
  searching,
  handleSearch,
  handleConnect
) => ({
  profile: (
    <div className="text-center">
      <div className="mb-3">
        {user.image ? (
          <img
            src={user.image}
            alt="Profile"
            className="rounded-circle border border-3 border-primary"
            style={{ width: 100, height: 100, objectFit: "cover" }}
          />
        ) : (
          <i className="bi bi-person-circle text-secondary" style={{ fontSize: 100 }}></i>
        )}
      </div>
      <h4 className="fw-bold mb-1">{user.name}</h4>
      <p className="text-muted mb-1">{user.branch}, {user.year}</p>
      <p className="text-muted">{user.email}</p>
      {!editProfile ? (
        <button className="btn btn-outline-primary btn-sm mt-2" onClick={() => setEditProfile(true)}>
          Edit Profile Image
        </button>
      ) : (
        <form className="mt-3" onSubmit={handleSaveProfile}>
          <div className="mb-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="form-control"
            />
          </div>
          <button type="button" className="btn btn-secondary btn-sm me-2" onClick={() => setEditProfile(false)}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary btn-sm">Save</button>
        </form>
      )}
    </div>
  ),
  notifications: <div><h5>Notifications</h5><hr /><p>All your notifications will appear here.</p></div>,
  connections: (
    <div>
      <h5>Connections</h5>
      <hr />
      <form className="row g-2 align-items-end mb-3" onSubmit={handleSearch}>
        <div className="col-md-5">
          <label className="form-label">Branch</label>
          <select className="form-select" value={branch} onChange={e => setBranch(e.target.value)}>
            <option value="">Select Branch</option>
            <option value="CSE">Computer Science and Engineering (CSE)</option>
            <option value="ECE">Electronics and Communication Engineering (ECE)</option>
            <option value="EEE">Electrical and Electronics Engineering (EEE)</option>
            <option value="ME">Mechanical Engineering (ME)</option>
            <option value="CE">Civil Engineering (CE)</option>
            <option value="IT">Information Technology (IT)</option>
            <option value="Chemical">Chemical Engineering</option>
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label">Year</label>
          <select className="form-select" value={year} onChange={e => setYear(e.target.value)}>
            <option value="">Select Year</option>
            <option value="1st">1st</option>
            <option value="2nd">2nd</option>
            <option value="3rd">3rd</option>
            <option value="4th">4th</option>
            <option value="Alumni">Alumni</option>
          </select>
        </div>
        <div className="col-md-3">
          <button type="submit" className="btn btn-primary w-100">Search</button>
        </div>
      </form>
      {searching && <div>Searching...</div>}
      {showResults && (
        <div className="mt-3">
          {searchResults.length === 0 ? (
            <div className="alert alert-info">No users found.</div>
          ) : (
            <ul className="list-group">
              {searchResults.map(user => (
                <li key={user._id} className="list-group-item d-flex align-items-center justify-content-between">
                  <div>
                    <strong>{user.fullName}</strong> ({user.branch}, {user.year})<br />
                    <small>{user.email}</small>
                  </div>
                  <button className="btn btn-outline-primary btn-sm" onClick={() => handleConnect(user._id)}>
                    Connect Request
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  ),
  myRequests: <div><h5>My Requests</h5><hr /><p>View and manage your requests.</p></div>,
  following: <div><h5>Following</h5><hr /><p>People you are following.</p></div>,
  followers: <div><h5>Followers</h5><hr /><p>People who follow you.</p></div>,
  chat: <div><h5>Chat</h5><hr /><p>Chat with your connections.</p></div>,
  hackathons: <div><h5>Hackathons</h5><hr /><p>Find and participate in upcoming hackathons.</p></div>,
  internships: <div><h5>Internships</h5><hr /><p>Explore internship opportunities relevant to your field.</p></div>,
  jobs: <div><h5>Jobs</h5><hr /><p>Browse job openings for alumni.</p></div>,
  newTechnologies: <div><h5>New Technologies</h5><hr /><p>Stay updated with the latest technologies and trends.</p></div>,
  webinars: <div><h5>Webinars</h5><hr /><p>Join webinars to learn from industry experts.</p></div>,
});

const AlumniDashboard = () => {
  const [activeSection, setActiveSection] = useState("profile");
  const [editProfile, setEditProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  // Fetch alumni profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUser({
            name: data.fullName,
            email: data.email,
            branch: data.branch,
            year: data.year,
            image: data.image || null,
          });
        }
      } catch (err) {
        // handle error
      }
    };
    fetchProfile();
  }, []);

  // Handle image upload and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Save profile image (for now, just close edit mode)
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setEditProfile(false);
    if (user.image) {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:5000/api/auth/profile/image', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ image: user.image }),
        });
        if (res.ok) {
          const updatedUser = await res.json();
          setUser((prev) => ({ ...prev, image: updatedUser.image }));
        }
      } catch (err) {
        // handle error
      }
    }
  };

  // Handle search for connections
  const handleSearch = async (e) => {
    e.preventDefault();
    setSearching(true);
    setShowResults(false);
    setSearchResults([]);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/auth/search?branch=${branch}&year=${year}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
        setShowResults(true);
      }
    } catch (err) {
      // handle error
    }
    setSearching(false);
  };

  // Handle connect request
  const handleConnect = async (targetId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/auth/connect/${targetId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert('Request sent!');
      }
    } catch (err) {
      alert('Failed to send request');
    }
  };

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{ background: "linear-gradient(120deg, #f4f6fb 60%, #e3e9f7 100%)" }}>
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">
        <span className="navbar-brand fw-bold fs-4">Alumni Dashboard</span>
        <div className="ms-auto d-flex align-items-center">
          <span className="me-3 text-muted">Hi, {user.name}!</span>
          <button className="btn btn-link position-relative me-2">
            <i className="bi bi-bell fs-5"></i>
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              3
            </span>
          </button>
          <button className="btn btn-link">
            <i className="bi bi-person-circle fs-4"></i>
          </button>
        </div>
      </nav>
      <div className="container-fluid">
        <div className="row flex-nowrap">
          {/* Sidebar */}
          <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark shadow-sm" style={{ minHeight: "90vh" }}>
            <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-4 text-white">
              <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start w-100">
                {sections.map((section) => (
                  <li
                    key={section.key}
                    className={`nav-link w-100 mb-1 d-flex align-items-center ${activeSection === section.key ? "active bg-primary" : "text-white"}`}
                    style={{ cursor: "pointer", borderRadius: "0.5rem", fontWeight: 500 }}
                    onClick={() => setActiveSection(section.key)}
                  >
                    <i className={`bi ${section.icon} me-2 fs-5`}></i>
                    <span className="d-none d-sm-inline">{section.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Main Content */}
          <div className="col py-4 px-4">
            <div className="card shadow-sm border-0" style={{ minHeight: "70vh" }}>
              <div className="card-body">
                {sectionContent(
                  user,
                  editProfile,
                  setEditProfile,
                  handleImageChange,
                  handleSaveProfile,
                  branch,
                  setBranch,
                  year,
                  setYear,
                  showResults,
                  setShowResults,
                  searchResults,
                  searching,
                  handleSearch,
                  handleConnect
                )[activeSection]}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniDashboard; 