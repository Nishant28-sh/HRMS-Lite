from fastapi import APIRouter, HTTPException
from ..database import attendance_collection, employee_collection
from ..schemas import AttendanceCreate
from datetime import date

router = APIRouter(prefix="/attendance", tags=["Attendance"])
stats_router = APIRouter(prefix="/stats", tags=["Statistics"])

@router.post("/", status_code=201)
def mark_attendance(attendance: AttendanceCreate):
    # Check if employee exists
    employee = employee_collection.find_one({"employee_id": attendance.employee_id})
    if not employee:
        raise HTTPException(
            status_code=404, 
            detail=f"Employee with ID '{attendance.employee_id}' not found. Please add the employee first."
        )
    
    # Convert date to string for storage and comparison
    date_str = str(attendance.date) if hasattr(attendance.date, 'isoformat') else attendance.date
    
    # Check for duplicate attendance on same date
    existing = attendance_collection.find_one({
        "employee_id": attendance.employee_id,
        "date": date_str
    })
    if existing:
        raise HTTPException(
            status_code=409,
            detail=f"Attendance already marked for employee {attendance.employee_id} on {date_str}"
        )

    # Insert attendance record with date as string
    attendance_dict = {
        "employee_id": attendance.employee_id,
        "date": date_str,
        "status": attendance.status
    }
    attendance_collection.insert_one(attendance_dict)
    return {"message": "Attendance marked successfully"}

@stats_router.get("/attendance/today")
def get_today_attendance_stats():
    """Get attendance stats for today"""
    today = str(date.today())
    
    # Count today's present employees
    present_count = attendance_collection.count_documents({
        "date": today,
        "status": "Present"
    })
    
    # Count today's absent employees
    absent_count = attendance_collection.count_documents({
        "date": today,
        "status": "Absent"
    })
    
    # Total attendance marked today
    total_marked = present_count + absent_count
    
    return {
        "date": today,
        "present": present_count,
        "absent": absent_count,
        "total_marked": total_marked
    }

@router.get("/{employee_id}")
def get_attendance(employee_id: str):
    records = list(attendance_collection.find(
        {"employee_id": employee_id}, {"_id": 0}
    ))
    return records
