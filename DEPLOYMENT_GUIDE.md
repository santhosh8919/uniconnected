# UniConnect Deployment Guide for Render

## 🚀 Quick Deployment Steps

### Option 1: Using Render Blueprint (Recommended)

1. Fork/Clone this repository to your GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click "New" → "Blueprint"
4. Connect your GitHub repository
5. Render will automatically deploy both frontend and backend using the `render.yaml` configuration

### Option 2: Manual Deployment

#### Backend Deployment

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
   - **Plan**: Free

#### Frontend Deployment

1. Click "New" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

## 🔧 Environment Variables

### Backend (.env)

Set these in your Render backend service environment variables:

```
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/uniconnect
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
PORT=5000
FRONTEND_URL=https://your-frontend-app.onrender.com
```

### Frontend

Set these in your Render frontend environment variables:

```
VITE_API_BASE_URL=https://your-backend-app.onrender.com/api
VITE_SOCKET_URL=https://your-backend-app.onrender.com
```

## 📝 Important Notes

1. **MongoDB Setup**: Make sure you have a MongoDB Atlas cluster set up
2. **CORS Configuration**: The backend is configured to accept requests from your frontend domain
3. **JWT Secret**: Use a strong, random string at least 32 characters long
4. **Free Tier Limitations**: Render free tier services may spin down after inactivity

## 🔍 Troubleshooting

### Backend not responding:

- Check if all environment variables are set correctly
- Verify MongoDB connection string
- Check Render service logs

### Frontend can't connect to backend:

- Ensure `VITE_API_BASE_URL` points to your backend service URL
- Check CORS configuration in backend
- Verify both services are running

### Authentication issues:

- Verify JWT_SECRET is set and same across deployments
- Check token expiration settings

## 🧪 Testing Deployment

After deployment, test these endpoints:

- Backend health: `https://your-backend-app.onrender.com/api/health`
- Frontend: `https://your-frontend-app.onrender.com`

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Setup](https://docs.atlas.mongodb.com/)
- [Node.js Deployment Guide](https://render.com/docs/deploy-node-express-app)
