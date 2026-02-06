# 🚀 HRMS Lite - Quick Start Guide

## ⚡ **5-Minute Startup**

### **For Development (Local Testing)**

#### Step 1: Start the Backend
```bash
cd backend
pip install -r requirements.txt
python run.py
```
✅ Backend runs on: `http://localhost:8000`

#### Step 2: Start the Frontend (New Terminal)
```bash
cd frontend
npm install
npm run dev
```
✅ Frontend runs on: `http://localhost:5173`

#### Step 3: Access the Application
Open your browser and visit: **`http://localhost:5173`**

---

## 📋 **What to Test First**

### Dashboard
- [ ] Page loads without errors
- [ ] Shows employee count, attendance rate, payroll stats
- [ ] Dark mode toggle works at top-right

### Employees Page
- [ ] Can add new employee
- [ ] Can see all employees in table
- [ ] Can delete employees
- [ ] Form validation works

### Attendance Page
- [ ] Can mark attendance for employees
- [ ] Can update existing records
- [ ] Can search/filter records
- [ ] Dropdown searches work

### Payroll Page
- [ ] Can create salary records
- [ ] Can filter by month
- [ ] Calculations are correct (Gross = Basic + Allowances)
- [ ] Net = Gross - Deductions

### History Page
- [ ] Can see attendance history
- [ ] Monthly filtering works
- [ ] Employee-wise summary shows

### Navigation
- [ ] Sidebar minimizes/maximizes with arrow button
- [ ] Clicking menu items auto-expands sidebar
- [ ] Dark mode persists on refresh

---

## 🔧 **Common Issues & Fixes**

### MongoDB Connection Error
```
Error: Connection refused
```
**Solution:**
- Start MongoDB locally: `mongod`
- OR update `.env` with MongoDB Atlas connection string

### Frontend Won't Load
```
Error: Cannot GET /
```
**Solution:**
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

### Port Already in Use
```
Error: Port 8000 already in use
```
**Solution:**
```bash
# Kill process on port 8000
# Windows PowerShell:
Stop-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess

# Linux/Mac:
lsof -ti:8000 | xargs kill -9
```

### Dependencies Missing
```bash
# Backend
pip install -r requirements.txt --force-reinstall

# Frontend
rm -rf node_modules
npm install --legacy-peer-deps
```

---

## 🎯 **API Testing** (with Postman)

### Test Employee Endpoints
```
GET http://localhost:8000/employees
POST http://localhost:8000/employees
  Body: {"name": "John", "email": "john@example.com", "designation": "Manager", "department": "HR", "salary": 50000, "phone": "9876543210"}
```

### Test Attendance
```
POST http://localhost:8000/attendance
  Body: {"employee_id": "emp_id", "date": "2024-01-15", "status": "present"}
GET http://localhost:8000/attendance/{employee_id}
```

### Test Salary
```
POST http://localhost:8000/salary
  Body: {"employee_id": "emp_id", "month": "2024-01", "basic": 40000, "allowances": 5000, "deductions": 2000}
GET http://localhost:8000/salary/month/2024-01
```

---

## 📦 **Production Deployment**

### Option 1: Vercel (Frontend) + Railway (Backend)

1. **Frontend to Vercel:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel
```

2. **Backend to Railway:**
```bash
# Create account on railway.app
# Connect GitHub repo
# Set MONGO_URI environment variable
# Deploy button
```

### Option 2: Docker Deployment

```bash
# Build Docker images
docker-compose up -d
```

### Option 3: Heroku (Simple)

**Backend:**
```bash
heroku login
heroku create your-app-name
git push heroku main
```

**Frontend:**
- Connect to Netlify/Vercel and auto-deploy

---

## 📊 **Feature Overview**

| Feature | Status | Notes |
|---------|--------|-------|
| Employee CRUD | ✅ Working | Full add/view/delete |
| Attendance System | ✅ Working | Mark & update records |
| Payroll Management | ✅ Working | Complete salary system |
| Dark Mode | ✅ Working | Persists in storage |
| Mobile Responsive | ✅ Working | Works on all devices |
| Sidebar Collapse | ✅ Working | Auto-expand on click |

---

## 🔐 **Environment Variables**

Create `.env` file in `backend/` folder:
```
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/hrms_lite
```

For production, update with your MongoDB Atlas credentials.

---

## 📱 **Mobile Testing**

The app is fully responsive. To test on mobile:

1. Run frontend: `npm run dev`
2. Find your IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
3. Visit: `http://YOUR_IP:5173` on your phone

---

## 🎨 **Customization Quick Tips**

### Change APP Title
Edit `frontend/index.html`:
```html
<title>Your App Name</title>
```

### Change Colors
Edit `frontend/tailwind.config.js`

### Change API URL
Edit `frontend/src/services/api.js`:
```javascript
baseURL: 'your-production-url'
```

---

## ✅ **Pre-Launch Checklist**

- [ ] Backend running without errors
- [ ] Frontend loads in browser
- [ ] Can add employee
- [ ] Can mark attendance
- [ ] Can add salary record
- [ ] Dark mode works
- [ ] Sidebar collapse works
- [ ] History page loads
- [ ] No console errors
- [ ] No network errors

---

## 📞 **Emergency Restart**

If everything breaks:
```bash
# Kill all processes
killall python
killall node

# Clear data and restart
cd backend
python clear_data.py
python run.py

# New terminal
cd frontend
npm run dev
```

---

## 🎉 **You're All Set!**

Your HRMS Lite application is ready to use! 

**Happy deploying!** 🚀

---

*Last Updated: February 6, 2026*
*Version: 1.0.0 Production Ready*
