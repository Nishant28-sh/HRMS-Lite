import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard({ setCurrentPage, setHistoryFilter }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);
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
      
      // Fetch recent attendance for activity feed
      try {
        const activityRes = await API.get("/attendance/all");
        const sortedActivity = activityRes.data
          .sort((a, b) => new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date))
          .slice(0, 5);
        setRecentActivity(sortedActivity);
      } catch (err) {
        console.error("Failed to fetch recent activity:", err);
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

  const getTodayDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <h1 className="text-3xl font-bold text-gray-800">{getGreeting()}, Admin 👋</h1>
        <p className="text-gray-600 mt-1">Here's your HR overview for today, {getTodayDate()}</p>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Total Employees */}
          <button
            onClick={() => setCurrentPage('employees')}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                </svg>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">{stats.totalEmployees}</p>
                <p className="text-sm font-semibold text-gray-600">Total Employees</p>
                <p className="text-xs text-gray-500 mt-1">Active employees</p>
              </div>
            </div>
          </button>

          {/* Marked Today */}
          <button
            onClick={() => setCurrentPage('attendance')}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">{stats.markedToday}</p>
                <p className="text-sm font-semibold text-gray-600">Marked Today</p>
                <p className="text-xs text-gray-500 mt-1">{stats.markedToday} out of {stats.totalEmployees}</p>
              </div>
            </div>
          </button>

          {/* Present Today */}
          <button
            onClick={() => {
              setHistoryFilter({ type: 'today-present' });
              setCurrentPage('history');
            }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">{stats.presentToday}</p>
                <p className="text-sm font-semibold text-gray-600">Present Today</p>
                <p className="text-xs text-gray-500 mt-1">Currently working</p>
              </div>
            </div>
          </button>

          {/* Absent Today */}
          <button
            onClick={() => {
              setHistoryFilter({ type: 'today-absent' });
              setCurrentPage('history');
            }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-red-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">{stats.absentToday}</p>
                <p className="text-sm font-semibold text-gray-600">Absent Today</p>
                <p className="text-xs text-gray-500 mt-1">Need follow-up</p>
              </div>
            </div>
          </button>
        </div>

        {/* Main Grid - 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Attention Required */}
            {stats.totalEmployees > stats.markedToday && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="bg-yellow-100 p-2 rounded-lg">
                      <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">Attention Required</h3>
                      <p className="text-gray-600 mt-1">
                        <span className="font-semibold">{stats.totalEmployees - stats.markedToday} employees</span> have not been marked yet
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Attendance incomplete for today</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setCurrentPage('attendance')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Mark Attendance
                  </button>
                </div>
              </div>
            )}

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                  </svg>
                </button>
              </div>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                </div>
              ) : recentActivity.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No recent activity</p>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((activity, idx) => {
                    const employee = employees.find(e => e.employee_id === activity.employee_id);
                    const isPresentStatus = activity.status?.toLowerCase() === 'present';
                    const isAbsentStatus = activity.status?.toLowerCase() === 'absent';
                    
                    return (
                      <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isPresentStatus ? 'bg-green-100' :
                            isAbsentStatus ? 'bg-red-100' :
                            'bg-blue-100'
                          }`}>
                            {isPresentStatus ? (
                              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                              </svg>
                            ) : isAbsentStatus ? (
                              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-gray-800">
                              <span className="font-semibold">{employee?.full_name || activity.employee_id}</span>
                              {' '}marked{' '}
                              <span className={`font-semibold ${
                                isPresentStatus ? 'text-green-600' :
                                isAbsentStatus ? 'text-red-600' :
                                'text-gray-600'
                              }`}>
                                {activity.status}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => setCurrentPage('employees')}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-all group"
                >
                  <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"/>
                    </svg>
                  </div>
                  <span className="font-semibold text-gray-700 text-sm">Add Employee</span>
                </button>

                <button
                  onClick={() => setCurrentPage('attendance')}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-yellow-50 hover:border-yellow-300 transition-all group"
                >
                  <div className="bg-yellow-100 p-2 rounded-lg group-hover:bg-yellow-200">
                    <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="font-semibold text-gray-700 text-sm">Mark Attendance</span>
                </button>

                <button
                  onClick={() => setCurrentPage('history')}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-purple-50 hover:border-purple-300 transition-all group"
                >
                  <div className="bg-purple-100 p-2 rounded-lg group-hover:bg-purple-200">
                    <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="font-semibold text-gray-700 text-sm">View History</span>
                </button>
              </div>
            </div>

            {/* Recent Activity - Duplicate for mobile view */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
              <div className="space-y-3">
                <button
                  onClick={() => setCurrentPage('employees')}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-all text-left"
                >
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"/>
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">Add Employee</span>
                </button>

                <button
                  onClick={() => setCurrentPage('attendance')}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-all text-left"
                >
                  <div className="bg-yellow-100 p-2 rounded-lg">
                    <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">Mark Attendance</span>
                </button>

                <button
                  onClick={() => setCurrentPage('history')}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-all text-left"
                >
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">View History</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
