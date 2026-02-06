import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import History from "./pages/History";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [historyFilter, setHistoryFilter] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard setCurrentPage={setCurrentPage} setHistoryFilter={setHistoryFilter} />;
      case "employees":
        return <Employees setCurrentPage={setCurrentPage} setHistoryFilter={setHistoryFilter} />;
      case "attendance":
        return <Attendance />;
      case "history":
        return <History filter={historyFilter} clearFilter={() => setHistoryFilter(null)} />;
      default:
        return <Dashboard setCurrentPage={setCurrentPage} setHistoryFilter={setHistoryFilter} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {sidebarOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:relative w-64 h-screen z-40 lg:z-auto transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        <Sidebar 
          currentPage={currentPage} 
          setCurrentPage={(page) => {
            setCurrentPage(page);
            setSidebarOpen(false);
          }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto w-full">
        {renderPage()}
      </div>
    </div>
  );
}

export default App;
