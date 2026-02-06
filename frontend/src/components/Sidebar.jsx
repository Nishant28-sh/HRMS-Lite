export default function Sidebar({ currentPage, setCurrentPage }) {
  const menuItems = [
    { id: "dashboard", name: "Dashboard", icon: "📊" },
    { id: "employees", name: "Employees", icon: "👥" },
    { id: "attendance", name: "Attendance", icon: "📋" },
    { id: "history", name: "History", icon: "📅" },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 border-b border-blue-500">
        <div className="flex items-center space-x-2">
          <div className="bg-white/20 p-2 rounded-lg">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold">HRMS Lite</h1>
            <p className="text-xs text-blue-200">Human Resources</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-all ${
              currentPage === item.id
                ? "bg-blue-500 text-white shadow-lg"
                : "text-blue-100 hover:bg-blue-700"
            }`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </button>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-blue-500">
        <div className="flex items-center space-x-3 px-4 py-3 bg-blue-700 rounded-lg">
          <div className="w-10 h-10 bg-teal-400 rounded-full flex items-center justify-center font-bold text-white">
            A
          </div>
          <div>
            <p className="font-medium">Admin User</p>
            <p className="text-xs text-blue-200">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
}
