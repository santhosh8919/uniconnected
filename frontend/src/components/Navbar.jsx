import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import DarkModeToggle from "./shared/DarkModeToggle";

const Navbar = ({ onLoginClick, onRegisterClick }) => {
  const { isDarkMode } = useTheme();

  return (
    <nav
      className={`flex justify-between items-center px-6 py-4 shadow-md ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}>
      <h1
        className={`text-xl font-bold ${
          isDarkMode ? "text-blue-400" : "text-blue-600"
        }`}>
        UniConnect
      </h1>
      <div className="flex items-center space-x-4">
        <Link
          to="/"
          className={`hover:${isDarkMode ? "text-blue-400" : "text-blue-500"}`}>
          Home
        </Link>
        <a
          href="#about"
          className={`hover:${isDarkMode ? "text-blue-400" : "text-blue-500"}`}>
          About
        </a>
        <a
          href="#contact"
          className={`hover:${isDarkMode ? "text-blue-400" : "text-blue-500"}`}>
          Contact
        </a>
        <DarkModeToggle />
        <button
          onClick={onLoginClick}
          className={`font-semibold ${
            isDarkMode
              ? "text-blue-400 hover:text-blue-300"
              : "text-blue-600 hover:text-blue-500"
          }`}>
          Login
        </button>
        <button
          onClick={onRegisterClick}
          className={`px-3 py-1 rounded ${
            isDarkMode
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}>
          Register
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
