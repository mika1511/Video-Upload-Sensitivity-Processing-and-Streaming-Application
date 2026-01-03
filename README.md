# Video Upload, Sensitivity Processing, and Streaming Application

A full-stack application that enables users to upload videos, processes them for content sensitivity analysis, and provides seamless video streaming capabilities with real-time progress tracking.

## 🎯 Overview

This platform allows users to securely upload videos, automatically analyze them for content sensitivity (safe/flagged classification), and stream processed content with real-time progress updates. Built with Node.js, Express, MongoDB, React, and Vite, it features multi-tenant architecture ensuring complete user data isolation.

## ✨ Features

- **User Authentication**: Secure registration and login system with JWT
- **Video Upload**: User-friendly interface with file validation and progress indicators
- **Content Sensitivity Analysis**: Automated detection and classification (safe/flagged)
- **Real-Time Processing Updates**: Live progress tracking via Socket.io (10%, 30%, 60%, 90%, 100%)
- **Video Streaming**: HTTP range request support for efficient playback
- **Multi-Tenant Architecture**: Each user accesses only their own video content
- **Video Dashboard**: Comprehensive list of uploaded videos with status indicators
- **Responsive Design**: Cross-platform compatibility and intuitive user experience

## 🛠 Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Real-Time Communication**: Socket.io
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer

### Frontend
- **Build Tool**: Vite
- **Framework**: React
- **State Management**: Context API
- **Styling**: CSS
- **HTTP Client**: Axios
- **Real-Time**: Socket.io Client



### **🎬 Backend API (`backend/`)**

```
server.js          - Express + Socket.io server
routes/auth.js     - POST /login, /register (JWT)
routes/videos.js   - POST /upload, GET /videos, /:id/stream
models/User.js     - MongoDB user schema
models/Video.js    - Video metadata + status
middleware/auth.js - JWT verification
uploads/           - Video file storage

```


### **🚀 Frontend SPA (`frontend/`)**

```

App.jsx            - React Router + ProtectedRoute
pages/Login.jsx    - Login form → /api/auth/login
pages/Register.jsx    - Register form → /api/auth/register
pages/Dashboard.jsx - Video list + streaming
pages/UploadVideo.jsx - Drag-drop upload
context/AuthContext.jsx - Global auth state
vite.config.js     - Dev proxy setup

```













## 🚀 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <project-directory>
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/video-platform
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=production
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create or update `src/config.js`:

```javascript
export const API_URL = 'https://your-backend-url.render.com/api';

```

## 🎮 Running Locally

### Start Backend Server

```bash
cd backend
npm start
```
Server runs on `http://localhost:5000`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```
Application available at `http://localhost:5173`

## 🌐 Deployment

### Frontend (Vercel)

The frontend is deployed on Vercel:
- **Live URL**: https://video-upload-sensitivity-processing-beta.vercel.app/
- **Deployment**: Automatic deployment on push to main branch

**Deployment Steps:**
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add environment variables in Vercel dashboard

### Backend (Render)

The backend is deployed on Render:
- **Live URL**: https://vapp-7opb.onrender.com
- **Database**: MongoDB Atlas

**Deployment Steps:**
1. Create new Web Service on Render
2. Connect GitHub repository
3. Configure:
   - Build Command: `npm install`
   - Start Command: `node server.js`
4. Add environment variables in Render dashboard:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `PORT`
   - `NODE_ENV=production`
5. Ensure MongoDB Atlas network access allows Render's IP addresses (0.0.0.0/0)

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "bhumika@gmail.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6958b696d403abadf919bc9a",
    "email": "bhumika@gmail.com",
    "role": "user"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "bhumika@gmail.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6958b696d403abadf919bc9a",
    "email": "bhumika@gmail.com",
    "role": "user"
  }
}
```

### Video Endpoints

#### Upload Video
```http
POST /api/videos/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

video: [video file]
title: "My Video Title"
```

**Response:**
```json
{
  "message": "Video uploaded and processing started!",
  "videoId": "6958b696d403abadf919bc9b"
}
```

#### Get All User Videos
```http
GET /api/videos
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "_id": "6958b696d403abadf919bc9b",
    "userId": "6958b696d403abadf919bc9a",
    "title": "My Video Title",
    "filename": "6958b696d403abadf919bc9a-1734567890123.mp4",
    "status": "safe",
    "progress": 100,
    "createdAt": "2025-01-03T10:00:00.000Z",
    "updatedAt": "2025-01-03T10:02:00.000Z"
  }
]
```

#### Stream Video
```http
GET /api/videos/:id/stream
Range: bytes=0-1024
```

**Response:** Video stream with partial content (206) support

**Headers:**
- `Content-Range`: bytes 0-1024/10485760
- `Accept-Ranges`: bytes
- `Content-Length`: 1024
- `Content-Type`: video/mp4

### Health Check Endpoint

#### Check Server Status
```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "message": "Backend is running"
}
```

### Real-Time Events (Socket.io)

**Client Connection:**
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

socket.on('connect', () => {
  console.log('Connected to server:', socket.id);
});
```

**Processing Progress Event:**
```javascript
 newSocket.on('progress', (data) => {
            setVideos(prevVideos => {
                const updatedVideos = prevVideos.map(video =>
                    video._id === data.videoId
                        ? { ...video, progress: data.progress, status: data.status }
                        : video
                );

                if (!updatedVideos.find(v => v._id === data.videoId)) {
                    updatedVideos.push({
                        _id: data.videoId,
                        progress: data.progress,
                        status: data.status,
                        title: 'Processing...',
                        createdAt: new Date()
                    });
                }

                return updatedVideos;
            });
        });
```

**Progress Stages:**
- 10% - Initial processing
- 30% - Content analysis started
- 60% - Midway through analysis
- 90% - Nearly complete
- 100% - Processing complete (status changes to "safe")

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication with 1-hour expiration
- **Password Hashing**: bcryptjs with salt rounds for password encryption
- **Multi-Tenant Isolation**: Users can only access their own videos
- **Input Validation**: Request validation on all endpoints
- **CORS Configuration**: Controlled cross-origin resource sharing
- **File Type Validation**: Only video files accepted (video/*)
- **File Size Limits**: Maximum 100MB per upload
- **Protected Routes**: Authentication middleware on protected endpoints

## 🎬 Video Processing Pipeline

1. **Upload Validation**: File type and size verification (max 100MB)
2. **Storage Management**: Secure file storage with unique naming (`userId-timestamp.ext`)
3. **Async Processing**: Non-blocking video analysis simulation
4. **Progress Updates**: Real-time progress via Socket.io (10%, 30%, 60%, 90%, 100%)
5. **Status Management**: 
   - `pending` - Initial state after upload
   - `processing` - During analysis (10-90%)
   - `safe` - Processing complete (100%)
   - `flagged` - Sensitive content detected (future enhancement)
6. **Streaming Preparation**: HTTP range request support for efficient playback


## 🔧 Key Functionalities Implemented

✅ User registration with email validation  
✅ Secure login with JWT authentication  
✅ Token-based authorization middleware  
✅ Video upload with title metadata  
✅ Real-time processing progress tracking (10-30-60-90-100%)  
✅ Content sensitivity simulation (marks as 'safe' after processing)  
✅ Video streaming with HTTP range request support  
✅ Multi-tenant architecture with user isolation  
✅ Responsive dashboard with video library  
✅ Socket.io real-time updates  
✅ CRUD operations for videos  
✅ Error handling and validation  
✅ Production deployment (Frontend: Vercel, Backend: Render)

