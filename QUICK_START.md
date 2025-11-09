# 🚀 Quick Start Guide

## The App Crashed / "Server not on 5000" Error

This means the **backend server is not running**. Follow these steps:

### Step 1: Start the Backend Server

**Option A: Using the batch file (Windows)**
- Double-click `start-backend.bat` in the project root
- OR run it from terminal: `.\start-backend.bat`

**Option B: Manual start**
1. Open a **new terminal/command prompt**
2. Navigate to backend folder:
   ```bash
   cd backend
   ```
3. Start the server:
   ```bash
   npm run dev
   ```

### Step 2: Verify Backend is Running

You should see:
```
🚀 Server running on port 5000
📡 Health check: http://localhost:5000/api/health
```

**Test it:** Open http://localhost:5000/api/health in your browser
- Should show: `{"message":"Server is running","status":"ok",...}`

### Step 3: Start the Frontend (in a NEW terminal)

1. Open a **second terminal/command prompt**
2. Navigate to frontend folder:
   ```bash
   cd frontend
   ```
3. Start the frontend:
   ```bash
   npm run dev
   ```

### Step 4: Open the App

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Common Issues

### ❌ "Port 5000 already in use"
**Solution:** 
- Find what's using port 5000 and close it
- OR change port in `backend/.env`: `PORT=5001`
- Update `frontend/src/utils/api.js`: Change `5000` to `5001`

### ❌ "MongoDB connection failed"
**Solution:**
- Server will still start, but login/register won't work
- Check your `.env` file has correct `MONGO_URI`
- Format: `mongodb+srv://username:password@cluster.mongodb.net/libraryDB`

### ❌ "Cannot find module"
**Solution:**
```bash
cd backend
npm install

cd ../frontend
npm install
```

## Important Notes

- **Keep the backend terminal open** - closing it stops the server
- **Both servers must run simultaneously** - backend on 5000, frontend on 5173
- **The backend must start BEFORE trying to login/register**

## Still Having Issues?

1. Check backend terminal for error messages
2. Check browser console (F12) for errors
3. Verify `.env` file exists in `backend/` folder
4. Make sure Node.js is installed: `node --version` (should be 16+)

