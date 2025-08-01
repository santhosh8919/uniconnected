# UniConnect - Backend API Integration Guide

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB database
- Git

### Backend Setup

1. **Navigate to backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create a `.env` file in the backend directory:

   ```env
   # Database
   MONGO_URI=mongodb://localhost:27017/uniconnect
   # or use MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/uniconnect

   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-complex
   JWT_EXPIRE=7d

   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Email Configuration (Optional - for future email features)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

4. **Start the backend server:**

   ```bash
   npm start
   ```

   or for development with auto-restart:

   ```bash
   npm run dev
   ```

5. **Verify backend is running:**
   - Open http://localhost:5000 in your browser
   - You should see the API welcome message

### Frontend Setup

1. **Navigate to frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the frontend development server:**

   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Open http://localhost:5173 in your browser

## 🔧 API Integration Features

### ✅ Implemented Features:

1. **Authentication System:**

   - User registration with validation
   - User login with JWT tokens
   - Password hashing with bcrypt
   - Role-based access (Student/Alumni)

2. **Profile Management:**

   - Fetch user profile from database
   - Update profile information
   - Separate login data (read-only) and profile data (editable)
   - Alumni-specific fields (company, job role, working status)
   - User preferences (privacy, notifications)

3. **Real-time Data:**
   - Live data fetching from MongoDB
   - Error handling and loading states
   - Automatic token validation
   - Fallback to localStorage if API fails

### 🎯 API Endpoints:

#### Authentication:

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

#### User Management:

- `GET /api/users/profile/:id` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/preferences` - Update user preferences
- `GET /api/users/search` - Search users
- `GET /api/users/suggestions` - Get connection suggestions

#### Connections:

- `POST /api/connections/request` - Send connection request
- `PUT /api/connections/accept/:id` - Accept connection
- `PUT /api/connections/reject/:id` - Reject connection
- `GET /api/connections` - Get user connections
- `DELETE /api/connections/:id` - Remove connection

### 🛠 Usage Examples:

#### 1. Register a New User:

```javascript
import { authAPI } from "./utils/api";

const userData = {
  fullName: "John Doe",
  email: "john@example.com",
  password: "securepassword",
  college: "IIT Delhi",
  branch: "Computer Science",
  year: "3rd Year",
};

try {
  const response = await authAPI.register(userData);
  localStorage.setItem("user", JSON.stringify(response.user));
  // Redirect to dashboard
} catch (error) {
  console.error("Registration failed:", error);
}
```

#### 2. Login User:

```javascript
const credentials = {
  email: "john@example.com",
  password: "securepassword",
};

try {
  const response = await authAPI.login(credentials);
  localStorage.setItem("user", JSON.stringify(response.user));
  // Redirect based on role
} catch (error) {
  console.error("Login failed:", error);
}
```

#### 3. Update User Profile:

```javascript
import { userAPI } from "./utils/api";

const profileData = {
  bio: "Passionate about technology",
  skills: ["JavaScript", "React", "Node.js"],
  socialLinks: {
    linkedin: "https://linkedin.com/in/johndoe",
    github: "https://github.com/johndoe",
  },
};

try {
  const response = await userAPI.updateProfile(profileData);
  console.log("Profile updated:", response);
} catch (error) {
  console.error("Update failed:", error);
}
```

## 🧪 Testing the Integration

### Database Query Testing:

```bash
cd backend/queries
node query-test.js
```

### API Health Check:

- Visit: http://localhost:5000/api/health
- Should return: `{"status": "OK", "message": "UniConnect Backend is running"}`

### Manual API Testing:

Use the provided `apiTest.js` in the frontend utils folder:

```javascript
// In browser console or test file
import { testAPIIntegration } from "./utils/apiTest.js";
testAPIIntegration();
```

## 🔍 Data Flow:

### Registration/Login Flow:

1. User fills form → Frontend validates
2. API call to backend → Database stores/validates
3. JWT token generated → Sent to frontend
4. Token stored in localStorage → Used for authenticated requests
5. User redirected to appropriate dashboard

### Profile Management Flow:

1. Component mounts → `fetchUserProfile()` called
2. API fetches latest data → Database query
3. Data separated into login data (read-only) and profile data (editable)
4. User edits profile → `handleSave()` called
5. API updates database → Success feedback to user

## 🛡 Security Features:

- Password hashing with bcrypt (12 salt rounds)
- JWT token authentication
- Rate limiting (100 requests per 15 minutes)
- Input validation with express-validator
- CORS configuration for frontend origin
- Helmet.js for security headers
- MongoDB injection protection

## 📊 Database Schema:

### User Collection:

```javascript
{
  fullName: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  college: String (required),
  branch: String (required),
  year: String (required, enum),
  role: String (auto-generated from year),

  // Profile fields
  bio: String (max 500 chars),
  skills: [String],
  socialLinks: { linkedin, github, twitter },
  profilePicture: String,

  // Alumni specific
  isWorking: Boolean,
  companyName: String,
  jobRole: String,

  // Preferences
  preferences: {
    emailNotifications: Boolean,
    profileVisibility: String (enum)
  },

  // Timestamps
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date
}
```

## 🚨 Troubleshooting:

### Common Issues:

1. **CORS Error:**

   - Ensure backend is running on port 5000
   - Check CORS configuration in server.js

2. **Database Connection Failed:**

   - Verify MongoDB is running
   - Check MONGO_URI in .env file

3. **JWT Token Issues:**

   - Check JWT_SECRET in .env
   - Verify token is stored in localStorage

4. **API Calls Failing:**
   - Check network tab in browser
   - Verify backend server is running
   - Check API endpoints and request format

### Debugging Tips:

- Check browser console for errors
- Monitor network requests in DevTools
- Check backend terminal for error logs
- Use the query test script to verify database

## 🎉 You're All Set!

Your UniConnect application now has full backend integration with:

- ✅ User authentication
- ✅ Real-time data fetching
- ✅ Profile management
- ✅ Error handling
- ✅ Loading states
- ✅ Security features

Start the servers and begin testing the application!
