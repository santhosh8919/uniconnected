import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SocketProvider } from "./contexts/SocketContext";
import Landing from "./pages/Landing";
import StudentDashboard from "./pages/StudentDashboard";
import AlumniDashboard from "./pages/AlumniDashboard";

export default function App() {
  return (
    <ThemeProvider>
      <SocketProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard/student" element={<StudentDashboard />} />
          <Route path="/dashboard/alumni" element={<AlumniDashboard />} />
        </Routes>
      </SocketProvider>
    </ThemeProvider>
  );
}
