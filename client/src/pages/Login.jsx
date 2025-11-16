import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminLogin, adminRegister } from '../api'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!username || !password) {
      setError('Username and password required')
      return
    }

    try {
      if (isRegister) {
        // Call register endpoint
        const reg = await adminRegister(username, password)
        if (reg && reg.message) {
          // After successful registration, auto-login
          const loginRes = await adminLogin(username, password)
          if (loginRes && loginRes.token) {
            onLogin(loginRes.token)
            navigate('/admin')
            return
          }
        }
        setError(reg?.error || 'Registration failed')
        return
      }

      // Login flow
      const result = await adminLogin(username, password)
      if (!result || !result.token) {
        setError('Invalid credentials')
        return
      }

      onLogin(result.token)
      navigate('/admin')
    } catch (err) {
      setError('Server error')
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '40px auto' }}>
      <h2>{isRegister ? 'Admin Register' : 'Admin Login'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Username: </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>
          {isRegister ? 'Register' : 'Login'}
        </button>
      </form>
      <p>
        {isRegister ? 'Already have an account? ' : 'Need an account? '}
        <button
          onClick={() => setIsRegister(!isRegister)}
          style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}
        >
          {isRegister ? 'Login' : 'Register'}
        </button>
      </p>
      <p style={{ fontSize: 12, color: '#666' }}>
        Tip: Use this form to register first, then login.
      </p>
    </div>
  )
}
