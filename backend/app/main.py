from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import employee, attendance, salary

app = FastAPI(title="HRMS Lite API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(employee.router)
app.include_router(attendance.router)
app.include_router(attendance.stats_router)
app.include_router(salary.router)

@app.get("/")
def root():
    return {"message": "HRMS Lite API is running"}
