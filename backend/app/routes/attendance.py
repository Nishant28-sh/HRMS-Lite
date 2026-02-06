from fastapi import APIRouter, HTTPException
from ..database import attendance_collection, employee_collection
from ..schemas import AttendanceCreate
from datetime import date, datetime
from bson import ObjectId
from pydantic import BaseModel

class AttendanceUpdate(BaseModel):
    status: str

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
        "status": attendance.status,
        "timestamp": datetime.now().isoformat()
    }
    attendance_collection.insert_one(attendance_dict)
    return {"message": "Attendance marked successfully"}

@router.get("/all")
def get_all_attendance():
    """Get all attendance records"""
    records = list(attendance_collection.find().sort("date", -1).limit(100))
    # Convert ObjectId to string for JSON serialization
    for record in records:
        record["id"] = str(record["_id"])
        del record["_id"]
    return records

@router.get("/{employee_id}")
def get_attendance(employee_id: str):
    records = list(attendance_collection.find(
        {"employee_id": employee_id}
    ))
    # Convert ObjectId to string for JSON serialization
    for record in records:
        record["id"] = str(record["_id"])
        del record["_id"]
    return records

@router.put("/{record_id}")
def update_attendance(record_id: str, update: AttendanceUpdate):
    """Update existing attendance record"""
    try:
        # Convert string ID to ObjectId
        obj_id = ObjectId(record_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid record ID")
    
    # Find and update the record
    result = attendance_collection.update_one(
        {"_id": obj_id},
        {"$set": {"status": update.status}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Attendance record not found")
    
    return {"message": "Attendance updated successfully"}

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

@router.get("/")
def get_all_attendance():
    """Get all attendance records"""
    records = list(attendance_collection.find().sort("date", -1).limit(100))
    # Convert ObjectId to string for JSON serialization
    for record in records:
        record["id"] = str(record["_id"])
        del record["_id"]
    return records

@router.get("/{employee_id}")
def get_attendance(employee_id: str):
    records = list(attendance_collection.find(
        {"employee_id": employee_id}
    ))
    # Convert ObjectId to string for JSON serialization
    for record in records:
        record["id"] = str(record["_id"])
        del record["_id"]
    return records
