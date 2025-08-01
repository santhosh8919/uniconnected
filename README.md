# 🎓 UniConnect - Student Alumni Network

A modern web platform connecting students and alumni for networking, mentorship, and career opportunities.

## 🌟 Features

### For Students

- **Alumni Network**: Connect with graduates from your field
- **Job Opportunities**: Browse internships and entry-level positions
- **Mentorship**: Find mentors for career guidance
- **Real-time Chat**: Direct messaging with connections
- **Events**: Join hackathons, webinars, and networking events

### For Alumni

- **Give Back**: Mentor current students
- **Post Jobs**: Share opportunities from your company
- **Network**: Stay connected with your alma mater
- **Share Knowledge**: Conduct webinars and workshops

## 🛠️ Tech Stack

### Frontend

- **React** with Vite
- **Tailwind CSS** for styling
- **Socket.IO Client** for real-time features
- **React Router** for navigation

### Backend

- **Node.js** with Express
- **MongoDB** with Mongoose
- **Socket.IO** for real-time communication
- **JWT** for authentication
- **bcryptjs** for password hashing

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- Git

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/santhosh8919/uniconnected.git
   cd uniconnected
   ```

2. **Set up environment variables**

   ```bash
   # Windows
   setup-env.bat

   # Mac/Linux
   chmod +x setup-env.sh
   ./setup-env.sh
   ```

3. **Update environment files**

   - Edit `backend/.env` with your MongoDB URI and JWT secret
   - Frontend environment is pre-configured for local development

4. **Install dependencies**

   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

5. **Start the application**

   ```bash
   # Terminal 1 - Backend
   cd backend
   npm start

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - API Health: http://localhost:5000/api/health

## 🌐 Deployment

### Deploy to Render (Recommended)

1. **Fork this repository** to your GitHub account

2. **Set up MongoDB Atlas**

   - Create a free cluster at [MongoDB Atlas](https://cloud.mongodb.com)
   - Get your connection string
   - Whitelist all IPs (0.0.0.0/0) for Render deployment

3. **Deploy using Render Blueprint**

   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Blueprint"
   - Connect your forked repository
   - Render will automatically deploy both services

4. **Set environment variables**

   - In your backend service settings, add:
     ```
     MONGO_URI=your-mongodb-atlas-connection-string
     JWT_SECRET=your-secure-random-string-32-chars-min
     ```

5. **Update CORS settings**
   - Your frontend URL will be automatically configured

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## 📱 Usage

### Quick Demo Login

For testing purposes, use these demo accounts:

- **Student**: email: `demo@student.com`, password: `demo123`
- **Alumni**: email: `demo@alumni.com`, password: `demo123`

### Creating Real Accounts

1. Click "Register" on the landing page
2. Choose your role (Student/Alumni)
3. Fill in your details
4. Verify your email (in production)
5. Complete your profile

## 🔧 Development

### Project Structure

```
uniconnect/
├── backend/                 # Node.js API server
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   ├── middleware/         # Auth & validation
│   ├── services/           # Socket.IO service
│   └── utils/              # Helper functions
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   └── utils/          # API utilities
│   └── public/             # Static assets
└── docs/                   # Documentation
```

### Available Scripts

#### Backend

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests

#### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter issues:

1. Check the [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) guide
2. Review the [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for deployment issues
3. Open an issue on GitHub with detailed error information

## 🙏 Acknowledgments

- Built with ❤️ for connecting students and alumni
- Inspired by professional networking platforms
- Thanks to the open-source community for amazing tools

---

**Made with 💻 by Santhosh** | [GitHub](https://github.com/santhosh8919)
