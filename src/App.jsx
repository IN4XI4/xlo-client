import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import ReactGA from "react-ga4";

import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage';
import { TopicStoriesPage } from './pages/TopicStoriesPage'
import { StoryPage } from './pages/StoryPage'
import { ProfilePage } from './pages/ProfilePage'
import { MyNewStoriesPage } from './pages/MyNewStoriesPage'
import { MyCreatedStoriesPage } from './pages/MyCreatedStoriesPage'
import { CreateStoryPage } from './pages/CreateStoryPage'
import { RecallsPage } from './pages/RecallsPage'
import { EditStoryPage } from './pages/EditStoryPage'
import { LearnSoftSkillsPage } from './pages/LearnSoftSkillsPage'
import { LearningProgramPage } from './pages/LearningProgramPage'
import { FocusedRecallBlocksPage } from './pages/FocusedRecallBlocksPage';
import { SparkedRecallBlocksPage } from './pages/SparkedRecallBlocksPage';
import { AvatarPage } from './pages/AvatarPage';
import { BadgeUpdateModal } from './components/modals/BadgesUpdateModal';
import { Navigation } from './components/Navigation'
import { Footer } from './components/Footer'
import { AppStateProvider } from './context/ScrollContext'
import useBeforeInstallPrompt from './hooks/UseBeforeInstallPrompt';
import { checkNewDay } from './utils/checkNewDay';


const isProduction = import.meta.env.VITE_ENV === 'production';
if (isProduction) {
  ReactGA.initialize('G-RNZFYR8DPV');
}

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
  const normalizedPath = location.pathname.replace(/\/$/, "");

  if (
    normalizedPath === "/login" ||
    normalizedPath === "/recall-cards" ||
    normalizedPath.startsWith("/practice-softskills")
  ) {
    return null;
  }

  return <Footer />;
}

function ConditionalNavigationBar() {
  const location = useLocation();
  const normalizedPath = location.pathname.replace(/\/$/, "");

  if (normalizedPath === "/login") {
    return null;
  }

  return <Navigation />;
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
  const deferredPrompt = useBeforeInstallPrompt();
  const [isInstallable, setIsInstallable] = useState(false);
  const [newBadges, setNewBadges] = useState([]);

  useEffect(() => {
    if (isProduction) {
      ReactGA.send({ hitType: "pageview", page: location.pathname, title: title });
    }
  }, [location]);

  useEffect(() => {
    if (deferredPrompt) {
      setIsInstallable(true);
    }
  }, [deferredPrompt]);

  useEffect(() => {
    checkNewDay(setNewBadges);
  }, []);

  const handleCloseModal = () => {
    setNewBadges([]);
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      console.log('Prompting installation...');
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
    } else {
      console.log('No deferred prompt available');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {newBadges.length > 0 && <BadgeUpdateModal badges={newBadges} onClose={handleCloseModal} />}
      <ConditionalNavigationBar />
      <div className="flex-grow">
        {isInstallable && (
          <button onClick={handleInstallClick}
            className="fixed bottom-4 right-4 z-40 p-2 border-2 rounded-lg border-[#3DB1FF] text-[#3DB1FF] shadow bg-white">
            Install App
          </button>
        )}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login/" element={<LoginPage />} />
          <Route path="/topic/:slug" element={<TopicStoriesPage />} />
          <Route path="/story/:slug" element={<StoryPage />} />
          <Route path="/profile/" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/avatar/" element={<ProtectedRoute><AvatarPage /></ProtectedRoute>} />
          <Route path="/new-stories/" element={<ProtectedRoute><MyNewStoriesPage key="mystories-page" /></ProtectedRoute>} />
          <Route path="/my-stories/" element={<ProtectedRoute><MyCreatedStoriesPage key="my-createdstories-page" /></ProtectedRoute>} />
          <Route path="/recall-cards/" element={<ProtectedRoute><RecallsPage key="recalls-page" /></ProtectedRoute>} />
          <Route path="/recall-blocks-focused/" element={<ProtectedRoute><FocusedRecallBlocksPage key="recalls-block-page" /></ProtectedRoute>} />
          <Route path="/recall-blocks-sparked/" element={<ProtectedRoute><SparkedRecallBlocksPage key="recalls-block-page-sparked" /></ProtectedRoute>} />
          <Route path="/create-story/:id/:slug" element={<ProtectedRoute><CreateStoryPage key="create-story-page" /></ProtectedRoute>} />
          <Route path="/edit-story/:id" element={<ProtectedRoute><EditStoryPage key="edit-story-page" /></ProtectedRoute>} />
          <Route path="/learn-softskills/" element={<ProtectedRoute><LearnSoftSkillsPage key="learn-page" /></ProtectedRoute>} />
          <Route path="/practice-softskills/:softskill"
            element={<ProtectedRoute><LearningProgramPage key="practice-page" /></ProtectedRoute>} />
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