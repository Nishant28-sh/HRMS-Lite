import { useEffect, useState } from "react";
import API from "../services/api";

export default function History({ filter, clearFilter }) {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [todayRecords, setTodayRecords] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [employeeStats, setEmployeeStats] = useState({
    totalDays: 0,
    presentDays: 0,
    absentDays: 0,
    attendanceRate: 0
  });

  const fetchEmployees = async () => {
    try {
      const res = await API.get("/employees");
      setEmployees(res.data);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    }
  };

  const fetchAttendance = async (empId) => {
    setLoading(true);
    try {
      const res = await API.get(`/attendance/${empId}`);
      setRecords(res.data);
      
      // Calculate statistics
      const totalDays = res.data.length;
      const presentDays = res.data.filter(r => r.status === 'Present').length;
      const absentDays = res.data.filter(r => r.status === 'Absent').length;
      const attendanceRate = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : 0;
      
      setEmployeeStats({
        totalDays,
        presentDays,
        absentDays,
        attendanceRate
      });
    } catch (err) {
      console.error("Failed to fetch attendance:", err);
      setRecords([]);
      setEmployeeStats({
        totalDays: 0,
        presentDays: 0,
        absentDays: 0,
        attendanceRate: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayAttendance = async () => {
    setLoading(true);
    try {
      const empRes = await API.get("/employees");
      const today = new Date().toISOString().split('T')[0];
      
      const recordsPromises = empRes.data.map(async (emp) => {
        try {
          const res = await API.get(`/attendance/${emp.employee_id}`);
          const todayRecord = res.data.find(r => r.date === today);
          return {
            employee: emp,
            attendance: todayRecord || null
          };
        } catch {
          return {
            employee: emp,
            attendance: null
          };
        }
      });
      
      const allRecords = await Promise.all(recordsPromises);
      setTodayRecords(allRecords);
    } catch (err) {
      console.error("Failed to fetch today's attendance:", err);
      setTodayRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (filter && filter.employeeId) {
      setSelectedEmployee(filter.employeeId);
      fetchAttendance(filter.employeeId);
    }
  }, [filter]);

  useEffect(() => {
    if (selectedEmployee) {
      fetchAttendance(selectedEmployee);
    } else {
      setRecords([]);
    }
  }, [selectedEmployee]);

  useEffect(() => {
    if (filter && filter.type && filter.type.startsWith('today-')) {
      fetchTodayAttendance();
    }
  }, [filter]);

  // Filter records by date range
  const getFilteredAttendance = () => {
    if (!startDate && !endDate) return records;
    
    return records.filter(record => {
      const recordDate = new Date(record.date);
      const start = startDate ? new Date(startDate) : new Date('1900-01-01');
      const end = endDate ? new Date(endDate) : new Date('2100-12-31');
      return recordDate >= start && recordDate <= end;
    });
  };

  const clearDateFilter = () => {
    setStartDate("");
    setEndDate("");
  };

  const handleEmployeeClick = (employeeId) => {
    clearFilter(); // Clear today view filter
    setSelectedEmployee(employeeId); // Select the employee
  };

  // Filter records based on filter type
  const getFilteredRecords = () => {
    if (!filter || !filter.type || !filter.type.startsWith('today-')) {
      return todayRecords;
    }
    
    if (filter.type === 'today-all') {
      return todayRecords.filter(r => r.attendance !== null);
    } else if (filter.type === 'today-present') {
      return todayRecords.filter(r => r.attendance && r.attendance.status === 'Present');
    } else if (filter.type === 'today-absent') {
      return todayRecords.filter(r => r.attendance && r.attendance.status === 'Absent');
    }
    return todayRecords;
  };

  const filteredRecords = getFilteredRecords();
  const filteredAttendance = getFilteredAttendance();
  const showTodayView = filter && filter.type && filter.type.startsWith('today-');

  const getFilterTitle = () => {
    if (!filter || !filter.type) return "Attendance History";
    if (filter.type === 'today-all') return "Today's Marked Attendance";
    if (filter.type === 'today-present') return "Today's Present Employees";
    if (filter.type === 'today-absent') return "Today's Absent Employees";
    return "Attendance History";
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-50 via-blue-50/20 to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 backdrop-blur-md border-b border-blue-100/50 px-4 md:px-8 py-8 sticky top-0 z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 pt-8 lg:pt-0">
          <h1 className="text-2xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">{getFilterTitle()}</h1>
          <p className="text-gray-600 mt-2.5 font-medium text-sm md:text-base">
            {showTodayView 
              ? `📅 Viewing attendance for ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`
              : "📊 View detailed attendance records for each employee"
            }
          </p>
        </div>
        {showTodayView ? (
          <button
            onClick={() => {
              clearFilter();
              setSelectedEmployee("");
            }}
            className="ml-0 md:ml-6 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3.5 rounded-xl transition-all font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transform hover:-translate-y-1 active:translate-y-0 whitespace-nowrap"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
            </svg>
            <span>View All</span>
          </button>
        ) : employees.length > 0 && (
          <div className="ml-0 md:ml-6 w-full md:w-96">
            <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">👤 Select Employee</label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full px-5 py-3.5 border-2.5 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white font-semibold text-gray-800 hover:border-blue-400 shadow-md text-sm md:text-base"
            >
              <option value="">Choose an employee...</option>
              {employees.map((emp) => (
                <option key={emp.employee_id} value={emp.employee_id}>
                  {emp.full_name} - {emp.department} ({emp.employee_id})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 md:p-8 animate-fade-in">
        {/* Date Range Filter - Only show for individual employee view */}
        {!showTodayView && selectedEmployee && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-6 border border-gray-200/50">
            <div className="flex items-end gap-6 flex-wrap">
              <div className="flex-1 min-w-[250px]">
                <label className="block text-sm font-semibold text-gray-700 mb-2.5">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-300 bg-white"
                />
              </div>
              <div className="flex-1 min-w-[250px]">
                <label className="block text-sm font-semibold text-gray-700 mb-2.5">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-300 bg-white"
                />
              </div>
              {(startDate || endDate) && (
                <button
                  onClick={clearDateFilter}
                  className="px-6 py-3.5 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all font-semibold shadow-lg transform hover:-translate-y-0.5"
                >
                  Clear Filter
                </button>
              )}
            </div>
          </div>
        )}
        
        {showTodayView ? (
          <>
            {/* Today's Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Marked */}
              <div className="group relative bg-white/90 rounded-2xl shadow-md hover:shadow-xl p-6 overflow-hidden border border-blue-100 transition-all duration-300 hover:-translate-y-1 hover:bg-white">
                <div className="absolute -right-10 -top-10 w-36 h-36 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-5 group-hover:opacity-10 group-hover:scale-125 transition-all duration-500" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-md shadow-blue-500/30 group-hover:shadow-lg group-hover:shadow-blue-500/40 transition-all">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Total Days</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">{filteredRecords.length}</p>
                </div>
              </div>

              {/* Present Days */}
              <div className="group relative bg-white/90 rounded-2xl shadow-md hover:shadow-xl p-6 overflow-hidden border border-green-100 transition-all duration-300 hover:-translate-y-1 hover:bg-white">
                <div className="absolute -right-10 -top-10 w-36 h-36 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-5 group-hover:opacity-10 group-hover:scale-125 transition-all duration-500" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-md shadow-green-500/30 group-hover:shadow-lg group-hover:shadow-green-500/40 transition-all">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Present Days</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">{filteredRecords.filter(r => r.attendance?.status === 'Present').length}</p>
                </div>
              </div>

              {/* Absent Days */}
              <div className="group relative bg-white/90 rounded-2xl shadow-md hover:shadow-xl p-6 overflow-hidden border border-red-100 transition-all duration-300 hover:-translate-y-1 hover:bg-white">
                <div className="absolute -right-10 -top-10 w-36 h-36 bg-gradient-to-br from-red-400 to-orange-500 rounded-full opacity-5 group-hover:opacity-10 group-hover:scale-125 transition-all duration-500" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-xl shadow-md shadow-red-500/30 group-hover:shadow-lg group-hover:shadow-red-500/40 transition-all">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Absent Days</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">{filteredRecords.filter(r => r.attendance?.status === 'Absent').length}</p>
                </div>
              </div>

              {/* Attendance Rate */}
              <div className="group relative bg-white/90 rounded-2xl shadow-md hover:shadow-xl p-6 overflow-hidden border border-purple-100 transition-all duration-300 hover:-translate-y-1 hover:bg-white">
                <div className="absolute -right-10 -top-10 w-36 h-36 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-5 group-hover:opacity-10 group-hover:scale-125 transition-all duration-500" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl shadow-md shadow-purple-500/30 group-hover:shadow-lg group-hover:shadow-purple-500/40 transition-all">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Attendance Rate</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                    {filteredRecords.length > 0 ? ((filteredRecords.filter(r => r.attendance?.status === 'Present').length / filteredRecords.length) * 100).toFixed(1) : '0.0'}%
                  </p>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-200/50">
              {loading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent absolute inset-0"></div>
                  </div>
                </div>
              ) : filteredRecords.length === 0 ? (
                <div className="text-center py-20">
                  <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="h-12 w-12 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <p className="text-gray-600 font-semibold text-lg">No records found</p>
                  <p className="text-gray-400 text-sm mt-2">No attendance has been marked for today yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white">
                        <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-wider">Employee</th>
                        <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider">Employee ID</th>
                        <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider">Department</th>
                        <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200/50">
                      {filteredRecords.map((record, idx) => (
                        <tr key={idx} className="group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200">
                          <td className="px-8 py-5 whitespace-nowrap">
                            <div className="flex items-center space-x-4">
                              <div className={`relative w-12 h-12 bg-gradient-to-br ${
                                idx % 5 === 0 ? 'from-blue-500 to-indigo-600' :
                                idx % 5 === 1 ? 'from-purple-500 to-pink-600' :
                                idx % 5 === 2 ? 'from-green-500 to-teal-600' :
                                idx % 5 === 3 ? 'from-orange-500 to-red-600' :
                                'from-cyan-500 to-blue-600'
                              } rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform`}>
                                {record.employee.full_name?.charAt(0) || 'N'}
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                              </div>
                              <div
                                className="cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => handleEmployeeClick(record.employee.employee_id)}
                                title="Click to view attendance history"
                              >
                                <p className="text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors">{record.employee.full_name}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{record.employee.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="inline-flex items-center bg-blue-50 px-3 py-1.5 rounded-lg">
                              <span className="text-sm font-semibold text-blue-700">{record.employee.employee_id}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className="px-4 py-1.5 inline-flex text-xs leading-5 font-bold rounded-full bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 shadow-sm">
                              {record.employee.department}
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            {record.attendance?.status === "Present" ? (
                              <span className="px-4 py-1.5 inline-flex items-center text-xs leading-5 font-bold rounded-full bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 shadow-sm">
                                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                </svg>
                                Present
                              </span>
                            ) : (
                              <span className="px-4 py-1.5 inline-flex items-center text-xs leading-5 font-bold rounded-full bg-gradient-to-r from-red-100 to-orange-100 text-red-700 shadow-sm">
                                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                                </svg>
                                Absent
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Employee History Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Days */}
              <div className="group relative bg-white/90 rounded-2xl shadow-md hover:shadow-xl p-6 overflow-hidden border border-blue-100 transition-all duration-300 hover:-translate-y-1 hover:bg-white">
                <div className="absolute -right-10 -top-10 w-36 h-36 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-5 group-hover:opacity-10 group-hover:scale-125 transition-all duration-500" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-md shadow-blue-500/30 group-hover:shadow-lg group-hover:shadow-blue-500/40 transition-all">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Total Days</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">{employeeStats.totalDays}</p>
                </div>
              </div>

              {/* Present Days */}
              <div className="group relative bg-white/90 rounded-2xl shadow-md hover:shadow-xl p-6 overflow-hidden border border-green-100 transition-all duration-300 hover:-translate-y-1 hover:bg-white">
                <div className="absolute -right-10 -top-10 w-36 h-36 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-5 group-hover:opacity-10 group-hover:scale-125 transition-all duration-500" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-md shadow-green-500/30 group-hover:shadow-lg group-hover:shadow-green-500/40 transition-all">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Present Days</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">{employeeStats.presentDays}</p>
                </div>
              </div>

              {/* Absent Days */}
              <div className="group relative bg-white/90 rounded-2xl shadow-md hover:shadow-xl p-6 overflow-hidden border border-red-100 transition-all duration-300 hover:-translate-y-1 hover:bg-white">
                <div className="absolute -right-10 -top-10 w-36 h-36 bg-gradient-to-br from-red-400 to-orange-500 rounded-full opacity-5 group-hover:opacity-10 group-hover:scale-125 transition-all duration-500" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-xl shadow-md shadow-red-500/30 group-hover:shadow-lg group-hover:shadow-red-500/40 transition-all">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Absent Days</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">{employeeStats.absentDays}</p>
                </div>
              </div>

              {/* Attendance Rate */}
              <div className="group relative bg-white/90 rounded-2xl shadow-md hover:shadow-xl p-6 overflow-hidden border border-purple-100 transition-all duration-300 hover:-translate-y-1 hover:bg-white">
                <div className="absolute -right-10 -top-10 w-36 h-36 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-5 group-hover:opacity-10 group-hover:scale-125 transition-all duration-500" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl shadow-md shadow-purple-500/30 group-hover:shadow-lg group-hover:shadow-purple-500/40 transition-all">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Attendance Rate</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">{employeeStats.attendanceRate}%</p>
                </div>
              </div>
            </div>
            
            {/* Attendance Table */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-200/50">
              {loading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent absolute inset-0"></div>
                  </div>
                </div>
              ) : filteredAttendance.length === 0 ? (
                <div className="text-center py-24">
                  <div className="bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <svg className="h-14 w-14 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <p className="text-gray-900 font-bold text-2xl">No records found</p>
                  <p className="text-gray-600 text-lg mt-3">No attendance records {(startDate || endDate) ? 'for the selected date range' : 'for this employee'}.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white">
                        <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-wider">Date</th>
                        <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider">Day</th>
                        <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200/50">
                      {filteredAttendance.map((record, idx) => {
                        const dateObj = new Date(record.date);
                        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                        
                        return (
                          <tr key={idx} className="group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200">
                            <td className="px-8 py-5 whitespace-nowrap">
                              <p className="text-sm font-bold text-gray-900">{record.date}</p>
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap">
                              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                {dayName}
                              </span>
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap">
                              {record.status === "Present" ? (
                                <span className="px-4 py-1.5 inline-flex items-center text-xs leading-5 font-bold rounded-full bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 shadow-sm">
                                  <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                  </svg>
                                  Present
                                </span>
                              ) : (
                                <span className="px-4 py-1.5 inline-flex items-center text-xs leading-5 font-bold rounded-full bg-gradient-to-r from-red-100 to-orange-100 text-red-700 shadow-sm">
                                  <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                                  </svg>
                                  Absent
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
