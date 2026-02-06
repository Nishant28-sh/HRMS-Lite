import { useEffect, useState } from "react";
import API from "../services/api";

export default function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [status, setStatus] = useState("Present");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [mode, setMode] = useState("mark"); // 'mark' or 'update'
  const [attendanceRecord, setAttendanceRecord] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const fetchEmployees = async () => {
    try {
      const res = await API.get("/employees");
      setEmployees(res.data);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmployee) {
      setMessage({ type: "error", text: "Please select an employee" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await API.post("/attendance/", {
        employee_id: selectedEmployee,
        date,
        status,
      });
      setMessage({ type: "success", text: "Attendance marked successfully!" });
      setSelectedEmployee("");
      setStatus("Present");
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.detail || "Failed to mark attendance",
      });
    } finally {
      setLoading(false);
    }
  };

  const searchAttendance = async () => {
    if (!selectedEmployee || !date) {
      setMessage({ type: "error", text: "Please select employee and date" });
      return;
    }

    setSearchLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await API.get(`/attendance/${selectedEmployee}`);
      const record = res.data.find(r => r.date === date);
      
      if (record) {
        setAttendanceRecord(record);
        setStatus(record.status);
      } else {
        setMessage({ type: "error", text: "No attendance record found for this date" });
        setAttendanceRecord(null);
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: "Failed to fetch attendance record",
      });
    } finally {
      setSearchLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!attendanceRecord) {
      setMessage({ type: "error", text: "No record selected to update" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await API.put(`/attendance/${attendanceRecord.id}`, {
        status,
      });
      setMessage({ type: "success", text: "Attendance updated successfully!" });
      setAttendanceRecord(null);
      setSelectedEmployee("");
      setStatus("Present");
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.detail || "Failed to update attendance",
      });
    } finally {
      setLoading(false);
    }
  };

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
    <div className="flex-1 bg-gradient-to-br from-gray-50 via-blue-50/20 to-gray-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-4 md:px-8 py-8 sticky top-0 z-10">
        <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent pt-8 lg:pt-0">Attendance Management</h1>
        <p className="text-gray-600 mt-2 font-medium text-sm md:text-base">Mark or update attendance for <span className="font-semibold text-blue-600">{getTodayDate()}</span></p>
      </div>

      {/* Mode Toggle */}
      <div className="px-4 md:px-8 pt-8">
        <div className="max-w-2xl mx-auto mb-8">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                setMode("mark");
                setMessage({ type: "", text: "" });
                setAttendanceRecord(null);
                setSelectedEmployee("");
                setStatus("Present");
              }}
              className={`py-4 px-6 rounded-xl font-bold text-lg uppercase tracking-wide transition-all ${
                mode === "mark"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/40"
                  : "bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300"
              }`}
            >
              <svg className="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
              </svg>
              <span className="hidden sm:inline">Mark New</span>
            </button>
            <button
              onClick={() => {
                setMode("update");
                setMessage({ type: "", text: "" });
                setAttendanceRecord(null);
                setSelectedEmployee("");
                setStatus("Present");
              }}
              className={`py-4 px-6 rounded-xl font-bold text-lg uppercase tracking-wide transition-all ${
                mode === "update"
                  ? "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg shadow-orange-500/40"
                  : "bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300"
              }`}
            >
              <svg className="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
              </svg>
              <span className="hidden sm:inline">Update</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-8 animate-fade-in">
        <div className="max-w-2xl mx-auto">
          {employees.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-16 text-center border border-gray-200/50">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-12 w-12 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                </svg>
              </div>
              <p className="text-gray-800 font-bold text-xl">No employees available</p>
              <p className="text-gray-500 mt-2">Add employees first to mark attendance.</p>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-10 border border-gray-200/50">
              {mode === "mark" ? (
                // Mark New Attendance Form
                <form onSubmit={handleSubmit} className="space-y-8">
                {/* Employee Selection */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM9 10a6 6 0 11-12 0 6 6 0 0112 0zM14.5 9a.5.5 0 01.5.5v2a.5.5 0 01-.5.5h-2a.5.5 0 010-1h1.5V9.5a.5.5 0 01.5-.5z"/>
                    </svg>
                    Select Employee
                  </label>
                  <select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-300 bg-white text-gray-900 font-medium"
                    required
                  >
                    <option value="">Choose an employee...</option>
                    {employees.map((emp) => (
                      <option key={emp.employee_id} value={emp.employee_id}>
                        {emp.employee_id} - {emp.full_name} ({emp.department})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date & Status Row */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Date Selection */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                      </svg>
                      Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-300 bg-white text-gray-900 font-medium"
                      required
                    />
                  </div>

                  {/* Status Selection */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-300 bg-white text-gray-900 font-medium"
                    >
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                    </select>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-xl font-bold text-white text-lg uppercase tracking-wide transition-all transform duration-200 shadow-lg ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 hover:from-green-600 hover:via-emerald-600 hover:to-teal-700 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                      Marking...
                    </div>
                  ) : (
                    "Mark Attendance"
                  )}
                </button>

                {/* Message */}
                {message.text && (
                  <div
                    className={`p-5 rounded-xl border-l-4 backdrop-blur-sm animate-slide-up ${
                      message.type === "success"
                        ? "bg-gradient-to-r from-green-50 to-emerald-50 border-l-green-500 text-green-800"
                        : "bg-gradient-to-r from-red-50 to-orange-50 border-l-red-500 text-red-800"
                    }`}
                  >
                    <div className="flex items-center">
                      {message.type === "success" ? (
                        <svg className="w-6 h-6 mr-3 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 mr-3 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                        </svg>
                      )}
                      <span className="font-semibold text-base">{message.text}</span>
                    </div>
                  </div>
                )}
              </form>
              ) : (
                // Update Existing Attendance Form
                <form onSubmit={handleUpdate} className="space-y-8">
                  {/* Employee Selection */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide flex items-center">
                      <svg className="w-5 h-5 mr-2 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM9 10a6 6 0 11-12 0 6 6 0 0112 0zM14.5 9a.5.5 0 01.5.5v2a.5.5 0 01-.5.5h-2a.5.5 0 010-1h1.5V9.5a.5.5 0 01.5-.5z"/>
                      </svg>
                      Select Employee
                    </label>
                    <select
                      value={selectedEmployee}
                      onChange={(e) => {
                        setSelectedEmployee(e.target.value);
                        setAttendanceRecord(null);
                        setMessage({ type: "", text: "" });
                      }}
                      className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all hover:border-gray-300 bg-white text-gray-900 font-medium"
                      required
                    >
                      <option value="">Choose an employee...</option>
                      {employees.map((emp) => (
                        <option key={emp.employee_id} value={emp.employee_id}>
                          {emp.employee_id} - {emp.full_name} ({emp.department})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date Selection & Search */}
                  <div className="grid grid-cols-3 gap-6">
                    {/* Date Selection */}
                    <div className="col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide flex items-center">
                        <svg className="w-5 h-5 mr-2 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                        </svg>
                        Date
                      </label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => {
                          setDate(e.target.value);
                          setAttendanceRecord(null);
                          setMessage({ type: "", text: "" });
                        }}
                        className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all hover:border-gray-300 bg-white text-gray-900 font-medium"
                        required
                      />
                    </div>

                    {/* Search Button */}
                    <div className="flex flex-col justify-end">
                      <button
                        type="button"
                        onClick={searchAttendance}
                        disabled={searchLoading || !selectedEmployee || !date}
                        className={`py-3.5 px-6 rounded-xl font-bold text-white text-sm uppercase tracking-wide transition-all ${
                          searchLoading || !selectedEmployee || !date
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        }`}
                      >
                        {searchLoading ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                            Searching...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
                            </svg>
                            Search
                          </div>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Current Record Info */}
                  {attendanceRecord && (
                    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6 border-2 border-orange-200">
                      <p className="text-sm font-semibold text-orange-700 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd"/>
                        </svg>
                        Record Found
                      </p>
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div>
                          <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Date</p>
                          <p className="text-lg font-bold text-gray-900">{attendanceRecord.date}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Current Status</p>
                          <div className="flex items-center">
                            {attendanceRecord.status === "Present" ? (
                              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold bg-gradient-to-r from-green-100 to-emerald-100 text-green-700">
                                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                </svg>
                                Present
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold bg-gradient-to-r from-red-100 to-orange-100 text-red-700">
                                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                                </svg>
                                Absent
                              </span>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-600 uppercase mb-1">New Status</p>
                          <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white text-gray-900 font-semibold text-sm"
                          >
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Update Button */}
                  <button
                    type="submit"
                    disabled={loading || !attendanceRecord}
                    className={`w-full py-4 rounded-xl font-bold text-white text-lg uppercase tracking-wide transition-all transform duration-200 shadow-lg ${
                      loading || !attendanceRecord
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                        Updating...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                        </svg>
                        Update Attendance
                      </div>
                    )}
                  </button>

                  {/* Message */}
                  {message.text && (
                    <div
                      className={`p-5 rounded-xl border-l-4 backdrop-blur-sm animate-slide-up ${
                        message.type === "success"
                          ? "bg-gradient-to-r from-green-50 to-emerald-50 border-l-green-500 text-green-800"
                          : "bg-gradient-to-r from-red-50 to-orange-50 border-l-red-500 text-red-800"
                      }`}
                    >
                      <div className="flex items-center">
                        {message.type === "success" ? (
                          <svg className="w-6 h-6 mr-3 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                        ) : (
                          <svg className="w-6 h-6 mr-3 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                          </svg>
                        )}
                        <span className="font-semibold text-base">{message.text}</span>
                      </div>
                    </div>
                  )}
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
