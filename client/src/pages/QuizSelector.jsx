import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getQuizzes } from '../api'

export default function QuizSelector() {
  const [quizzes, setQuizzes] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    loadQuizzes()
  }, [])

  const loadQuizzes = async () => {
    const data = await getQuizzes()
    setQuizzes(data || [])
  }

  const handleSelectQuiz = (quizId) => {
    navigate(`/quiz/${quizId}`)
  }

  return (
    <div>
      <h2>Select a Quiz</h2>
      {quizzes.length === 0 ? (
        <p>No quizzes available. Please check back later.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
          {quizzes.map(quiz => (
            <div
              key={quiz._id}
              style={{
                border: '1px solid #ddd',
                padding: 16,
                borderRadius: 8,
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onClick={() => handleSelectQuiz(quiz._id)}
            >
              <h3>{quiz.title}</h3>
              <p>{quiz.description}</p>
              <p><strong>Questions: {quiz.questions?.length || 0}</strong></p>
              <button style={{ padding: '8px 16px', cursor: 'pointer' }}>Start Quiz</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
