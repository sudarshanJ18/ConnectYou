import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Signup from './pages/Signup';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import '@fortawesome/fontawesome-free/css/all.min.css';

// General Pages
import AIAssistantPage from "./pages/Dashboard/AIAssistantPage";
import ELearningPage from "./pages/Dashboard/ELearningPage";
import JobsPage from "./pages/Dashboard/JobsPage";
import MentorPage from "./pages/Dashboard/MentorPage";
import MessagesPage from "./pages/Dashboard/MessagesPage";
import OpenProjectsPage from "./pages/Dashboard/OpenProjectsPage";
import WorkshopsPage from "./pages/Dashboard/WorkshopsPage";
import ProfilePage from "./pages/Dashboard/ProfilePage";
import EventsPage from "./pages/Dashboard/EventsPage";

// Alumni Dashboard Pages
import AlumniDashboard from './pages/Dashboard/AlumniDashboard';
import AlumniMentorship from './pages/Dashboard/AlumniMentorship';
import AlumniJobPostings from './pages/Dashboard/AlumniJobPostings';
import AlumniKnowledge from './pages/Dashboard/AlumniKnowledge';
import AlumniEvents from './pages/Dashboard/AlumniEvents';
import AlumniMessages from './pages/Dashboard/AlumniMessages';
import AlumniProfile from './pages/Dashboard/AlumniProfile';
import AlumniAIAssistant from './pages/Dashboard/AlumniAIAssistant';

const App = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Main Dashboard */}
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/e-learning" element={<ELearningPage />} />
      <Route path="/mentorship" element={<MentorPage />} />
      <Route path="/jobs" element={<JobsPage />} />
      <Route path="/messages" element={<MessagesPage />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/open-projects" element={<OpenProjectsPage />} />
      <Route path="/ai-assistant" element={<AIAssistantPage />} />
      <Route path="/workshops" element={<WorkshopsPage />} />
      <Route path="/profile" element={<ProfilePage />} />

      {/* Alumni Dashboard Routes */}
      <Route path="/alumni" element={<AlumniDashboard />} />
      <Route path="/alumni/mentorship" element={<AlumniMentorship />} />
      <Route path="/alumni/job-postings" element={<AlumniJobPostings />} />
      <Route path="/alumni/knowledge" element={<AlumniKnowledge />} />
      <Route path="/alumni/events" element={<AlumniEvents />} />
      <Route path="/alumni/messages" element={<AlumniMessages />} />
      <Route path="/alumni/ai-assistant" element={<AlumniAIAssistant />} />
      <Route path="/alumni/profile" element={<AlumniProfile />} />
    </Routes>
  );
};

export default App;