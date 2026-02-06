const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const EmployeesIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const AttendanceIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const HistoryIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PayrollIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

import { useState } from "react";

export default function Sidebar({ currentPage, setCurrentPage }) {
  const [isMinimized, setIsMinimized] = useState(false);
  
  const menuItems = [
    { id: "dashboard", name: "Dashboard", icon: DashboardIcon },
    { id: "employees", name: "Employees", icon: EmployeesIcon },
    { id: "attendance", name: "Attendance", icon: AttendanceIcon },
    { id: "payroll", name: "Payroll", icon: PayrollIcon },
    { id: "history", name: "History", icon: HistoryIcon },
  ];

  return (
    <div className={`bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 text-white flex flex-col shadow-2xl h-screen transition-all duration-300 ${isMinimized ? "w-20" : "w-64"}`}>
      {/* Logo/Header */}
      <div className={`p-6 border-b border-white/10 ${isMinimized ? "p-3" : ""}`}>
        <div className="flex items-center justify-between">
          <div className={`flex items-center ${isMinimized ? "justify-center w-full" : "space-x-3"}`}>
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-xl shadow-lg">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
              </svg>
            </div>
            {!isMinimized && (
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">HRMS Lite</h1>
                <p className="text-xs text-blue-300/80 font-medium">Human Resources</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Collapse Button */}
      <div className={`px-4 py-2 ${isMinimized ? "px-2" : ""}`}>
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="w-full flex items-center justify-center p-2.5 text-blue-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
          title={isMinimized ? "Expand" : "Minimize"}
        >
          <svg className={`w-5 h-5 transition-transform duration-300 ${isMinimized ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center ${isMinimized ? "justify-center" : "space-x-3"} px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                currentPage === item.id
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/50"
                  : "text-blue-100/80 hover:bg-white/10 hover:text-white"
              }`}
              title={isMinimized ? item.name : ""}
            >
              {currentPage === item.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-500/20 animate-pulse" />
              )}
              <Icon />
              {!isMinimized && (
                <>
                  <span className="font-semibold relative z-10">{item.name}</span>
                  {currentPage === item.id && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full" />
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className={`border-t border-white/10 ${isMinimized ? "p-2" : "p-4"}`}>
        <div className={`flex items-center ${isMinimized ? "justify-center" : "space-x-3"} px-4 py-3 bg-white/5 backdrop-blur-sm rounded-xl hover:bg-white/10 transition-all cursor-pointer group`}>
          <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center font-bold text-white shadow-lg group-hover:scale-110 transition-transform">
            A
          </div>
          {!isMinimized && (
            <>
              <div className="flex-1">
                <p className="font-semibold text-white">Admin User</p>
                <p className="text-xs text-blue-300/70">Administrator</p>
              </div>
              <svg className="w-5 h-5 text-blue-300/50 group-hover:text-blue-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
