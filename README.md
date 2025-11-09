# Library Management System (LMS)

A full-stack Library Management System built with the MERN stack (MongoDB, Express, React, Node.js). Features a modern dark-mode UI with role-based access control for Admins and Members.

## 🚀 Features

### 🧍‍♂️ User Authentication & Roles
- **Admin Login and Member Login** with JWT-based authentication
- **Role-based access control**:
  - **Admin**: Full CRUD privileges on books, users, and fines
  - **Member**: View, search, issue, and return books only
- Tokens stored in localStorage

### 📖 Book Management
- **Admin Features**:
  - Add, Update, View, Delete books
  - Manage book availability status
  - Book details: Title, Author, ISBN, Category, Availability
- **Member Features**:
  - View and search books by title, author, or category
  - Issue and return books (with automatic status updates)
  - View issue history
  - Star-based rating system (1-5 stars)

### 💰 Fine Management System
- Automatically calculates fines for late book returns (₹10 per day overdue)
- Admin can mark fines as paid/unpaid
- View total fines collected and pending fines
- Fine calculation based on due date (14 days from issue)

### 📊 Admin Dashboard & Analytics
- **Dashboard Statistics**:
  - Total Books
  - Total Members
  - Issued Books
  - Pending Returns
  - Total Fines Collected
  - Pending Fines
- **Visual Analytics**:
  - Books by Category (Pie Chart)
  - Recent Issues (Line Chart)
  - Popular Books
  - Monthly Revenue (Bar Chart)

### 💳 Dummy Payment System
- **Payment Methods**: UPI, Cash, and Card
- Simulated payment processing for membership payments
- Payment history tracking
- Payment status verification

### 🎨 Modern UI/UX
- **Dark Mode** with indigo/blue accent palette
- Fully responsive (mobile, tablet, desktop)
- Smooth animations with Framer Motion
- Toast notifications for all operations
- Interactive components with hover effects

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

## 🛠️ Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory (copy from `.env.sample`):
```env
MONGO_URI=your_mongodb_atlas_connection_string_here
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

4. Replace the MongoDB URI with your MongoDB Atlas connection string.

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
LIBRARYMAN/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Book.js
│   │   ├── Payment.js
│   │   ├── Fine.js
│   │   └── Issue.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── books.js
│   │   ├── payment.js
│   │   ├── fines.js
│   │   └── dashboard.js
│   ├── server.js
│   ├── package.json
│   └── .env.sample
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── LoginModal.jsx
│   │   │   ├── RegisterModal.jsx
│   │   │   ├── AddBookModal.jsx
│   │   │   ├── PaymentModal.jsx
│   │   │   ├── BookCard.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Books.jsx
│   │   │   ├── About.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user (default role: member)
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile (Protected)

### Books
- `GET /api/books` - Get all books (with optional search query)
- `GET /api/books/search?query=` - Search books
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Add new book (Admin only)
- `PUT /api/books/:id` - Update book (Admin only)
- `DELETE /api/books/:id` - Delete book (Admin only)
- `PUT /api/books/:id/rate` - Rate a book (Protected)
- `POST /api/books/:id/issue` - Issue a book (Member only)
- `POST /api/books/:id/return` - Return a book (Member only)
- `GET /api/books/my-issues` - Get user's issued books (Protected)

### Payment (Simulated)
- `POST /api/payment/process` - Process payment (Protected)
  - Body: `{ amount, description, paymentMethod: 'upi'|'cash'|'card', paymentDetails }`
- `GET /api/payment/status/:reference` - Get payment status (Protected)
- `GET /api/payment/history/:userId` - Get payment history (Protected)
- `POST /api/payment/verify` - Verify payment (Protected)

### Fines
- `GET /api/fines` - Get all fines (Admin) or user's fines (Member)
- `GET /api/fines/:id` - Get single fine (Protected)
- `PUT /api/fines/:id/pay` - Mark fine as paid (Admin only)
- `GET /api/fines/stats/summary` - Get fine statistics (Admin only)

### Dashboard (Admin only)
- `GET /api/admin/dashboard` - Get dashboard statistics and analytics

## 🎨 Design Features

- **Color Scheme**: Dark mode with indigo/blue accent palette
- **Effects**: Smooth transitions and animations
- **Animations**: Framer Motion for smooth UI transitions
- **Typography**: Modern sans-serif fonts
- **Responsive**: Mobile-first design approach
- **Icons**: React Icons for consistent iconography
- **Charts**: Recharts for data visualization

## ⚙️ Technical Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite) + TailwindCSS + Axios + React Router |
| Backend | Express.js + Node.js |
| Database | MongoDB Atlas (Mongoose ORM) |
| Auth | JWT + bcryptjs |
| Charts | Recharts |
| UI Animations | Framer Motion |
| Notifications | React Toastify |
| Icons | React Icons |

## 🧪 Testing

1. **Register/Login**: Create a new user account or login
2. **Admin Features** (requires admin role):
   - Access Dashboard from navbar
   - Add/Edit/Delete books
   - View analytics and charts
   - Manage fines
3. **Member Features**:
   - Browse and search books
   - Issue and return books
   - Rate books
   - View issued books
4. **Payment**: Test payment with UPI, Cash, or Card methods

## 🔐 Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Role-based access control (Admin/Member)
- Protected API routes with middleware
- CORS configuration

## ⚠️ Important Notes

- The payment system is **simulated only** - no real transactions are processed
- JWT tokens are stored in localStorage
- All protected routes require `Authorization: Bearer <token>` header
- Books are issued for 14 days by default
- Fine rate: ₹10 per day overdue
- Default user role is 'member' (admin role must be set manually in database)

## 📝 Creating an Admin User

To create an admin user, you can either:
1. Manually update the user document in MongoDB:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

2. Or register a user and update via MongoDB Compass/Atlas UI

## 🎯 Future Enhancements

- Email notifications for due dates
- Book reservation system
- Advanced search filters
- Export reports functionality
- Multi-language support

## 📝 License

This project is open source and available for educational purposes.

## 👥 Contributors

Developed as a full-stack Library Management System project.

---

**Happy Reading! 📚**
