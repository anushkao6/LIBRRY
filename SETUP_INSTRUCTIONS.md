# Backend Connection Setup

## Issue: "Cannot connect to server" Error

If you're seeing the error "Cannot connect to server. Please make sure the backend is running on http://localhost:5000", follow these steps:

### 1. Start the Backend Server

Open a terminal and navigate to the backend directory:

```bash
cd backend
```

Install dependencies (if not already done):
```bash
npm install
```

Create a `.env` file in the `backend` directory with your MongoDB connection:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/libraryDB
PORT=5000
JWT_SECRET=supersecretkey
FRONTEND_URL=http://localhost:5173
```

Start the backend server:
```bash
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB Connected: ...
```

### 2. Start the Frontend Server

Open a **new terminal** and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies (if not already done):
```bash
npm install
```

Start the frontend server:
```bash
npm run dev
```

### 3. Verify Connection

- Backend should be running on: `http://localhost:5000`
- Frontend should be running on: `http://localhost:5173`
- Check browser console (F12) for any errors
- Check backend terminal for connection logs

### Common Issues:

1. **Port 5000 already in use**: Change PORT in backend `.env` file
2. **MongoDB connection failed**: Verify your MONGO_URI in `.env` file
3. **CORS errors**: Ensure FRONTEND_URL in backend `.env` matches your frontend URL
4. **Module not found**: Run `npm install` in both backend and frontend directories

### Testing the Connection

Once both servers are running, try:
- Register a new account
- Login with your credentials
- The error should disappear if the backend is properly connected

