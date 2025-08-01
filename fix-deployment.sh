#!/bin/bash

# Quick Deployment Fix Script for "Not Found" Errors
echo "🔧 Fixing UniConnect Deployment Issues..."
echo "========================================"

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -d "backend" ] && [ ! -d "frontend" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "✅ Project structure detected"

# Create missing directories and files
echo "📁 Creating missing files and directories..."

# Ensure public directory exists
mkdir -p frontend/public

# Create _redirects file for Render static site
echo "📝 Creating _redirects file for SPA routing..."
cat > frontend/public/_redirects << 'EOL'
/*    /index.html   200
EOL

echo "✅ Created frontend/public/_redirects"

# Check if environment example files exist
if [ ! -f "frontend/.env.example" ]; then
    echo "📝 Creating frontend/.env.example..."
    cat > frontend/.env.example << 'EOL'
# Backend API URL
VITE_API_BASE_URL=http://localhost:5000/api

# Socket.IO URL
VITE_SOCKET_URL=http://localhost:5000

# For production, use your Render URLs:
# VITE_API_BASE_URL=https://your-backend-app.onrender.com/api
# VITE_SOCKET_URL=https://your-backend-app.onrender.com
EOL
    echo "✅ Created frontend/.env.example"
fi

if [ ! -f "backend/.env.example" ]; then
    echo "📝 Creating backend/.env.example..."
    cat > backend/.env.example << 'EOL'
# MongoDB Connection
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/uniconnect

# JWT Secret Key (minimum 32 characters)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters

# Environment
NODE_ENV=development

# Port
PORT=5000
EOL
    echo "✅ Created backend/.env.example"
fi

# Check Vite config
echo "🔍 Checking Vite configuration..."
if ! grep -q "publicDir" frontend/vite.config.js; then
    echo "⚠️  Vite config may need updating for proper public directory handling"
fi

# Check render.yaml
if [ -f "render.yaml" ]; then
    echo "✅ render.yaml found"
    if grep -q "type: static" render.yaml; then
        echo "✅ Frontend configured as static site"
    else
        echo "⚠️  Frontend should be configured as static site in render.yaml"
    fi
else
    echo "⚠️  render.yaml not found - manual deployment required"
fi

echo ""
echo "🎉 Deployment fix complete!"
echo ""
echo "📋 Next steps for Render deployment:"
echo "1. Commit and push these changes to GitHub"
echo "2. In Render dashboard, ensure frontend is deployed as 'Static Site'"
echo "3. Set environment variables in Render:"
echo "   Backend: MONGO_URI, JWT_SECRET, NODE_ENV=production"
echo "   Frontend: VITE_API_BASE_URL, VITE_SOCKET_URL"
echo "4. Redeploy both services"
echo ""
echo "🔗 After deployment, test:"
echo "   Backend health: https://your-backend-app.onrender.com/api/health"
echo "   Frontend: https://your-frontend-app.onrender.com"
echo ""
echo "📖 For detailed troubleshooting, see TROUBLESHOOTING_NOT_FOUND.md"
