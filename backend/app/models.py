# MongoDB Document Models
# For MongoDB with Pydantic, schemas.py handles validation
# This file can be used for additional model logic or ODM mappings if needed

from datetime import datetime

class EmployeeModel:
    """Employee document structure in MongoDB"""
    @staticmethod
    def create_index():
        """Create unique indexes for employee collection"""
        from .database import employee_collection
        employee_collection.create_index("employee_id", unique=True)
        employee_collection.create_index("email", unique=True)

class AttendanceModel:
    """Attendance document structure in MongoDB"""
    @staticmethod
    def create_index():
        """Create indexes for attendance collection"""
        from .database import attendance_collection
        attendance_collection.create_index([("employee_id", 1), ("date", -1)])

