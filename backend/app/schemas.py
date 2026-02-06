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
