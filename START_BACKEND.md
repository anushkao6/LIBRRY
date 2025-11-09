# How to Start the Backend Server

## Quick Start

1. **Open a terminal/command prompt**

2. **Navigate to the backend folder:**
   ```bash
   cd backend
   ```

3. **Check if .env file exists:**
   - If `.env` file doesn't exist, create it
   - Copy the format from `.env.example` (if it exists)
   - Add your MongoDB connection string

4. **Install dependencies (if not done):**
   ```bash
   npm install
   ```

5. **Start the server:**
   ```bash
   npm run dev
   ```

## Expected Output

You should see:
```
🚀 Server running on port 5000
📡 Health check: http://localhost:5000/api/health

✅ MongoDB Connected: ... (if MongoDB is configured)
```

OR if MongoDB is not configured:
```
🚀 Server running on port 5000
📡 Health check: http://localhost:5000/api/health

❌ MONGO_URI is not defined in .env file
⚠️  Server will start but database operations will fail
```

## Troubleshooting

### Port 5000 already in use?
- Change `PORT=5001` in your `.env` file
- Update frontend `api.js` to use port 5001

### MongoDB connection fails?
- Check your `.env` file has correct `MONGO_URI`
- Format: `mongodb+srv://username:password@cluster.mongodb.net/libraryDB`
- Server will still start, but auth/books won't work

### Server crashes?
- Check the error message in terminal
- Make sure all dependencies are installed: `npm install`
- Check Node.js version (should be 16+)

## Test the Server

Once running, test in browser:
- http://localhost:5000/api/health

Should return: `{"message":"Server is running","status":"ok",...}`

