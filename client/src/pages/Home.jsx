import React from 'react'

export default function Home(){
  return (
    <div>
      <h1>Welcome to Quiz Master</h1>
      <p>A platform to create, manage, and take quizzes.</p>
      
      <div style={{ maxWidth: 600, marginTop: 24 }}>
        <h3>For Users:</h3>
        <p>Go to "Take Quiz" to select from available quizzes and test your knowledge.</p>
        
        <h3>For Admins:</h3>
        <p>
          <a href="/login">Login</a> to the admin dashboard to create quizzes and add questions.
        </p>
      </div>
    </div>
  )
}
