import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { Navigation } from './components/Navigation'
import { Footer } from './components/Footer'


function App() {
  const token = localStorage.getItem("token");
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-gray-50">
      {token && <Navigation />}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </div>
        {token && <Footer />}
      </div>
    </BrowserRouter>
  )
}

export default App