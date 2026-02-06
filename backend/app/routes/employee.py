from fastapi import APIRouter, HTTPException
from ..database import employee_collection
from ..schemas import EmployeeCreate

router = APIRouter(prefix="/employees", tags=["Employees"])

@router.post("/", status_code=201)
def add_employee(employee: EmployeeCreate):
    if employee_collection.find_one({
        "$or": [
            {"employee_id": employee.employee_id},
            {"email": employee.email}
        ]
    }):
        raise HTTPException(status_code=409, detail="Employee already exists")

    employee_collection.insert_one(employee.dict())
    return {"message": "Employee added successfully"}

@router.get("/")
def get_employees():
    employees = list(employee_collection.find({}, {"_id": 0}))
    return employees

@router.delete("/{employee_id}")
def delete_employee(employee_id: str):
    result = employee_collection.delete_one({"employee_id": employee_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Employee not found")
    return {"message": "Employee deleted"}
