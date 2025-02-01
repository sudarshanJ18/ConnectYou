import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './pages/login';
import Signup from './pages/Signup';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import '@fortawesome/fontawesome-free/css/all.min.css';

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
