#!/bin/bash

# Quiz Master - Quick Deployment Script
# Deploys to Render and Vercel

echo "=== Quiz Master Deployment Helper ==="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Git not initialized. Run:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Get remote URL
REMOTE_URL=$(git remote get-url origin 2>/dev/null)

if [ -z "$REMOTE_URL" ]; then
    echo "❌ Git remote 'origin' not set. Run:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/quiz-master.git"
    echo "   git push -u origin main"
    exit 1
fi

echo "✓ Git repository found: $REMOTE_URL"
echo ""

# Option selection
echo "Choose deployment option:"
echo "1) Render (Backend) + Vercel (Frontend) - Recommended"
echo "2) Railway (All-in-one)"
echo "3) Docker Compose (Local)"
echo ""
read -p "Enter choice (1/2/3): " choice

case $choice in
    1)
        echo ""
        echo "=== RENDER BACKEND SETUP ==="
        echo "1. Go to render.com → Sign up with GitHub"
        echo "2. Create New Web Service"
        echo "3. Select your repository"
        echo "4. Configure:"
        echo "   - Name: quiz-master-api"
        echo "   - Build Command: npm install"
        echo "   - Start Command: cd server && npm start"
        echo "5. Add Environment Variables:"
        echo "   MONGODB_URI=your-mongodb-uri"
        echo "   JWT_SECRET=your-secret"
        echo ""
        echo "=== VERCEL FRONTEND SETUP ==="
        echo "1. Go to vercel.com → Sign up with GitHub"
        echo "2. Import your repository"
        echo "3. Configure:"
        echo "   - Root Directory: ./client"
        echo "   - Build Command: npm run build"
        echo "4. Add Environment Variable:"
        echo "   VITE_API_BASE=https://your-render-url.onrender.com"
        echo ""
        echo "See DEPLOYMENT.md for full instructions"
        ;;
    2)
        echo ""
        echo "=== RAILWAY SETUP ==="
        echo "1. Go to railway.app → Sign up with GitHub"
        echo "2. Create New Project → Deploy from GitHub"
        echo "3. Select your repository"
        echo "4. Configure services in Railway dashboard"
        echo ""
        echo "See DEPLOYMENT.md for full instructions"
        ;;
    3)
        echo ""
        echo "=== DOCKER COMPOSE SETUP ==="
        echo "Running: docker-compose up"
        echo ""
        
        if ! command -v docker-compose &> /dev/null; then
            echo "❌ Docker Compose not installed. Install from docker.com"
            exit 1
        fi
        
        echo "Building containers..."
        docker-compose build
        
        echo ""
        echo "Starting services..."
        docker-compose up
        
        echo ""
        echo "✓ Services running:"
        echo "  Frontend: http://localhost:3000"
        echo "  Backend: http://localhost:5000"
        echo "  Database: localhost:27017"
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "=== Next Steps ==="
echo "1. Read DEPLOYMENT.md for detailed instructions"
echo "2. Set up MongoDB Atlas (if not using local Mongo)"
echo "3. Deploy!"
echo ""
