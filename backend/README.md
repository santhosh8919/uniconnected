# UniConnect Backend API

## Overview

This is the backend API for UniConnect, a platform connecting students and alumni for networking, mentorship, and career opportunities.

## Features

- **User Authentication**: JWT-based registration and login
- **User Management**: Profile management with role-based access
- **Connection System**: Send, accept, reject connection requests
- **Search & Discovery**: Find users by college, branch, skills, etc.
- **Privacy Controls**: Profile visibility settings
- **Role-based Features**: Different features for students and alumni

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express Validator
- **Password Hashing**: bcryptjs

## Project Structure

```
backend/
├── models/
│   ├── User.js              # User model with student/alumni fields
│   └── Connection.js        # Connection/networking model
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── user.js              # User management routes
│   └── connections.js       # Connection management routes
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   └── validation.js        # Request validation middleware
├── utils/
│   ├── db.js                # Database connection utility
│   └── responses.js         # Standardized API responses
├── .env                     # Environment variables
├── server.js                # Main application entry point
└── package.json             # Dependencies and scripts
```

## Installation

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env` file with:

   ```
   MONGO_URI=mongodb+srv://santhosh:santhosh@cluster0.qmt0lo2.mongodb.net/uniconnect
   JWT_SECRET=Gv9sVp3F+GeBBRXAEEeWyECFzVBinjKb8NofjKD/h+4=
   PORT=5000
   NODE_ENV=development
   ```

3. **Start the server**:

   ```bash
   # Development mode with auto-restart
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Authentication (`/api/auth`)

- `POST /register` - Register new user (student/alumni)
- `POST /login` - User login
- `GET /me` - Get current user profile
- `POST /logout` - Logout user
- `PUT /change-password` - Change password

### User Management (`/api/users`)

- `GET /profile/:id` - Get user profile by ID
- `PUT /profile` - Update user profile
- `GET /search` - Search users with filters
- `GET /suggestions` - Get connection suggestions
- `PUT /preferences` - Update user preferences

### Connections (`/api/connections`)

- `POST /send` - Send connection request
- `PUT /:connectionId/respond` - Accept/reject connection request
- `GET /requests` - Get connection requests (sent/received)
- `GET /` - Get accepted connections
- `DELETE /:connectionId` - Remove connection
- `GET /stats` - Get connection statistics

## User Model Features

### Common Fields

- Full name, email, password
- College, branch, academic year
- Profile picture, bio, skills
- Social links (LinkedIn, GitHub, Twitter)
- Privacy preferences

### Student-Specific

- Academic year (1st-4th)
- Student role

### Alumni-Specific

- Working status
- Company name and job role
- Alumni role

## Connection System

- Send connection requests with optional message
- Accept/reject/remove connections
- View sent and received requests
- Get connection statistics
- Privacy-aware suggestions

## Security Features

- JWT token authentication
- Password hashing with bcryptjs
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Helmet security headers
- Input validation and sanitization
- Profile visibility controls

## Error Handling

- Standardized error responses
- Validation error formatting
- MongoDB error handling
- Authentication error handling

## Database Indexes

- Text search on name, college, branch, company
- College and branch compound index
- Year and role index
- Unique email constraint

## Development

### Scripts

- `npm run dev` - Start with nodemon (auto-restart)
- `npm start` - Start production server

### Testing the API

Use tools like Postman or curl to test endpoints:

```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "college": "IIT Delhi",
    "branch": "Computer Science Engineering",
    "year": "3rd Year"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## Environment Variables

- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)

## MongoDB Collections

- `users` - User profiles and authentication
- `connections` - Network connections between users

## Future Enhancements

- Email verification
- Password reset functionality
- File upload for profile pictures
- Real-time messaging
- Event management
- Job posting system
- Notification system
