"""
Clear all employees and attendance data from the database
"""
import sys
sys.path.insert(0, 'C:\\Users\\nisha\\Downloads\\HRMS LITE\\backend')

from app.database import employee_collection, attendance_collection

def clear_all_data():
    """Delete all employees and attendance records"""
    
    print("Starting data deletion...")
    
    # Count before deletion
    emp_count_before = employee_collection.count_documents({})
    att_count_before = attendance_collection.count_documents({})
    
    print(f"Found {emp_count_before} employees")
    print(f"Found {att_count_before} attendance records")
    print()
    
    # Delete all attendance records
    attendance_result = attendance_collection.delete_many({})
    print(f"✓ Deleted {attendance_result.deleted_count} attendance records")
    
    # Delete all employees
    employee_result = employee_collection.delete_many({})
    print(f"✓ Deleted {employee_result.deleted_count} employee records")
    
    print()
    print("=" * 50)
    print("✅ All data cleared successfully!")
    print("You can now add new employees from scratch.")
    print("=" * 50)

if __name__ == "__main__":
    print("=" * 50)
    print("🗑️  CLEARING ALL DATABASE DATA")
    print("=" * 50)
    print()
    clear_all_data()
