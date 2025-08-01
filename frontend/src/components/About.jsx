import { useTheme } from "../contexts/ThemeContext";

const About = () => {
  const { isDarkMode } = useTheme();

  return (
    <section
      id="about"
      className={`py-16 px-8 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
      <h3
        className={`text-2xl font-semibold mb-4 ${
          isDarkMode ? "text-blue-400" : "text-blue-800"
        }`}>
        About UniConnect
      </h3>
      <p
        className={`leading-relaxed max-w-3xl mx-auto ${
          isDarkMode ? "text-gray-300" : "text-gray-700"
        }`}>
        UniConnect is a student-alumni networking platform designed to bridge
        the gap between students and graduates. Whether it's mentorship, job
        referrals, or sharing opportunities — UniConnect creates a dynamic
        academic ecosystem.
      </p>
    </section>
  );
};

export default About;
