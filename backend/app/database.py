from pymongo import MongoClient
import os
from dotenv import load_dotenv
import certifi

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

# Add SSL/TLS configuration for Python 3.13 compatibility
client = MongoClient(
    MONGO_URI,
    tlsCAFile=certifi.where(),
    serverSelectionTimeoutMS=5000,
    connectTimeoutMS=10000,
    socketTimeoutMS=10000
)
db = client["hrms_lite"]

employee_collection = db["employees"]
attendance_collection = db["attendance"]

# Initialize database indexes
def init_db():
    """Initialize database collections and indexes"""
    employee_collection.create_index("employee_id", unique=True)
    employee_collection.create_index("email", unique=True)
    attendance_collection.create_index([("employee_id", 1), ("date", -1)])
