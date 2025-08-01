#!/bin/bash

# UniConnect Environment Setup Script

echo "🚀 Setting up UniConnect Environment Variables"
echo "============================================="

# Backend Environment Variables
echo ""
echo "📋 Setting up Backend Environment (.env)..."
cd backend

if [ ! -f .env ]; then
    echo "Creating backend .env file..."
    cat > .env << EOL
# MongoDB Connection - Replace with your actual MongoDB URI
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/uniconnect?retryWrites=true&w=majority

# JWT Secret Key - Replace with a secure random string
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# Environment
NODE_ENV=development

# Port
PORT=5000

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
EOL
    echo "✅ Backend .env file created!"
    echo "⚠️  Please update MONGO_URI and JWT_SECRET with your actual values"
else
    echo "⚠️  Backend .env file already exists"
fi

cd ..

# Frontend Environment Variables
echo ""
echo "📋 Setting up Frontend Environment (.env)..."
cd frontend

if [ ! -f .env ]; then
    echo "Creating frontend .env file..."
    cat > .env << EOL
# Backend API URL
VITE_API_BASE_URL=http://localhost:5000/api

# Socket.IO URL  
VITE_SOCKET_URL=http://localhost:5000
EOL
    echo "✅ Frontend .env file created!"
else
    echo "⚠️  Frontend .env file already exists"
fi

cd ..

echo ""
echo "🎉 Environment setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Update backend/.env with your MongoDB URI and JWT secret"
echo "2. Install dependencies: npm install (in both backend/ and frontend/ directories)"
echo "3. Start backend: cd backend && npm start"
echo "4. Start frontend: cd frontend && npm run dev"
echo ""
echo "🔗 Local URLs:"
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo "API Health: http://localhost:5000/api/health"
