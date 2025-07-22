import { Link } from "react-router-dom";

const Navbar = ({ onLogin, onRegister }) => (
  <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
    <h1 className="text-xl font-bold text-blue-600">UniConnect</h1>
    <div className="space-x-4">
      <Link to="/" className="hover:text-blue-500">Home</Link>
      <Link to="#about" className="hover:text-blue-500">About</Link>
      <Link to="#contact" className="hover:text-blue-500">Contact</Link>
      <button className="text-blue-600 font-semibold bg-transparent border-0" onClick={onLogin}>Login</button>
      <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={onRegister}>Register</button>
    </div>
  </nav>
);

export default Navbar;