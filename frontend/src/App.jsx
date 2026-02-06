import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import History from "./pages/History";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [historyFilter, setHistoryFilter] = useState(null);

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard setCurrentPage={setCurrentPage} setHistoryFilter={setHistoryFilter} />;
      case "employees":
        return <Employees />;
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
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex-1 overflow-auto">
        {renderPage()}
      </div>
    </div>
  );
}

export default App;
