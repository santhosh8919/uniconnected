#!/bin/bash

# Backend Health Check Script
echo "🏥 UniConnect Backend Health Checker"
echo "====================================="
echo ""

# Get backend URL from user
echo "📝 Enter your Render backend URL (without /api/health):"
echo "Example: https://uniconnect-backend-xxxx.onrender.com"
read -p "Backend URL: " BACKEND_URL

# Remove trailing slash if present
BACKEND_URL=$(echo "$BACKEND_URL" | sed 's:/*$::')

# Construct health check URL
HEALTH_URL="${BACKEND_URL}/api/health"

echo ""
echo "🔍 Testing health endpoint: $HEALTH_URL"
echo ""

# Test with curl
if command -v curl &> /dev/null; then
    echo "📡 Making request..."
    RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$HEALTH_URL")
    HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
    BODY=$(echo "$RESPONSE" | sed '/HTTP_CODE/d')
    
    echo "📊 Response Code: $HTTP_CODE"
    echo "📋 Response Body:"
    echo "$BODY" | jq . 2>/dev/null || echo "$BODY"
    echo ""
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo "✅ Backend is healthy!"
        echo ""
        echo "🔗 Your environment variables should be:"
        echo "Frontend VITE_API_BASE_URL=${BACKEND_URL}/api"
        echo "Frontend VITE_SOCKET_URL=${BACKEND_URL}"
    else
        echo "❌ Backend health check failed!"
        echo ""
        echo "🔧 Troubleshooting steps:"
        echo "1. Check your Render service logs"
        echo "2. Verify environment variables (MONGO_URI, JWT_SECRET)"
        echo "3. Ensure service is deployed and running"
        echo "4. Check MongoDB connection"
    fi
else
    echo "⚠️  curl not found. Please test manually in browser:"
    echo "🌐 Visit: $HEALTH_URL"
    echo ""
    echo "Expected response:"
    echo '{"status":"OK","message":"UniConnect Backend is running","timestamp":"..."}'
fi

echo ""
echo "📖 For more help, see TROUBLESHOOTING_NOT_FOUND.md"
