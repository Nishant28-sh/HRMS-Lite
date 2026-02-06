# HRMS Lite

A modern, lightweight HRMS for managing employees, attendance, and payroll with a clean dashboard and fast workflows.

## Live Links
- Frontend: https://hrms-lite-ivory.vercel.app/
- Backend: https://hrms-lite-851n.onrender.com

## Highlights
- Employee management (add, view, delete)
- Attendance marking and history
- Payroll management with monthly summaries
- Responsive UI with sidebar collapse
- Dark mode support

## Tech Stack
**Frontend:** React 18, Vite, Tailwind CSS, Axios
**Backend:** FastAPI, MongoDB, Pydantic, Uvicorn, Gunicorn

## Project Structure
```
HRMS LITE/
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   │   ├── attendance.py
│   │   │   ├── employee.py
│   │   │   └── salary.py
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models.py
│   │   └── schemas.py
│   ├── requirements.txt
│   ├── runtime.txt
│   └── .python-version
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   └── App.jsx
    ├── package.json
    └── tailwind.config.js
```

## Getting Started (Local)

### Prerequisites
- Python 3.12+
- Node.js 16+
- MongoDB (local or Atlas)

### Backend
```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\Activate.ps1

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
```

Create `backend/.env`:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hrms_lite
```

Run:
```bash
python run.py
```
Backend: http://localhost:8000

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend: http://localhost:5173

## API Endpoints

### Employees
- `GET /employees`
- `POST /employees`
- `DELETE /employees/{employee_id}`

### Attendance
- `POST /attendance`
- `GET /attendance/{employee_id}`
- `PUT /attendance/{id}`
- `DELETE /attendance/{id}`
- `GET /attendance/stats/{employee_id}`

### Payroll
- `POST /salary`
- `GET /salary/month/{month}`
- `GET /salary/employee/{employee_id}`
- `GET /salary/payroll/summary/{month}`
- `PUT /salary/{salary_id}`
- `DELETE /salary/{salary_id}`
- `GET /salary/stats/total/{month}`

## Deployment Notes
- Render backend start command:
  ```bash
  gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app --bind 0.0.0.0:$PORT
  ```
- Update frontend API base URL in [frontend/src/services/api.js](frontend/src/services/api.js)

## Screenshots
Add your screenshots here for a visual preview.

## License
MIT
