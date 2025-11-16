# Deployment Guide - Quiz Master

This guide covers deploying Quiz Master to the cloud so others can access and test the application.

## Architecture Overview

- **Frontend**: React + Vite (deployed to Vercel, Netlify, or similar)
- **Backend**: Node.js + Express (deployed to Render, Railway, Heroku, etc.)
- **Database**: MongoDB Atlas (cloud-hosted MongoDB)

## Option 1: Vercel (Frontend) + Render (Backend) - Recommended

This is the easiest and most cost-effective for beginners.

### Prerequisites
- GitHub account (free)
- Vercel account (free at vercel.com)
- Render account (free at render.com)
- MongoDB Atlas account (free at mongodb.com)

### Step 1: Setup MongoDB Atlas

1. Go to **mongodb.com** → Sign up (free)
2. Create a new organization
3. Create a new project (e.g., "quiz-master")
4. Click "Build a Database" → Select **M0 (Free)**
5. Choose AWS, select a region close to you
6. Create a cluster (takes ~2 minutes)
7. Go to **Database Access** → Create admin user:
   - Username: `admin`
   - Password: Generate a strong password (copy it!)
8. Go to **Network Access** → Add IP Address → Allow from anywhere (0.0.0.0/0)
9. Go to **Clusters** → Click "Connect" button
   - Select "Drivers" → Node.js
   - Copy the connection string, replace `<password>` with your password
   - Example: `mongodb+srv://admin:PASSWORD@cluster0.xxxxx.mongodb.net/quiz_master?retryWrites=true&w=majority`

### Step 2: Push Code to GitHub

1. Initialize git (if not already done):
```bash
cd C:\Users\Dell\Desktop\TestApp
git init
git add .
git commit -m "Initial commit: Quiz Master"
```

2. Create a repository on GitHub (github.com/new)
   - Name: `quiz-master`
   - Don't initialize README (you have one)
   - Create repository

3. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/quiz-master.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy Backend to Render

1. Go to **render.com** → Sign up with GitHub
2. Click "New" → "Web Service"
3. Select your `quiz-master` repository
4. Configure:
   - **Name**: quiz-master-api
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `cd server && npm start`
   - **Publish Directory**: (leave empty)
5. Add Environment Variables (under "Advanced"):
   ```
   MONGODB_URI=mongodb+srv://admin:PASSWORD@cluster0.xxxxx.mongodb.net/quiz_master?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-key-change-this
   PORT=5000
   ```
6. Click "Create Web Service"
7. Wait for deployment (~3-5 minutes)
8. Copy the deployed URL (e.g., `https://quiz-master-api.onrender.com`)

**Note**: Free tier sleeps after 15 minutes of inactivity. Upgrade to paid if you need always-on.

### Step 4: Deploy Frontend to Vercel

1. Go to **vercel.com** → Sign up with GitHub
2. Click "New Project" → Import `quiz-master` repo
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variables:
   ```
   VITE_API_BASE=https://quiz-master-api.onrender.com
   ```
5. Click "Deploy"
6. Wait for deployment (~2-3 minutes)
7. Copy the deployed URL (e.g., `https://quiz-master.vercel.app`)

### Done! Your app is live at:
- **Frontend**: https://quiz-master.vercel.app
- **Backend API**: https://quiz-master-api.onrender.com

Share these URLs with others to test!

---

## Option 2: Railway (Frontend + Backend)

Railway offers a more integrated experience (both frontend + backend in one place).

### Prerequisites
- GitHub account
- Railway account (railway.app)
- MongoDB Atlas account

### Steps

1. **Push code to GitHub** (same as Step 2 above)

2. Go to **railway.app** → Sign up with GitHub

3. Create a new project → "Deploy from GitHub repo"

4. Select your `quiz-master` repo

5. Railway will auto-detect `package.json` files. Configure:
   - **Server Service**:
     - Start Command: `cd server && npm start`
     - Environment:
       ```
       MONGODB_URI=your-mongodb-atlas-uri
       JWT_SECRET=your-secret
       PORT=8080
       ```
   - **Client Service** (if separating):
     - Build: `cd client && npm run build`
     - Start: `npm run preview`

6. Deploy and Railway will provide URLs for both

---

## Option 3: Docker + AWS/Google Cloud/Azure

For production-grade deployments with auto-scaling.

### Create Dockerfile for Server

Create `server/Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

### Create Dockerfile for Client

Create `client/Dockerfile`:
```dockerfile
FROM node:18-alpine as builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Deploy to Google Cloud Run (Easiest Docker option)

1. Install Google Cloud SDK
2. Set up a project
3. Deploy:
```bash
gcloud run deploy quiz-master-api --source server --platform managed
gcloud run deploy quiz-master-ui --source client --platform managed
```

---

## Environment Variables Checklist

| Variable | Value | Where |
|----------|-------|-------|
| `MONGODB_URI` | Your MongoDB Atlas connection string | Backend |
| `JWT_SECRET` | Strong random string (e.g., generate with `openssl rand -base64 32`) | Backend |
| `PORT` | 5000 (backend), 3000 (frontend) | Backend |
| `VITE_API_BASE` | Backend URL (e.g., `https://quiz-master-api.onrender.com`) | Frontend |

---

## Testing After Deployment

1. Open the frontend URL in your browser
2. Go to "Admin Login"
3. Create an admin account (register → register automatically logs in)
4. Create a quiz in Admin Dashboard
5. Add questions of different types
6. Go to "Take Quiz" as a public user
7. Test the quiz and verify scoring

---

## Troubleshooting

### "Cannot connect to MongoDB"
- Verify `MONGODB_URI` is correct in backend environment variables
- Ensure MongoDB Atlas "Network Access" allows your deployment IP (or 0.0.0.0/0)
- Check connection string has correct password

### "Frontend can't reach backend"
- Verify `VITE_API_BASE` is set correctly in frontend
- Check backend deployment is running (no errors in logs)
- Ensure backend `CORS` allows frontend origin

### "Port already in use"
- Use a different port (Railway/Render auto-assign ports, so not an issue on cloud)

### "Slow initial load"
- Free tier Render/Railway services sleep after inactivity, causing 30sec cold start
- Upgrade to paid tier for production

---

## Cost Estimate (Monthly)

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| MongoDB Atlas | $0 (M0) | $57+ (M2) |
| Vercel (Frontend) | $0 | $20+ |
| Render (Backend) | $0 (sleeps after 15min) | $7+ |
| **Total** | **$0** | **$84+** |

Free tier is perfect for learning and demos!

---

## Next Steps

1. Choose one deployment option above
2. Create accounts on the required platforms
3. Follow the step-by-step guide
4. Share your deployed URLs with others
5. Monitor logs for errors
6. Iterate and improve your app

Need help with any specific step? Ask!
