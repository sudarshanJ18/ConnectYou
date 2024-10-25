import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login';  // Ensure correct import paths
import Signup from './pages/Signup';
import Dashboard from './components/Dashboard'; // Dashboard component
import LandingPage from './components/LandingPage';
import '@fortawesome/fontawesome-free/css/all.min.css';


const App = () => {
  return (
    <div>
      {/* Conditionally render Routes */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login togglePage={() => {/* Logic to switch to Signup */}} />} /> {/* Pass toggle function */}
        <Route path="/signup" element={<Signup togglePage={() => {/* Logic to switch to Login */}} />} /> {/* Pass toggle function */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* Add Dashboard route */}
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
