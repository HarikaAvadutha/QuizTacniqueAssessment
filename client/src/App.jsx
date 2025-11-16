import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import QuizSelector from './pages/QuizSelector'
import TakeQuiz from './pages/TakeQuiz'
import Results from './pages/Results'

export default function App(){
  const [token, setToken] = useState(localStorage.getItem('adminToken'))
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setToken(null)
    navigate('/')
  }

  return (
    <div style={{ padding: 16 }}>
      <nav style={{ marginBottom: 16, display: 'flex', gap: 12, borderBottom: '1px solid #ccc', paddingBottom: 8 }}>
        <Link to="/">Home</Link>
        {token ? (
          <>
            <Link to="/admin">Admin Dashboard</Link>
            <button onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</button>
          </>
        ) : (
          <Link to="/login">Admin Login</Link>
        )}
        <Link to="/quizzes">Take Quiz</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login onLogin={(t) => { setToken(t); localStorage.setItem('adminToken', t) }} />} />
        <Route path="/admin" element={token ? <AdminDashboard token={token} /> : <Login onLogin={(t) => { setToken(t); localStorage.setItem('adminToken', t) }} />} />
        <Route path="/quizzes" element={<QuizSelector />} />
        <Route path="/quiz/:id" element={<TakeQuiz />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </div>
  )
}
