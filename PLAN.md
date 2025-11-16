Assumptions
Roles: Admin, Public User

Admin:
Pages: Login, admin dashboard
Funcitionalities: login, register, quizes and adding types of questions

Public User
Pages: Quiz page, results page.
Functionilities: Select quiz type, answer the quiz, get the result

__________________________________________________________________

Scope
Admin login 
Register
Add new quiz title and questions
Add quiestions to existing quiz
Types of questions: Multiple choice, true or false, text types.
selecting the quiz and answering the questions
showing the results

__________________________________________________________________

Approach
Client(Frontend) - React using vite
Server(Backend) - nodejs/Express
DB: MongoDB atlas
IDE: VS Code
AI: Github Agent

Client
Create routes for specific funcitionalities (login, admin dashboard, answer questions, etc)
login page, register page, admin dashboard
quiz selection, answers quiz, show results.

Server
create apis for login, register, create quiz topic, add questions, get questions, show results.
connect with mongoDB instance to store admin user details, quiz topic and its question respectively.
get the questions based on the topic selected and display the questions accordingly.
basic login and register validation.

____________________________________________________________________________________________
