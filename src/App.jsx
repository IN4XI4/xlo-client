import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { Navigation } from './components/Navigation'
import { Footer } from './components/Footer'
import { TopicStoriesPage } from './pages/TopicStoriesPage'
import { StoryPage } from './pages/StoryPage'
import { ProfilePage } from './pages/ProfilePage'
import { MyNewStoriesPage } from './pages/MyNewStoriesPage'
import { AppStateProvider } from './context/ScrollContext'


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
              <Route path="/topic/:id" element={<TopicStoriesPage />} />
              <Route path="/story/:id" element={<StoryPage />} />
              <Route path="/profile/" element={<ProfilePage />} />
              <Route path="/new-stories/" element={<MyNewStoriesPage key="mystories-page" />} />
            </Routes>
          </div>
          {token && <Footer />}
        </div>
      </AppStateProvider>
    </BrowserRouter>
  )
}

export default App