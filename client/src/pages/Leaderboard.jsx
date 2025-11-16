import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getQuizScores, getQuiz } from '../api'

export default function Leaderboard(){
  const { id } = useParams()
  const navigate = useNavigate()
  const [scores, setScores] = useState([])
  const [quiz, setQuiz] = useState(null)

  useEffect(() => {
    load()
  }, [id])

  const load = async () => {
    const q = await getQuiz(id)
    setQuiz(q)
    const s = await getQuizScores(id)
    setScores(s)
  }

  return (
    <div style={{ maxWidth: 800, margin: '24px auto' }}>
      <h2>Leaderboard {quiz ? `- ${quiz.title}` : ''}</h2>
      {scores.length === 0 ? (
        <p>No scores yet. Be the first!</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>
              <th style={{ padding: 8 }}>#</th>
              <th style={{ padding: 8 }}>Name</th>
              <th style={{ padding: 8 }}>Score</th>
              <th style={{ padding: 8 }}>Percentage</th>
              <th style={{ padding: 8 }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((s, idx) => (
              <tr key={s._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: 8 }}>{idx + 1}</td>
                <td style={{ padding: 8 }}>{s.username}</td>
                <td style={{ padding: 8 }}>{s.score}/{s.total}</td>
                <td style={{ padding: 8 }}>{s.percentage}%</td>
                <td style={{ padding: 8 }}>{new Date(s.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: 20 }}>
        <button onClick={() => navigate(`/quiz/${id}`)} style={{ padding: '8px 12px', marginRight: 8 }}>Retake Quiz</button>
        <button onClick={() => navigate('/quizzes')} style={{ padding: '8px 12px' }}>Back to Quizzes</button>
      </div>
    </div>
  )
}
