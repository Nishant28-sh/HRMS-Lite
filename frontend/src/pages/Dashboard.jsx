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
    <div className="flex-1 bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-4 md:px-8 py-6 sticky top-0 z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="pt-8 lg:pt-0">
            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Dashboard</h1>
            <p className="text-gray-600 mt-1.5 font-medium text-sm md:text-base">Welcome back! Here's your HR overview for {getTodayDate()}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-8 animate-fade-in">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Employees */}
          <button
            onClick={() => setCurrentPage('employees')}
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 text-left transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-blue-100"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg shadow-blue-500/30">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                  </svg>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Employees</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{stats.totalEmployees}</p>
              <p className="text-xs text-gray-500 mt-2">Active workforce</p>
            </div>
          </button>

          {/* Marked Today */}
          <button
            onClick={() => setCurrentPage('attendance')}
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 text-left transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-teal-100"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-cyan-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-3 rounded-xl shadow-lg shadow-teal-500/30">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                  </svg>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-teal-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Marked Today</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">{stats.markedToday}</p>
              <p className="text-xs text-gray-500 mt-2">Attendance recorded</p>
            </div>
          </button>

          {/* Present Today */}
          <button
            onClick={() => {
              setHistoryFilter({ type: 'today-present' });
              setCurrentPage('history');
            }}
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 text-left transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-green-100"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl shadow-lg shadow-green-500/30">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Present Today</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{stats.presentToday}</p>
              <p className="text-xs text-gray-500 mt-2">Currently at office</p>
            </div>
          </button>

          {/* Absent Today */}
          <button
            onClick={() => {
              setHistoryFilter({ type: 'today-absent' });
              setCurrentPage('history');
            }}
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 text-left transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-orange-100"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-orange-500 to-red-600 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-xl shadow-lg shadow-orange-500/30">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                  </svg>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Absent Today</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{stats.absentToday}</p>
              <p className="text-xs text-gray-500 mt-2">Not present today</p>
            </div>
          </button>
        </div>

        {/* Recent Employees */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Recent Employees</h2>
              <p className="text-gray-500 text-sm mt-1">Latest additions to your team</p>
            </div>
            <button
              onClick={() => setCurrentPage('employees')}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all text-sm font-semibold"
            >
              View All
            </button>
          </div>
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent absolute inset-0"></div>
              </div>
            </div>
          ) : employees.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-12 w-12 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                </svg>
              </div>
              <p className="text-gray-600 font-semibold text-lg">No employees added yet</p>
              <p className="text-gray-400 text-sm mt-2">Start by adding your first team member</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {employees.slice(0, 6).map((emp, idx) => (
                <div 
                  key={emp.employee_id} 
                  className="group border border-gray-200/50 rounded-xl p-5 hover:shadow-xl hover:border-blue-200 transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50 hover:from-blue-50/50 hover:to-indigo-50/50"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className={`w-14 h-14 bg-gradient-to-br ${
                        idx % 4 === 0 ? 'from-blue-500 to-indigo-600' :
                        idx % 4 === 1 ? 'from-purple-500 to-pink-600' :
                        idx % 4 === 2 ? 'from-green-500 to-teal-600' :
                        'from-orange-500 to-red-600'
                      } rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform`}>
                        {emp.full_name?.charAt(0).toUpperCase() || 'N'}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-800 truncate group-hover:text-blue-600 transition-colors">{emp.full_name || 'Unknown'}</p>
                      <p className="text-sm text-gray-500 font-medium">{emp.employee_id}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{emp.department}</p>
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
