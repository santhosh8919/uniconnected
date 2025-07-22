import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import StudentDashboard from "./pages/StudentDashboard";
import AlumniDashboard from "./pages/AlumniDashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard/student" element={<StudentDashboard />} />
      <Route path="/dashboard/alumni" element={<AlumniDashboard />} />
    </Routes>
  );
}