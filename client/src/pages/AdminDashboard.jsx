import React, { useState, useEffect } from 'react'
import { createQuiz, addQuestionToQuiz, getQuizzes, deleteQuestion } from '../api'

export default function AdminDashboard({ token }) {
  const [quizzes, setQuizzes] = useState([])
  const [newQuizTitle, setNewQuizTitle] = useState('')
  const [newQuizDesc, setNewQuizDesc] = useState('')
  const [selectedQuiz, setSelectedQuiz] = useState(null)
  const [questionType, setQuestionType] = useState('multiplechoice')
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', '', '', ''])
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0)
  const [correctAnswer, setCorrectAnswer] = useState('true')
  const [acceptableAnswers, setAcceptableAnswers] = useState([''])
  const [points, setPoints] = useState(1)

  useEffect(() => {
    loadQuizzes()
  }, [])

  const loadQuizzes = async () => {
    const data = await getQuizzes()
    setQuizzes(data || [])
  }

  const handleCreateQuiz = async (e) => {
    e.preventDefault()
    if (!newQuizTitle) return
    const quiz = await createQuiz(token, newQuizTitle, newQuizDesc)
    if (quiz) {
      setNewQuizTitle('')
      setNewQuizDesc('')
      loadQuizzes()
    }
  }

  const handleAddQuestion = async (e) => {
    e.preventDefault()
    if (!selectedQuiz || !question) return
    
    let payload = { type: questionType, question, points: parseInt(points) }

    if (questionType === 'multiplechoice') {
      if (options.some(o => !o)) return alert('All options required')
      payload.options = options
      payload.correctAnswerIndex = correctAnswerIndex
    } else if (questionType === 'truefalse') {
      payload.correctAnswer = correctAnswer
    } else if (questionType === 'shorttext' || questionType === 'essay') {
      if (acceptableAnswers.some(a => !a)) return alert('All acceptable answers required')
      payload.acceptableAnswers = acceptableAnswers
    }

    const quiz = await addQuestionToQuiz(token, selectedQuiz, payload)
    if (quiz) {
      setQuestion('')
      setOptions(['', '', '', ''])
      setCorrectAnswerIndex(0)
      setCorrectAnswer('true')
      setAcceptableAnswers([''])
      setPoints(1)
      loadQuizzes()
    }
  }

  const handleDeleteQuestion = async (quizId, qId) => {
    const result = await deleteQuestion(token, quizId, qId)
    if (result) loadQuizzes()
  }

  return (
    <div>
      <h2>Admin Dashboard - Manage Quizzes</h2>

      {/* Create Quiz */}
      <div style={{ marginBottom: 24, border: '1px solid #ddd', padding: 16, borderRadius: 8 }}>
        <h3>Create New Quiz</h3>
        <form onSubmit={handleCreateQuiz}>
          <div style={{ marginBottom: 8 }}>
            <label>Quiz Title: </label>
            <input
              value={newQuizTitle}
              onChange={(e) => setNewQuizTitle(e.target.value)}
              style={{ marginLeft: 8, padding: 4 }}
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>Description: </label>
            <input
              value={newQuizDesc}
              onChange={(e) => setNewQuizDesc(e.target.value)}
              style={{ marginLeft: 8, padding: 4 }}
            />
          </div>
          <button type="submit" style={{ padding: '6px 12px', cursor: 'pointer' }}>Create Quiz</button>
        </form>
      </div>

      {/* Add Questions */}
      {quizzes.length > 0 && (
        <div style={{ marginBottom: 24, border: '1px solid #ddd', padding: 16, borderRadius: 8 }}>
          <h3>Add Question to Quiz</h3>
          <div style={{ marginBottom: 12 }}>
            <label>Select Quiz: </label>
            <select
              value={selectedQuiz || ''}
              onChange={(e) => setSelectedQuiz(e.target.value)}
              style={{ marginLeft: 8, padding: 4 }}
            >
              <option value="">-- Choose a quiz --</option>
              {quizzes.map(q => (
                <option key={q._id} value={q._id}>{q.title}</option>
              ))}
            </select>
          </div>

          {selectedQuiz && (
            <form onSubmit={handleAddQuestion}>
              <div style={{ marginBottom: 8 }}>
                <label>Question Type: </label>
                <select
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                  style={{ marginLeft: 8, padding: 4 }}
                >
                  <option value="multiplechoice">Multiple Choice</option>
                  <option value="truefalse">True/False</option>
                  <option value="shorttext">Short Text</option>
                  <option value="essay">Essay</option>
                </select>
              </div>

              <div style={{ marginBottom: 8 }}>
                <label>Points: </label>
                <input
                  type="number"
                  min="1"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  style={{ marginLeft: 8, padding: 4, width: 60 }}
                />
              </div>

              <div style={{ marginBottom: 8 }}>
                <label>Question: </label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  style={{ width: '100%', padding: 8, marginTop: 4 }}
                />
              </div>

              {/* Multiple Choice */}
              {questionType === 'multiplechoice' && (
                <>
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} style={{ marginBottom: 8 }}>
                      <label>Option {i + 1}: </label>
                      <input
                        value={options[i]}
                        onChange={(e) => {
                          const newOpts = [...options]
                          newOpts[i] = e.target.value
                          setOptions(newOpts)
                        }}
                        style={{ width: '100%', padding: 4 }}
                      />
                    </div>
                  ))}
                  <div style={{ marginBottom: 8 }}>
                    <label>Correct Answer: </label>
                    <select
                      value={correctAnswerIndex}
                      onChange={(e) => setCorrectAnswerIndex(parseInt(e.target.value))}
                      style={{ marginLeft: 8, padding: 4 }}
                    >
                      {[0, 1, 2, 3].map(i => (
                        <option key={i} value={i}>Option {i + 1}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* True/False */}
              {questionType === 'truefalse' && (
                <div style={{ marginBottom: 8 }}>
                  <label>Correct Answer: </label>
                  <select
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                    style={{ marginLeft: 8, padding: 4 }}
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                </div>
              )}

              {/* Short Text / Essay */}
              {(questionType === 'shorttext' || questionType === 'essay') && (
                <>
                  <div style={{ marginBottom: 8 }}>
                    <label>Acceptable Answers (one per line):</label>
                    <textarea
                      value={acceptableAnswers.join('\n')}
                      onChange={(e) => setAcceptableAnswers(e.target.value.split('\n').filter(a => a))}
                      style={{ width: '100%', padding: 8, marginTop: 4, height: 80 }}
                      placeholder="Enter multiple acceptable answers&#10;E.g.: photosynthesis&#10;Photosynthesis"
                    />
                    <small style={{ color: '#666' }}>Matching is case-insensitive</small>
                  </div>
                </>
              )}

              <button type="submit" style={{ padding: '6px 12px', cursor: 'pointer' }}>Add Question</button>
            </form>
          )}
        </div>
      )}

      {/* View Quizzes */}
      <div>
        <h3>Quizzes</h3>
        {quizzes.map(quiz => (
          <div key={quiz._id} style={{ border: '1px solid #ccc', padding: 12, marginBottom: 12, borderRadius: 4 }}>
            <h4>{quiz.title}</h4>
            <p>{quiz.description}</p>
            <p><strong>Questions: {quiz.questions?.length || 0} | Total Points: {quiz.totalPoints}</strong></p>
            {quiz.questions && quiz.questions.length > 0 && (
              <ul>
                {quiz.questions.map((q, idx) => (
                  <li key={q._id} style={{ marginBottom: 8 }}>
                    <strong>Q{idx + 1} ({q.type}, {q.points}pt):</strong> {q.question}
                    <button
                      onClick={() => handleDeleteQuestion(quiz._id, q._id)}
                      style={{ marginLeft: 8, color: 'red', cursor: 'pointer', background: 'none', border: 'none' }}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
