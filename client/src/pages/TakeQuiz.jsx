import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getQuiz, submitQuizAnswers } from '../api'

export default function TakeQuiz() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState(null)
  const [answers, setAnswers] = useState([])
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    loadQuiz()
  }, [id])

  const loadQuiz = async () => {
    const data = await getQuiz(id)
    if (data) {
      setQuiz(data)
      setAnswers(new Array(data.questions.length).fill(''))
    }
  }

  const handleSelectAnswer = (questionIdx, answer) => {
    const newAnswers = [...answers]
    newAnswers[questionIdx] = answer
    setAnswers(newAnswers)
  }

  const handleSubmit = async () => {
    if (answers.some(a => a === '')) {
      alert('Please answer all questions')
      return
    }

    const result = await submitQuizAnswers(id, answers)
    if (result) {
      navigate('/results', { state: { result } })
    }
  }

  if (!quiz) return <p>Loading quiz...</p>

  return (
    <div>
      <h2>{quiz.title}</h2>
      <p>{quiz.description}</p>
      <p><strong>Total Questions: {quiz.questions?.length || 0} | Total Points: {quiz.totalPoints}</strong></p>

      <div style={{ marginBottom: 24 }}>
        {quiz.questions.map((q, qIdx) => (
          <div key={q._id} style={{ marginBottom: 20, padding: 12, border: '1px solid #ddd', borderRadius: 4 }}>
            <h4>Q{qIdx + 1} ({q.type}, {q.points}pt): {q.question}</h4>

            {/* Multiple Choice */}
            {q.type === 'multiplechoice' && q.options && (
              <div>
                {q.options.map((opt, oIdx) => (
                  <div key={oIdx} style={{ marginBottom: 8 }}>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name={`question-${qIdx}`}
                        checked={answers[qIdx] === oIdx}
                        onChange={() => handleSelectAnswer(qIdx, oIdx)}
                        style={{ marginRight: 8 }}
                      />
                      {opt}
                    </label>
                  </div>
                ))}
              </div>
            )}

            {/* True/False */}
            {q.type === 'truefalse' && (
              <div>
                {['true', 'false'].map(val => (
                  <div key={val} style={{ marginBottom: 8 }}>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name={`question-${qIdx}`}
                        checked={answers[qIdx] === val}
                        onChange={() => handleSelectAnswer(qIdx, val)}
                        style={{ marginRight: 8 }}
                      />
                      {val.charAt(0).toUpperCase() + val.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
            )}

            {/* Short Text */}
            {q.type === 'shorttext' && (
              <textarea
                placeholder="Enter your answer"
                value={answers[qIdx] || ''}
                onChange={(e) => handleSelectAnswer(qIdx, e.target.value)}
                style={{ width: '100%', padding: 8, minHeight: 80 }}
              />
            )}

            {/* Essay */}
            {q.type === 'essay' && (
              <textarea
                placeholder="Enter your answer"
                value={answers[qIdx] || ''}
                onChange={(e) => handleSelectAnswer(qIdx, e.target.value)}
                style={{ width: '100%', padding: 8, minHeight: 100 }}
              />
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        style={{ padding: '10px 20px', fontSize: 16, cursor: 'pointer', background: '#007bff', color: 'white', border: 'none', borderRadius: 4 }}
      >
        Submit Quiz
      </button>
    </div>
  )
}
