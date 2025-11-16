# Quiz Master — React client + Node server + MongoDB Atlas

A fullstack quiz application with admin dashboard for managing quizzes and a public interface for taking quizzes.

## Features

- **Admin Dashboard**: Create quizzes, add questions with multiple-choice options
- **Public Quiz Interface**: Browse available quizzes, take quizzes, get instant scoring
- **Authentication**: Secure admin login with JWT tokens
- **MongoDB Integration**: Store all quiz data, questions, and responses

## Tech Stack

- `server/` — Node + Express + Mongoose + JWT + Bcrypt
- `client/` — React + Vite + React Router

## Quick Start (Windows PowerShell)

### 1. Setup Server

```powershell
cd server
npm install
copy .env.example .env
```

Edit `.env` and set:
- `MONGODB_URI` to your MongoDB Atlas connection string
- `JWT_SECRET` (optional, defaults to 'your-secret-key-change-in-production')

```powershell
npm run dev
```

The server runs on `http://localhost:5000`.

### 2. Setup Client

In a new terminal:

```powershell
cd client
npm install
npm run dev
```

The client runs on `http://localhost:5173`.

## Usage

### For Users

1. Open `http://localhost:5173`
2. Click "Take Quiz"
3. Select a quiz and answer all questions
4. View your score and percentage

### For Admins

1. Open `http://localhost:5173/login`
2. Create an account or login
3. Go to "Admin Dashboard"
4. Create a new quiz
5. Add questions with 4 options each
6. Set the correct answer index (0-3)

## API Endpoints

**Admin Routes** (`/api/admin`):
- `POST /register` - Create admin account
- `POST /login` - Admin login, returns JWT token

**Quiz Routes** (`/api/quizzes`):
- `GET /` - List all quizzes (public)
- `GET /:id` - Get quiz with questions (public, no answers)
- `POST /` - Create quiz (admin only)
- `POST /:id/questions` - Add question (admin only)
- `DELETE /:id/questions/:qId` - Delete question (admin only)
- `POST /:id/submit` - Submit quiz answers and get score (public)

## Notes

- Passing score: 60%
- Questions are stored as sub-documents inside quizzes
- Question types: Multiple Choice, True/False, Short Text, Essay
- Each question has configurable points

## Deployment

**Ready to go live?** See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete cloud deployment guides:

- **Vercel + Render** (Recommended, free tier available)
- **Railway** (All-in-one solution)
- **Docker** (For any cloud or local setup)
- **AWS, Google Cloud, Azure** (Advanced)

Run deployment helper:
```powershell
.\deploy.bat  # Windows
./deploy.sh   # macOS/Linux
```

## Project Structure

```
TestApp/
├── client/               # React frontend (Vite)
│   ├── src/pages/       # Login, AdminDashboard, QuizSelector, TakeQuiz, Results
│   ├── src/api.js       # API client helpers
│   ├── Dockerfile       # Container for frontend
│   └── package.json
├── server/              # Node.js backend (Express)
│   ├── models/          # Quiz, Admin mongoose schemas
│   ├── routes/          # Admin, Quizzes API routes
│   ├── utils/           # Auth, JWT helpers
│   ├── Dockerfile       # Container for backend
│   └── package.json
├── docker-compose.yml   # Full stack Docker setup
├── DEPLOYMENT.md        # Complete deployment guide
└── README.md           # This file
```

## FAQ

**Q: How much does deployment cost?**  
A: Free for getting started! MongoDB Atlas free tier, Vercel free tier, Render free tier (with sleep). Upgrade when needed.

**Q: Can I use SQLite instead of MongoDB?**  
A: Yes, modify `server/models/` files and update `mongoose` to your preferred ORM.

**Q: How do I add more question types?**  
A: Edit `server/models/Quiz.js` QuestionSchema, add new type validation in `server/routes/quizzes.js`, update client UI in `client/src/pages/AdminDashboard.jsx` and `TakeQuiz.jsx`.

**Q: Can I import quizzes from CSV?**  
A: Not yet, but you can add this! Create a new route `/api/quizzes/import` that parses CSV and creates questions.

## License

MIT

