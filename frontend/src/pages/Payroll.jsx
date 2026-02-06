import { useEffect, useState } from "react";
import API from "../services/api";

export default function Payroll() {
  const [employees, setEmployees] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [showForm, setShowForm] = useState(false);
  const [summary, setSummary] = useState(null);

  const [form, setForm] = useState({
    employee_id: "",
    month: selectedMonth,
    base_salary: "",
    bonus: 0,
    deductions: 0,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const empRes = await API.get("/employees");
      setEmployees(empRes.data);

      const salRes = await API.get(`/salary/month/${selectedMonth}`);
      setSalaries(salRes.data);

      const sumRes = await API.get(`/salary/payroll/summary/${selectedMonth}`);
      setSummary(sumRes.data);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedMonth]);

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/salary", {
        ...form,
        base_salary: parseFloat(form.base_salary),
        bonus: parseFloat(form.bonus) || 0,
        deductions: parseFloat(form.deductions) || 0,
        month: selectedMonth,
      });

      setForm({
        employee_id: "",
        month: selectedMonth,
        base_salary: "",
        bonus: 0,
        deductions: 0,
      });
      setShowForm(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to add salary record");
    }
  };

  const handleDelete = async (salaryId) => {
    if (!confirm("Are you sure you want to delete this salary record?")) return;
    try {
      await API.delete(`/salary/${salaryId}`);
      fetchData();
    } catch (err) {
      alert("Failed to delete salary record");
    }
  };

  return (
    <div className="flex-1 bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow sticky top-0 z-10">
        <div className="px-4 md:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Payroll Management
              </h1>
              <p className="mt-1 text-gray-600">
                Manage employee salaries and payroll
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-all font-semibold whitespace-nowrap"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span className="hidden sm:inline">
                {showForm ? "Close Form" : "Add Salary"}
              </span>
            </button>
          </div>

          {/* Month Selector */}
          <div className="mt-4">
            <label className="text-sm font-semibold text-gray-700">
              Select Month:
            </label>
            <input
              type="month"
              value={selectedMonth}
              onChange={handleMonthChange}
              className="mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-8">
        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Employees */}
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold uppercase">
                    Total Employees
                  </p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    {summary.total_employees}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v2h8v-2zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-2a4 4 0 00-8 0v2h8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Total Base Salary */}
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold uppercase">
                    Total Base Salary
                  </p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    ₹{summary.total_base_salary.toLocaleString()}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M8.16 2.75a.75.75 0 00-1.32 0l-.918 2.044a.75.75 0 01-.576.416l-2.244.157a.75.75 0 00-.416 1.28l1.625 1.582a.75.75 0 01.216.84l-.384 2.232a.75.75 0 001.09.792l2.007-1.055a.75.75 0 01.698 0l2.007 1.055a.75.75 0 001.09-.792l-.384-2.232a.75.75 0 01.216-.84l1.625-1.582a.75.75 0 00-.416-1.28l-2.244-.157a.75.75 0 01-.576-.416L8.16 2.75z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Total Bonus */}
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold uppercase">
                    Total Bonus
                  </p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    ₹{summary.total_bonus.toLocaleString()}
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <svg
                    className="w-8 h-8 text-yellow-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10.5 1.5H5.75A2.25 2.25 0 003.5 3.75v12.5A2.25 2.25 0 005.75 18.5h8.5a2.25 2.25 0 002.25-2.25V6.5m-11-4h8m-8 3h5" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Total Net Salary */}
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-emerald-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold uppercase">
                    Total Net Salary
                  </p>
                  <p className="text-3xl font-bold text-emerald-600 mt-2">
                    ₹{summary.total_net_salary.toLocaleString()}
                  </p>
                </div>
                <div className="bg-emerald-100 p-3 rounded-lg">
                  <svg
                    className="w-8 h-8 text-emerald-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Salary Form */}
        {showForm && (
          <div className="mb-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Add Salary Record</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Employee
                  </label>
                  <select
                    required
                    value={form.employee_id}
                    onChange={(e) =>
                      setForm({ ...form, employee_id: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp.employee_id} value={emp.employee_id}>
                        {emp.full_name} ({emp.employee_id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Base Salary
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="0.00"
                    value={form.base_salary}
                    onChange={(e) =>
                      setForm({ ...form, base_salary: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bonus
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={form.bonus}
                    onChange={(e) =>
                      setForm({ ...form, bonus: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Deductions
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={form.deductions}
                    onChange={(e) =>
                      setForm({ ...form, deductions: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all"
              >
                Add Salary Record
              </button>
            </form>
          </div>
        )}

        {/* Salaries Table */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-green-600"></div>
          </div>
        ) : salaries.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <p className="text-gray-600">No salary records for this month</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Employee
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Base Salary
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Bonus
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Deductions
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Net Salary
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {salaries.map((salary) => (
                  <tr key={salary.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900">
                      {salary.employee_name || salary.employee_id}
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      ₹{parseFloat(salary.base_salary).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      ₹{parseFloat(salary.bonus).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      ₹{parseFloat(salary.deductions).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-600">
                      ₹{parseFloat(salary.net_salary).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDelete(salary.id)}
                        className="text-red-600 hover:text-red-800 font-medium text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
