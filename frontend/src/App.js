import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './pages/login';
import Signup from './pages/Signup';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import '@fortawesome/fontawesome-free/css/all.min.css';
import AIAssistantPage from "./pages/Dashboard/AIAssistantPage";
import ELearningPage from "./pages/Dashboard/ELearningPage";
import JobsPage from "./pages/Dashboard/JobsPage";
import MentorPage from "./pages/Dashboard/MentorPage";
import MessagesPage from "./pages/Dashboard/MessagesPage";
import OpenProjectsPage from "./pages/Dashboard/OpenProjectsPage";
import WorkshopsPage from "./pages/Dashboard/WorkshopsPage";
import ProfilePage from "./pages/Dashboard/ProfilePage";
import EventsPage from "./pages/Dashboard/EventsPage";

const App = () => {
  const navigate = useNavigate();

  // Toggle between Login and Signup pages
  const handleTogglePage = (targetPage) => {
    navigate(targetPage); // Navigate to the desired page (e.g., '/login' or '/signup')
  };

  // Navigate to Dashboard
  const handleNavigateToDashboard = () => {
    navigate('/dashboard'); // Navigate to Dashboard
  };

  return (
    <div>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Login Page with Dashboard navigation */}
        <Route
          path="/login"
          element={
            <Login
              togglePage={() => handleTogglePage('/signup')}
              goToDashboard={handleNavigateToDashboard}
            />
          }
        />

        {/* Signup Page with Login toggle */}
        <Route
          path="/signup"
          element={
            <Signup
              togglePage={() => handleTogglePage('/login')}
              goToDashboard={handleNavigateToDashboard}
            />
          }
        />

        {/* Dashboard Page */}
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/" element={<DashboardContent />} /> */}
              <Route path="/e-learning" element={<ELearningPage />} />
              <Route path="/mentorship" element={<MentorPage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/open-projects" element={<OpenProjectsPage />} />
              <Route path="/ai-assistant" element={<AIAssistantPage />} />
              <Route path="/workshops" element={<WorkshopsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
      </Routes>
    </div>
  );
};

const AppWithRouter = () => (
  <Router>
    <App />
  </Router>
);

export default AppWithRouter;