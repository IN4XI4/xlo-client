import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { Navigation } from './components/Navigation'
import { Footer } from './components/Footer'
import { TopicStoriesPage } from './pages/TopicStoriesPage'
import { StoryPage } from './pages/StoryPage'
import { ProfilePage } from './pages/ProfilePage'
import { MyNewStoriesPage } from './pages/MyNewStoriesPage'
import { AppStateProvider } from './context/ScrollContext'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" />;
  }
  return children;
}
function App() {
  const token = localStorage.getItem("token");
  return (
    <BrowserRouter>
      <AppStateProvider>
        <div className="flex flex-col min-h-screen bg-gray-50">
          {token && <Navigation />}
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/topic/:id" element={<ProtectedRoute><TopicStoriesPage /></ProtectedRoute>} />
              <Route path="/story/:id" element={<ProtectedRoute><StoryPage /></ProtectedRoute>} />
              <Route path="/profile/" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/new-stories/" element={<ProtectedRoute><MyNewStoriesPage key="mystories-page" /></ProtectedRoute>} />
            </Routes>
          </div>
          {token && <Footer />}
        </div>
      </AppStateProvider>
    </BrowserRouter>
  )
}

export default App