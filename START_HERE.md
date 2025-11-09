# 🚀 Quick Start Guide

## ⚠️ Important: Backend Must Be Running First!

Before you can login or use any features, **you must start the backend server**.

## Step 1: Start Backend Server

1. Open a terminal/command prompt
2. Navigate to the backend folder:
   ```bash
   cd backend
   ```

3. Make sure you have a `.env` file with your MongoDB connection:
   ```env
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secret_key_here
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   ```

4. Install dependencies (if not already done):
   ```bash
   npm install
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

   You should see:
   ```
   🚀 Server running on port 5000
   📡 Health check: http://localhost:5000/api/health
   ✅ MongoDB Connected: ...
   ```

## Step 2: Start Frontend Server

1. Open a **NEW** terminal/command prompt
2. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

3. Install dependencies (if not already done):
   ```bash
   npm install
   ```

4. Start the frontend server:
   ```bash
   npm run dev
   ```

   The frontend will open at: `http://localhost:5173`

## Step 3: Create an Admin User

1. Register a new user through the frontend
2. Open MongoDB Compass or MongoDB Atlas
3. Find your user in the `users` collection
4. Update the user's `role` field from `"member"` to `"admin"`

   Or use MongoDB shell:
   ```javascript
   db.users.updateOne(
     { email: "your-email@example.com" },
     { $set: { role: "admin" } }
   )
   ```

## ✅ Verification

1. Backend is running: Visit `http://localhost:5000/api/health` - should return JSON
2. Frontend is running: Visit `http://localhost:5173` - should show the homepage
3. Login works: Try logging in with your credentials

## 🔧 Troubleshooting

### "Cannot connect to server" Error

- **Check**: Is the backend server running on port 5000?
- **Check**: Is MongoDB connected? (Check backend terminal for connection message)
- **Check**: Is your `.env` file configured correctly?
- **Solution**: Make sure backend is running BEFORE starting frontend

### MongoDB Connection Issues

- Verify your `MONGO_URI` in the `.env` file
- Check if your MongoDB Atlas IP whitelist includes your current IP
- Ensure your MongoDB credentials are correct

### Port Already in Use

- If port 5000 is busy, change `PORT` in `.env` file
- Update `API_URL` in `frontend/src/utils/api.js` to match

## 📝 Default Settings

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`
- Database: MongoDB Atlas (configure in `.env`)

---

**Remember**: Always start the backend server first! 🎯

