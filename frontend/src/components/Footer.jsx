import { useTheme } from "../contexts/ThemeContext";

const Footer = () => {
  const { isDarkMode } = useTheme();

  return (
    <footer
      className={`text-center py-4 border-t ${
        isDarkMode
          ? "bg-gray-800 text-gray-400 border-gray-700"
          : "bg-white text-gray-600 border-gray-200"
      }`}>
      © {new Date().getFullYear()} UniConnect. All rights reserved.
    </footer>
  );
};

export default Footer;
