from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Union

class EmployeeCreate(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr
    department: str

class AttendanceCreate(BaseModel):
    employee_id: str
    date: Union[date, str]  # Accept both date and string
    status: str  # Present / Absent
    
    class Config:
        json_encoders = {
            date: lambda v: v.isoformat() if isinstance(v, date) else v
        }

class SalaryCreate(BaseModel):
    employee_id: str
    month: str  # YYYY-MM format
    base_salary: float
    bonus: float = 0
    deductions: float = 0
    
    class Config:
        json_schema_extra = {
            "example": {
                "employee_id": "E001",
                "month": "2024-02",
                "base_salary": 50000,
                "bonus": 5000,
                "deductions": 2000
            }
        }

class SalaryUpdate(BaseModel):
    base_salary: float = None
    bonus: float = None
    deductions: float = None
