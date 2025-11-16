const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

// Admin auth
export async function adminRegister(username, password){
  const res = await fetch(`${API_BASE}/api/admin/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  return res.json()
}

export async function adminLogin(username, password){
  const res = await fetch(`${API_BASE}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  if(!res.ok) return null
  return res.json()
}

// Quizzes (public)
export async function getQuizzes(){
  const res = await fetch(`${API_BASE}/api/quizzes`)
  if(!res.ok) return []
  return res.json()
}

export async function getQuiz(id){
  const res = await fetch(`${API_BASE}/api/quizzes/${id}`)
  if(!res.ok) return null
  return res.json()
}

export async function submitQuizAnswers(quizId, answers, username){
  const res = await fetch(`${API_BASE}/api/quizzes/${quizId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers, username })
  })
  if(!res.ok) return null
  return res.json()
}

export async function getQuizScores(quizId){
  const res = await fetch(`${API_BASE}/api/quizzes/${quizId}/scores`)
  if(!res.ok) return []
  return res.json()
}

// Admin only
export async function createQuiz(token, title, description){
  const res = await fetch(`${API_BASE}/api/quizzes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ title, description })
  })
  if(!res.ok) return null
  return res.json()
}

export async function addQuestionToQuiz(token, quizId, questionPayload){
  const res = await fetch(`${API_BASE}/api/quizzes/${quizId}/questions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(questionPayload)
  })
  if(!res.ok) return null
  return res.json()
}

export async function deleteQuestion(token, quizId, questionId){
  const res = await fetch(`${API_BASE}/api/quizzes/${quizId}/questions/${questionId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  if(!res.ok) return null
  return res.json()
}

