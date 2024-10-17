import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/login';
import Signup from './pages/Signup';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import '@fortawesome/fontawesome-free/css/all.min.css';


const App = () => {
  const location = useLocation(); // Get the current location

  // Determine if the Footer should be hidden based on the current path
  const shouldShowFooter = !['/login', '/signup'].includes(location.pathname);

  return (
    <div>
      <Header />
      {/* Conditionally render Routes */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>

      {/* Conditionally render the Footer */}
      {shouldShowFooter && <Footer />}
    </div>
  );
};

const AppWithRouter = () => (
  <Router>
    <App />
  </Router>
);

export default AppWithRouter;
