import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import { useState } from "react";

const Landing = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Register form state
  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    password: "",
    college: "",
    branch: "",
    year: "",
    isWorking: "",
    company: "",
    role: "",
  });
  const [showAlumniFields, setShowAlumniFields] = useState(false);
  const [showWorkFields, setShowWorkFields] = useState(false);

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Handle Register form changes
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
    if (name === "year") {
      setShowAlumniFields(value === "Alumni");
      if (value !== "Alumni") {
        setShowWorkFields(false);
        setRegisterData((prev) => ({ ...prev, isWorking: "", company: "", role: "" }));
      }
    }
    if (name === "isWorking") {
      setShowWorkFields(value === "yes");
      if (value !== "yes") {
        setRegisterData((prev) => ({ ...prev, company: "", role: "" }));
      }
    }
  };

  // Handle Login form changes
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Register submit (placeholder)
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Registered successfully!');
        setShowRegister(false);
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (err) {
      alert('Server error');
    }
  };

  // Handle Login submit (placeholder)
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);

        // Redirect based on role/year
        if (data.user.year === 'Alumni') {
          window.location.href = '/dashboard/alumni';
        } else {
          window.location.href = '/dashboard/student';
        }
        setShowLogin(false);
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (err) {
      alert('Server error');
    }
  };

  return (
  <div>
      <Navbar onLogin={() => setShowLogin(true)} onRegister={() => setShowRegister(true)} />
      <Hero onRegister={() => setShowRegister(true)} />
    <About />
    <Contact />
    <Footer />

      {/* Register Modal */}
      <div className={`modal fade${showRegister ? ' show d-block' : ''}`} tabIndex="-1" style={{ background: showRegister ? 'rgba(0,0,0,0.5)' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Register</h5>
              <button type="button" className="btn-close" onClick={() => setShowRegister(false)}></button>
            </div>
            <form onSubmit={handleRegisterSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-control" name="fullName" value={registerData.fullName} onChange={handleRegisterChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" name="email" value={registerData.email} onChange={handleRegisterChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input type="password" className="form-control" name="password" value={registerData.password} onChange={handleRegisterChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">College</label>
                  <input type="text" className="form-control" name="college" value={registerData.college} onChange={handleRegisterChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Branch</label>
                  <select className="form-select" name="branch" value={registerData.branch} onChange={handleRegisterChange} required>
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
                <div className="mb-3">
                  <label className="form-label">Year</label>
                  <select className="form-select" name="year" value={registerData.year} onChange={handleRegisterChange} required>
                    <option value="">Select Year</option>
                    <option value="1st">1st</option>
                    <option value="2nd">2nd</option>
                    <option value="3rd">3rd</option>
                    <option value="4th">4th</option>
                    <option value="Alumni">Alumni</option>
                  </select>
                </div>
                {showAlumniFields && (
                  <div className="mb-3">
                    <label className="form-label">Are you working?</label>
                    <select className="form-select" name="isWorking" value={registerData.isWorking} onChange={handleRegisterChange} required>
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                )}
                {showAlumniFields && showWorkFields && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Company Name</label>
                      <input type="text" className="form-control" name="company" value={registerData.company} onChange={handleRegisterChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Role</label>
                      <input type="text" className="form-control" name="role" value={registerData.role} onChange={handleRegisterChange} required />
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowRegister(false)}>Close</button>
                <button type="submit" className="btn btn-primary">Register</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <div className={`modal fade${showLogin ? ' show d-block' : ''}`} tabIndex="-1" style={{ background: showLogin ? 'rgba(0,0,0,0.5)' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Login</h5>
              <button type="button" className="btn-close" onClick={() => setShowLogin(false)}></button>
            </div>
            <form onSubmit={handleLoginSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Email or Username</label>
                  <input type="text" className="form-control" name="email" value={loginData.email} onChange={handleLoginChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input type="password" className="form-control" name="password" value={loginData.password} onChange={handleLoginChange} required />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowLogin(false)}>Close</button>
                <button type="submit" className="btn btn-primary">Login</button>
              </div>
            </form>
          </div>
        </div>
      </div>
  </div>
);
};

export default Landing;