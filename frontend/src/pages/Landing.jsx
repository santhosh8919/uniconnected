import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

const Landing = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const { isDarkMode } = useTheme();

  const handleLoginClick = () => {
    setIsLoginOpen(true);
    setIsRegisterOpen(false);
  };

  const handleRegisterClick = () => {
    setIsRegisterOpen(true);
    setIsLoginOpen(false);
  };

  const handleCloseModals = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
  };

  return (
    <div
      className={
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }>
      <Navbar
        onLoginClick={handleLoginClick}
        onRegisterClick={handleRegisterClick}
      />
      <Hero onRegisterClick={handleRegisterClick} />
      <About />
      <Contact />
      <Footer />

      <LoginForm
        isOpen={isLoginOpen}
        onClose={handleCloseModals}
        onSwitchToRegister={handleRegisterClick}
      />
      <RegisterForm isOpen={isRegisterOpen} onClose={handleCloseModals} />
    </div>
  );
};

export default Landing;
