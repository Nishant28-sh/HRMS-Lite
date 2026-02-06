from fastapi import APIRouter, HTTPException, status
from bson import ObjectId
from ..database import salary_collection, employee_collection
from ..schemas import SalaryCreate, SalaryUpdate
from datetime import datetime

router = APIRouter(prefix="/salary", tags=["salary"])

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_salary(salary: SalaryCreate):
    """Create or update salary record"""
    # Check if employee exists
    employee = employee_collection.find_one({"employee_id": salary.employee_id})
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Check if salary already exists for this employee-month combination
    existing = salary_collection.find_one({
        "employee_id": salary.employee_id,
        "month": salary.month
    })
    
    salary_data = {
        "employee_id": salary.employee_id,
        "month": salary.month,
        "base_salary": salary.base_salary,
        "bonus": salary.bonus,
        "deductions": salary.deductions,
        "net_salary": salary.base_salary + salary.bonus - salary.deductions,
        "updated_at": datetime.utcnow()
    }
    
    if existing:
        # Update existing record
        result = salary_collection.update_one(
            {"_id": existing["_id"]},
            {"$set": salary_data}
        )
        return {
            "message": "Salary record updated successfully",
            "id": str(existing["_id"])
        }
    else:
        # Create new record
        salary_data["created_at"] = datetime.utcnow()
        result = salary_collection.insert_one(salary_data)
        return {
            "message": "Salary record created successfully",
            "id": str(result.inserted_id)
        }

@router.get("/employee/{employee_id}")
async def get_employee_salaries(employee_id: str):
    """Get all salary records for an employee"""
    salaries = list(salary_collection.find(
        {"employee_id": employee_id}
    ).sort("month", -1))
    
    # Convert ObjectId to string
    for salary in salaries:
        salary["id"] = str(salary["_id"])
        del salary["_id"]
    
    return salaries

@router.get("/month/{month}")
async def get_salaries_by_month(month: str):
    """Get allsalary records for a specific month (YYYY-MM format)"""
    salaries = list(salary_collection.find(
        {"month": month}
    ).sort("month", -1).sort("created_at", 1))
    
    # Convert ObjectId to string
    for salary in salaries:
        salary["id"] = str(salary["_id"])
        del salary["_id"]
        # Add employee name
        employee = employee_collection.find_one({"employee_id": salary["employee_id"]})
        if employee:
            salary["employee_name"] = employee.get("full_name", "N/A")
    
    return salaries

@router.get("/{salary_id}")
async def get_salary(salary_id: str):
    """Get a specific salary record by ID"""
    try:
        salary = salary_collection.find_one({"_id": ObjectId(salary_id)})
        if not salary:
            raise HTTPException(status_code=404, detail="Salary record not found")
        
        salary["id"] = str(salary["_id"])
        del salary["_id"]
        return salary
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid salary ID")

@router.put("/{salary_id}")
async def update_salary(salary_id: str, salary_update: SalaryUpdate):
    """Update a salary record"""
    try:
        salary_obj_id = ObjectId(salary_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid salary ID")
    
    # Get the existing salary
    existing = salary_collection.find_one({"_id": salary_obj_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Salary record not found")
    
    # Build update data
    update_data = {}
    if salary_update.base_salary is not None:
        update_data["base_salary"] = salary_update.base_salary
    if salary_update.bonus is not None:
        update_data["bonus"] = salary_update.bonus
    if salary_update.deductions is not None:
        update_data["deductions"] = salary_update.deductions
    
    # Recalculate net salary if any component changed
    if update_data:
        base = update_data.get("base_salary", existing["base_salary"])
        bonus = update_data.get("bonus", existing["bonus"])
        deductions = update_data.get("deductions", existing["deductions"])
        update_data["net_salary"] = base + bonus - deductions
        update_data["updated_at"] = datetime.utcnow()
        
        salary_collection.update_one(
            {"_id": salary_obj_id},
            {"$set": update_data}
        )
    
    return {"message": "Salary record updated successfully"}

@router.delete("/{salary_id}")
async def delete_salary(salary_id: str):
    """Delete a salary record"""
    try:
        salary_obj_id = ObjectId(salary_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid salary ID")
    
    result = salary_collection.delete_one({"_id": salary_obj_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Salary record not found")
    
    return {"message": "Salary record deleted successfully"}

@router.get("/payroll/summary/{month}")
async def get_payroll_summary(month: str):
    """Get payroll summary for a month"""
    salaries = list(salary_collection.find({"month": month}))
    
    total_employees = len(salaries)
    total_base_salary = sum(s.get("base_salary", 0) for s in salaries)
    total_bonus = sum(s.get("bonus", 0) for s in salaries)
    total_deductions = sum(s.get("deductions", 0) for s in salaries)
    total_net_salary = sum(s.get("net_salary", 0) for s in salaries)
    
    return {
        "month": month,
        "total_employees": total_employees,
        "total_base_salary": total_base_salary,
        "total_bonus": total_bonus,
        "total_deductions": total_deductions,
        "total_net_salary": total_net_salary
    }
