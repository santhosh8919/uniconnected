import { Link } from "react-router-dom";

const Hero = () => (
  <section className="text-center py-20 bg-blue-50">
    <h2 className="text-4xl font-bold text-blue-800">
      Connecting Students & Alumni for a Brighter Future
    </h2>
    <p className="text-gray-600 mt-4">
      Build professional connections, mentorships, and careers.
    </p>
    <Link to="/register">
      <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700">
        Get Started
      </button>
    </Link>
  </section>
);

export default Hero;