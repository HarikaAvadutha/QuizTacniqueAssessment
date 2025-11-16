import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  const result = location.state?.result
  const quizId = location.state?.quizId

  if (!result) {
    return (
      <div>
        <h2>No quiz results found</h2>
        <button onClick={() => navigate('/quizzes')}>Back to Quizzes</button>
      </div>
    )
  }

  const isPassed = result.passed || result.percentage >= 60

  return (
    <div style={{ maxWidth: 600, margin: '40px auto' }}>
      <h2>{result.message}</h2>

      {result.username && (
        <div style={{ marginBottom: 12, textAlign: 'center', color: '#333' }}>
          <strong>Player:</strong> {result.username}
        </div>
      )}

      <div style={{
        fontSize: 48,
        fontWeight: 'bold',
        color: isPassed ? 'green' : 'red',
        marginBottom: 16,
        textAlign: 'center'
      }}>
        {result.percentage}%
      </div>

      <div style={{ fontSize: 20, marginBottom: 24, textAlign: 'center' }}>
        <p>You scored <strong>{result.score}</strong> out of <strong>{result.total}</strong> points</p>
      </div>

      {result.details && result.details.length > 0 && (
        <div style={{ marginBottom: 24, padding: 12, border: '1px solid #ddd', borderRadius: 4 }}>
          <h3>Answer Details</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {result.details.map((detail, idx) => (
              <li key={idx} style={{
                marginBottom: 8,
                padding: 8,
                backgroundColor: detail.isCorrect ? '#e8f5e9' : '#ffebee',
                borderRadius: 4
              }}>
                <strong>Q{idx + 1}:</strong> {detail.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                <span style={{ marginLeft: 12, color: '#666' }}>
                  {detail.pointsEarned}/{detail.pointsEarned || 1} points
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button
          onClick={() => navigate('/quizzes')}
          style={{ padding: '10px 20px', cursor: 'pointer' }}
        >
          Take Another Quiz
        </button>
        {quizId && (
          <button
            onClick={() => navigate(`/quiz/${quizId}/leaderboard`)}
            style={{ padding: '10px 20px', cursor: 'pointer' }}
          >
            View Leaderboard
          </button>
        )}
        <button
          onClick={() => navigate('/')}
          style={{ padding: '10px 20px', cursor: 'pointer' }}
        >
          Back to Home
        </button>
      </div>
    </div>
  )
}
