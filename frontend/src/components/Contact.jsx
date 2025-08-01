import { useTheme } from "../contexts/ThemeContext";

const Contact = () => {
  const { isDarkMode } = useTheme();

  return (
    <section
      id="contact"
      className={`py-16 px-8 ${isDarkMode ? "bg-gray-800" : "bg-blue-50"}`}>
      <h3
        className={`text-2xl font-semibold mb-6 text-center ${
          isDarkMode ? "text-blue-400" : "text-blue-800"
        }`}>
        Contact Us
      </h3>
      <form className="max-w-xl mx-auto space-y-4">
        <input
          type="text"
          placeholder="Name"
          className={`w-full p-2 border rounded ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              : "bg-white border-gray-300 text-gray-900"
          }`}
        />
        <input
          type="email"
          placeholder="Email"
          className={`w-full p-2 border rounded ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              : "bg-white border-gray-300 text-gray-900"
          }`}
        />
        <textarea
          placeholder="Message"
          rows="4"
          className={`w-full p-2 border rounded ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              : "bg-white border-gray-300 text-gray-900"
          }`}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Send Message
        </button>
      </form>
    </section>
  );
};

export default Contact;
