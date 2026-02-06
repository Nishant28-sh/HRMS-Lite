import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard({ setCurrentPage, setHistoryFilter }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    markedToday: 0,
    presentToday: 0,
    absentToday: 0,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const empRes = await API.get("/employees");
      setEmployees(empRes.data);
      
      // Fetch today's attendance stats
      let markedToday = 0;
      let presentToday = 0;
      let absentToday = 0;
      
      try {
        const statsRes = await API.get("/stats/attendance/today");
        markedToday = statsRes.data.total_marked || 0;
        presentToday = statsRes.data.present || 0;
        absentToday = statsRes.data.absent || 0;
      } catch (err) {
        console.error("Failed to fetch attendance stats:", err);
      }
      
      setStats({
        totalEmployees: empRes.data.length,
        markedToday,
        presentToday,
        absentToday,
      });
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const getTodayDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's your HR overview for {getTodayDate()}</p>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Employees */}
          <button
            onClick={() => setCurrentPage('employees')}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 cursor-pointer text-left"
          >
            <div className="absolute top-0 right-0 opacity-20">
              <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
              </svg>
            </div>
            <p className="text-sm font-medium uppercase tracking-wide mb-2">Total Employees</p>
            <p className="text-5xl font-bold">{stats.totalEmployees}</p>
          </button>

          {/* Marked Today */}
          <button
            onClick={() => setCurrentPage('attendance')}
            className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden hover:from-teal-600 hover:to-teal-700 transition-all transform hover:scale-105 cursor-pointer text-left"
          >
            <div className="absolute top-0 right-0 opacity-20">
              <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
              </svg>
            </div>
            <p className="text-sm font-medium uppercase tracking-wide mb-2">Marked Today</p>
            <p className="text-5xl font-bold">{stats.markedToday}</p>
          </button>

          {/* Present Today */}
          <button
            onClick={() => {
              setHistoryFilter({ type: 'today-present' });
              setCurrentPage('history');
            }}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 cursor-pointer text-left"
          >
            <div className="absolute top-0 right-0 opacity-20">
              <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
            </div>
            <p className="text-sm font-medium uppercase tracking-wide mb-2">Present Today</p>
            <p className="text-5xl font-bold">{stats.presentToday}</p>
          </button>

          {/* Absent Today */}
          <button
            onClick={() => {
              setHistoryFilter({ type: 'today-absent' });
              setCurrentPage('history');
            }}
            className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 cursor-pointer text-left"
          >
            <div className="absolute top-0 right-0 opacity-20">
              <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
            </div>
            <p className="text-sm font-medium uppercase tracking-wide mb-2">Absent Today</p>
            <p className="text-5xl font-bold">{stats.absentToday}</p>
          </button>
        </div>

        {/* Recent Employees */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Employees</h2>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : employees.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-24 w-24 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
              </svg>
              <p className="text-gray-500 mt-4 text-lg">No employees added yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {employees.slice(0, 6).map((emp) => (
                <div key={emp.employee_id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {emp.full_name?.charAt(0).toUpperCase() || 'N/A'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{emp.full_name || 'Unknown'}</p>
                      <p className="text-sm text-gray-500">{emp.employee_id}</p>
                      <p className="text-xs text-gray-400">{emp.department}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
