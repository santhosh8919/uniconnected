#!/bin/bash

# Backend Diagnostic Script for "Cannot GET" Errors
echo "🔍 UniConnect Backend Diagnostic Tool"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check URL
check_url() {
    local url=$1
    local description=$2
    
    echo -e "🔗 Testing: ${YELLOW}$description${NC}"
    echo "   URL: $url"
    
    if command -v curl &> /dev/null; then
        response=$(curl -s -o /dev/null -w "%{http_code}" "$url" --max-time 10)
        if [ "$response" = "200" ]; then
            echo -e "   ✅ ${GREEN}SUCCESS${NC} (HTTP $response)"
            return 0
        elif [ "$response" = "000" ]; then
            echo -e "   ❌ ${RED}NO RESPONSE${NC} (Connection failed/timeout)"
            return 1
        else
            echo -e "   ❌ ${RED}ERROR${NC} (HTTP $response)"
            return 1
        fi
    else
        echo -e "   ⚠️  ${YELLOW}CURL NOT FOUND${NC} - Test manually in browser"
        return 2
    fi
    echo ""
}

# Get backend URL from user
echo "📝 Please enter your Render backend URL:"
echo "   Example: https://uniconnect-backend.onrender.com"
read -p "Backend URL: " BACKEND_URL

# Remove trailing slash
BACKEND_URL=$(echo "$BACKEND_URL" | sed 's:/*$::')

if [ -z "$BACKEND_URL" ]; then
    echo -e "❌ ${RED}ERROR${NC}: No URL provided"
    exit 1
fi

echo ""
echo "🧪 Running diagnostic tests..."
echo ""

# Test 1: Root endpoint
echo "TEST 1: Root Endpoint"
check_url "$BACKEND_URL" "Backend Root"
root_status=$?
echo ""

# Test 2: Health endpoint
echo "TEST 2: Health Endpoint"
check_url "$BACKEND_URL/api/health" "Health Check"
health_status=$?
echo ""

# Test 3: API endpoint
echo "TEST 3: API Base"
check_url "$BACKEND_URL/api" "API Base"
api_status=$?
echo ""

# Analyze results
echo "📊 DIAGNOSTIC RESULTS"
echo "===================="
echo ""

if [ $root_status -eq 0 ] && [ $health_status -eq 0 ]; then
    echo -e "✅ ${GREEN}BACKEND IS WORKING CORRECTLY${NC}"
    echo ""
    echo "🎉 Your backend is healthy! Environment variables for frontend:"
    echo ""
    echo "VITE_API_BASE_URL=${BACKEND_URL}/api"
    echo "VITE_SOCKET_URL=${BACKEND_URL}"
    echo ""
elif [ $root_status -eq 1 ] || [ $health_status -eq 1 ]; then
    echo -e "❌ ${RED}BACKEND HAS ISSUES${NC}"
    echo ""
    echo "🔧 TROUBLESHOOTING STEPS:"
    echo ""
    
    if [ $root_status -eq 1 ] && [ $health_status -eq 1 ]; then
        echo "🚨 Both root and health endpoints failed:"
        echo "   • Backend server is not running or crashed"
        echo "   • Check Render service status in dashboard"
        echo "   • Review service logs for errors"
        echo "   • Verify environment variables are set"
        echo ""
    elif [ $health_status -eq 1 ]; then
        echo "🚨 Health endpoint failed:"
        echo "   • Server is running but health route has issues"
        echo "   • Check server.js for /api/health route"
        echo "   • Review application logs"
        echo ""
    fi
    
    echo "📋 CHECK THESE IN RENDER DASHBOARD:"
    echo "   1. Service Status: Should show 'Live'"
    echo "   2. Environment Variables:"
    echo "      - NODE_ENV=production"
    echo "      - MONGO_URI=(your MongoDB connection string)"
    echo "      - JWT_SECRET=(32+ character secret)"
    echo "   3. Service Logs: Look for startup errors"
    echo "   4. MongoDB Atlas: Network access allows 0.0.0.0/0"
    echo ""
    
    echo "🔄 QUICK FIXES TO TRY:"
    echo "   1. Manual redeploy in Render dashboard"
    echo "   2. Clear build cache and deploy"
    echo "   3. Check MongoDB Atlas cluster is running"
    echo "   4. Verify all environment variables are set"
    echo ""
    
else
    echo -e "⚠️  ${YELLOW}COULD NOT TEST${NC} (curl not available)"
    echo ""
    echo "🌐 MANUAL TESTING:"
    echo "   Open these URLs in your browser:"
    echo "   • Root: $BACKEND_URL"
    echo "   • Health: $BACKEND_URL/api/health"
    echo ""
    echo "✅ Expected responses:"
    echo "   • Root: JSON with 'Welcome to UniConnect API'"
    echo "   • Health: JSON with 'status': 'OK'"
    echo ""
fi

echo "📖 For detailed troubleshooting, see:"
echo "   • CANNOT_GET_ERROR_FIX.md"
echo "   • HOW_TO_CHECK_BACKEND.md"
echo "   • TROUBLESHOOTING_NOT_FOUND.md"
