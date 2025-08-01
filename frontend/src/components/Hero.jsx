import { useTheme } from "../contexts/ThemeContext";

const Hero = ({ onRegisterClick }) => {
  const { isDarkMode } = useTheme();

  return (
    <section
      className={`text-center py-20 ${
        isDarkMode ? "bg-gray-800" : "bg-blue-50"
      }`}>
      <h2
        className={`text-4xl font-bold ${
          isDarkMode ? "text-blue-400" : "text-blue-800"
        }`}>
        Connecting Students & Alumni for a Brighter Future
      </h2>
      <p className={`mt-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
        Build professional connections, mentorships, and careers.
      </p>
      <button
        onClick={onRegisterClick}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700">
        Get Started
      </button>
    </section>
  );
};

export default Hero;
