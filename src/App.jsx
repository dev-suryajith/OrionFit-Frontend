import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginRegister from './pages/LoginRegister'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/login' element={<LoginRegister />} />
        <Route path='/register' element={<LoginRegister register />} />
      </Routes>
    </>
  )
}

export default App