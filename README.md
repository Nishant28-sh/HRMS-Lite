# HRMS Lite - Human Resource Management System

A lightweight, web-based HRMS application for managing employee records and tracking daily attendance.

## 🚀 Features

### ✅ Employee Management
- Add new employees with validation
- View all employees in a clean table
- Delete employee records
- Duplicate prevention (Employee ID & Email)

### ✅ Attendance Management
- Mark daily attendance (Present/Absent)
- View attendance history by employee ID
- Date-wise attendance tracking
- Color-coded status indicators

### ✅ UI/UX Features
- Loading states for API calls
- Success/Error notifications
- Empty state messages
- Responsive design
- Professional color scheme

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **MongoDB** - NoSQL database
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - API calls

## 📁 Project Structure

```
HRMS LITE/
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   │   ├── employee.py
│   │   │   └── attendance.py
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models.py
│   │   └── schemas.py
│   ├── .env
│   ├── requirements.txt
│   └── run.py
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── EmployeeForm.jsx
    │   │   ├── EmployeeTable.jsx
    │   │   ├── Attendance.jsx
    │   │   └── AttendanceHistory.jsx
    │   ├── pages/
    │   │   └── Dashboard.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── tailwind.config.js
```

## 🔧 Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
```

3. Activate virtual environment:
```bash
# Windows
.\venv\Scripts\Activate.ps1

# Linux/Mac
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Configure environment variables:
Create a `.env` file in the backend folder:
```env
MONGO_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/
```

6. Run the backend server:
```bash
python run.py
```

Backend will run on: `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

Frontend will run on: `http://localhost:5173`

## 📡 API Endpoints

### Employee Routes
- `POST /employees/` - Add new employee
- `GET /employees/` - Get all employees
- `DELETE /employees/{employee_id}` - Delete employee

### Attendance Routes
- `POST /attendance/` - Mark attendance
- `GET /attendance/{employee_id}` - Get attendance records

## 🔍 API Testing

Access interactive API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 📊 Data Models

### Employee Schema
```json
{
  "employee_id": "string",
  "full_name": "string",
  "email": "user@example.com",
  "department": "string"
}
```

### Attendance Schema
```json
{
  "employee_id": "string",
  "date": "2026-02-06",
  "status": "Present" // or "Absent"
}
```

## 🎨 Screenshots

### Dashboard
- Clean employee management interface
- Add employee form
- Employee table with delete functionality

### Attendance
- Mark attendance form
- View attendance history
- Color-coded status display

## ⚠️ Important Notes

1. Make sure both backend and frontend servers are running simultaneously
2. Backend must be running on port 8000
3. Frontend must be running on port 5173
4. MongoDB connection string must be valid

## 🧪 Testing

1. Add a test employee
2. Verify it appears in the table
3. Mark attendance for the employee
4. View attendance history
5. Delete the employee

## 🚀 Deployment

### Backend Deployment (Render/Railway)
1. Push code to GitHub
2. Connect to deployment platform
3. Set environment variables
4. Deploy

### Frontend Deployment (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Update API baseURL to production backend URL

## 📝 License

This project is open source and available for educational purposes.

## 👨‍💻 Author

HRMS Lite - A simple and efficient HR management solution

## 🙏 Acknowledgments

- FastAPI Documentation
- React Documentation
- Tailwind CSS
- MongoDB Atlas
