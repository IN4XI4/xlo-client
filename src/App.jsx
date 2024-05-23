import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import ReactGA from "react-ga4";
import { HomePage } from './pages/HomePage'
import { Navigation } from './components/Navigation'
import { Footer } from './components/Footer'
import { TopicStoriesPage } from './pages/TopicStoriesPage'
import { StoryPage } from './pages/StoryPage'
import { ProfilePage } from './pages/ProfilePage'
import { MyNewStoriesPage } from './pages/MyNewStoriesPage'
import { AppStateProvider } from './context/ScrollContext'
import { CreateStoryPage } from './pages/CreateStoryPage'
import { RecallsPage } from './pages/RecallsPage'
import { LearnSoftSkillsPage } from './pages/LearnSoftSkillsPage'
import { LearningProgramPage } from './pages/LearningProgramPage'

ReactGA.initialize('G-RNZFYR8DPV');

function formatTitle(pathname) {
  if (pathname === '/') {
    return 'Mixelo';
  }
  return pathname
    .split('/')
    .filter(Boolean)
    .map(segment => segment.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '))
    .join(' - ');
}

ReactGA.initialize('G-RNZFYR8DPV');

function formatTitle(pathname) {
  if (pathname === '/') {
    return 'Mixelo';
  }
  return pathname
    .split('/')
    .filter(Boolean)
    .map(segment => segment.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '))
    .join(' - ');
}

function ConditionalFooter() {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (
    token &&
    location.pathname !== "/recall-cards/" &&
    !location.pathname.startsWith("/practice-softskills/")
  ) {
    return <Footer />;
  }
  return null;
}

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" />;
  }
  return children;
}
function App() {
  const location = useLocation();
  const title = formatTitle(location.pathname);
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname, title: title });
  }, [location]);

  const token = localStorage.getItem("token");
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {token && <Navigation />}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/topic/:slug" element={<ProtectedRoute><TopicStoriesPage /></ProtectedRoute>} />
          <Route path="/story/:slug" element={<StoryPage />} />
          <Route path="/profile/" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/new-stories/" element={<ProtectedRoute><MyNewStoriesPage key="mystories-page" /></ProtectedRoute>} />
          <Route path="/recall-cards/" element={<ProtectedRoute><RecallsPage key="recalls-page" /></ProtectedRoute>} />
          <Route path="/create-story/:id/:slug" element={<ProtectedRoute><CreateStoryPage key="create-story-page" /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <ConditionalFooter />
    </div>
  );
}

export default function Root() {
  return (
    <BrowserRouter>
      <AppStateProvider>
        <App />
      </AppStateProvider>
    </BrowserRouter>
  );
}