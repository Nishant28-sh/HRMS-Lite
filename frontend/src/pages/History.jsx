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
    if (filter && filter.type && filter.type.startsWith('today-')) {
      fetchTodayAttendance();
    }
  }, [filter]);

  useEffect(() => {
    if (selectedEmployee) {
      fetchAttendance(selectedEmployee);
    } else {
      setRecords([]);
    }
  }, [selectedEmployee]);

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
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{getFilterTitle()}</h1>
          <p className="text-gray-500 mt-1">
            {showTodayView 
              ? `Viewing attendance records for ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`
              : "View detailed attendance records for each employee"
            }
          </p>
        </div>
        {showTodayView ? (
          <button
            onClick={() => {
              clearFilter();
              setSelectedEmployee("");
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            View All History
          </button>
        ) : employees.length > 0 && (
          <div className="w-64">
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select an employee</option>
              {employees.map((emp) => (
                <option key={emp.employee_id} value={emp.employee_id}>
                  {emp.full_name} ({emp.employee_id})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Date Range Filter - Only show for individual employee view */}
        {!showTodayView && selectedEmployee && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {(startDate || endDate) && (
                <div className="flex items-end">
                  <button
                    onClick={clearDateFilter}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                  >
                    Clear Filter
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        
        {showTodayView ? (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-20 w-20 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                </svg>
                <p className="text-gray-500 mt-4 text-lg">No records found</p>
                <p className="text-gray-400 mt-2">No attendance has been marked for today yet.</p>
              </div>
            ) : (
              <>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-purple-600 to-pink-600">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Employee ID</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Department</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRecords.map((record, idx) => (
                      <tr key={idx} className="hover:bg-purple-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm font-semibold text-gray-900">{record.employee.employee_id}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                              {record.employee.full_name?.charAt(0) || 'N/A'}
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-semibold text-gray-900">{record.employee.full_name}</p>
                              <p className="text-xs text-gray-500">{record.employee.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm text-gray-700">{record.employee.department}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {record.attendance?.status === "Present" ? (
                            <span className="px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                              </svg>
                              Present
                            </span>
                          ) : (
                            <span className="px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
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
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Total records: <span className="font-semibold">{filteredRecords.length}</span>
                  </p>
                </div>
              </>
            )}
          </div>
        ) : employees.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <svg className="mx-auto h-24 w-24 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
            </svg>
            <p className="text-gray-800 font-semibold mt-4 text-xl">No employees found</p>
            <p className="text-gray-500 mt-2">Add employees first to view attendance history.</p>
          </div>
        ) : !selectedEmployee ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <svg className="mx-auto h-24 w-24 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
            </svg>
            <p className="text-gray-800 font-semibold mt-4 text-xl">Select an employee</p>
            <p className="text-gray-500 mt-2">Choose an employee to view their attendance history.</p>
          </div>
        ) : (
          <>
            {/* Employee Statistics Cards */}
            {selectedEmployee && employeeStats.totalDays > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Total Days</p>
                      <p className="text-3xl font-bold mt-2">{employeeStats.totalDays}</p>
                    </div>
                    <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Present Days</p>
                      <p className="text-3xl font-bold mt-2">{employeeStats.presentDays}</p>
                    </div>
                    <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-md p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100 text-sm font-medium">Absent Days</p>
                      <p className="text-3xl font-bold mt-2">{employeeStats.absentDays}</p>
                    </div>
                    <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Attendance Rate</p>
                      <p className="text-3xl font-bold mt-2">{employeeStats.attendanceRate}%</p>
                    </div>
                    <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredAttendance.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-20 w-20 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                </svg>
                <p className="text-gray-500 mt-4">No attendance records found{(startDate || endDate) ? ' for the selected date range' : ' for this employee'}.</p>
              </div>
            ) : (
              <>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-purple-600 to-pink-600">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Day</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAttendance.map((record, idx) => {
                      const dateObj = new Date(record.date);
                      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                      
                      return (
                        <tr key={idx} className="hover:bg-purple-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="text-sm font-semibold text-gray-900">{record.date}</p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="text-sm text-gray-700">{dayName}</p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {record.status === "Present" ? (
                              <span className="px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                </svg>
                                Present
                              </span>
                            ) : (
                              <span className="px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
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
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    {(startDate || endDate) ? (
                      <>
                        Showing <span className="font-semibold">{filteredAttendance.length}</span> of <span className="font-semibold">{records.length}</span> records
                      </>
                    ) : (
                      <>
                        Total records: <span className="font-semibold">{records.length}</span>
                      </>
                    )}
                  </p>
                </div>
              </>
            )}
          </div>
          </>
        )}
      </div>
    </div>
  );
}
