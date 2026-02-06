from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)
db = client["hrms_lite"]

employee_collection = db["employees"]
attendance_collection = db["attendance"]

# Initialize database indexes
def init_db():
    """Initialize database collections and indexes"""
    employee_collection.create_index("employee_id", unique=True)
    employee_collection.create_index("email", unique=True)
    attendance_collection.create_index([("employee_id", 1), ("date", -1)])
