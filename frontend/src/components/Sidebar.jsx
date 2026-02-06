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


import { useState } from "react";

export default function Sidebar({ currentPage, setCurrentPage }) {
  const [isMinimized, setIsMinimized] = useState(false);
  
  const menuItems = [
    { id: "dashboard", name: "Dashboard", icon: DashboardIcon },
    { id: "employees", name: "Employees", icon: EmployeesIcon },
    { id: "attendance", name: "Attendance", icon: AttendanceIcon },
    { id: "history", name: "History", icon: HistoryIcon },
  ];

  return (
    <div className={`bg-white text-gray-800 flex flex-col shadow-xl border-r border-gray-200 h-screen transition-all duration-300 ${isMinimized ? "w-20" : "w-64"}`}>
      {/* Logo/Header with Collapse Button */}
      <div className={`p-6 border-b border-gray-200 ${isMinimized ? "p-3" : ""}`}>
        <div className="flex items-center justify-between gap-2">
          <div className={`flex items-center ${isMinimized ? "justify-center w-full" : "space-x-3"}`}>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 rounded-xl shadow-md flex-shrink-0">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
              </svg>
            </div>
            {!isMinimized && (
              <div>
                <h1 className="text-xl font-bold text-gray-900">HRMS Lite</h1>
                <p className="text-xs text-gray-500 font-medium">Human Resources</p>
              </div>
            )}
          </div>
          
          {/* Collapse/Expand Button - Top Right */}
          {!isMinimized && (
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all flex-shrink-0"
              title="Minimize"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Expand button when minimized - at top */}
      {isMinimized && (
        <div className="p-2">
          <button
            onClick={() => setIsMinimized(false)}
            className="w-full p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all flex justify-center"
            title="Expand"
          >
            <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                setCurrentPage(item.id);
                // Auto-expand when clicking menu items while minimized
                if (isMinimized) {
                  setIsMinimized(false);
                }
              }}
              className={`w-full flex items-center ${isMinimized ? "justify-center" : "space-x-3"} px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                currentPage === item.id
                  ? "bg-blue-50 text-blue-600 shadow-sm border border-blue-100"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
              title={isMinimized ? item.name : ""}
            >
              {currentPage === item.id && (
                <div className="absolute inset-0 bg-blue-50/50" />
              )}
              <Icon />
              {!isMinimized && (
                <>
                  <span className="font-semibold relative z-10">{item.name}</span>
                  {currentPage === item.id && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-l-full" />
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className={`border-t border-gray-200 ${isMinimized ? "p-2" : "p-4"}`}>
        <div className={`flex items-center ${isMinimized ? "justify-center" : "space-x-3"} px-4 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer group`}>
          <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center font-bold text-white shadow-md group-hover:scale-110 transition-transform">
            A
          </div>
          {!isMinimized && (
            <>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
