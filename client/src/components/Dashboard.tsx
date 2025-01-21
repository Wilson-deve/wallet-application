import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  fetchAccounts,
  fetchCategoryBreakdown,
  fetchMonthlySummary,
} from "../lib/api";
import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";
import BudgetNotification from "./BudgetNotification";
import toast from "react-hot-toast";

function Dashboard() {
  const [summary, setSummary] = useState({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
  });

  const [monthlyData, setMonthlyData] = useState<
    { month: string; income: number; expenses: number }[]
  >([]);
  const [categoryData, setCategoryData] = useState<
    { name: string; value: number }[]
  >([]);

  useEffect(() => {
    fetchSummaryData();
    fetchMonthlyData();
    fetchCategoryData();
  }, []);

  async function fetchSummaryData() {
    try {
      // Get total balance from all accounts
      const accounts = await fetchAccounts();
      const totalBalance = (accounts as { balance: number }[]).reduce(
        (sum, acc) => sum + acc.balance,
        0
      );

      // Get current month's summary
      const currentDate = new Date();
      const summary = (await fetchMonthlySummary(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1
      )) as { totalIncome: number; totalExpenses: number };

      setSummary({
        totalBalance,
        monthlyIncome: summary.totalIncome,
        monthlyExpenses: summary.totalExpenses,
      });
    } catch (error) {
      toast.error("Error fetching summary data");
      console.error("Error fetching summary data:", error);
    }
  }

  async function fetchMonthlyData() {
    try {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 11);
      const endDate = new Date();

      const data = (await fetchCategoryBreakdown(
        startDate.toISOString(),
        endDate.toISOString()
      )) as { month: string; income: number; expenses: number }[];
      setMonthlyData(data);
    } catch (error) {
      toast.error("Error fetching monthly data");
      console.error("Error:", error);
    }
  }

  async function fetchCategoryData() {
    try {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      const endDate = new Date();

      const data = await fetchCategoryBreakdown(
        startDate.toISOString(),
        endDate.toISOString()
      );
      setCategoryData(data as { name: string; value: number }[]);
    } catch (error) {
      toast.error("Error fetching category data");
      console.error("Error fetching category data:", error);
    }
  }

  const COLORS = ["#10B981", "#3B82F6", "#6366F1", "#8B5CF6", "#EC4899"];
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Financial Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Balance</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${summary.totalBalance.toFixed(2)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Wallet className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Monthly Income
              </p>
              <p className="text-2xl font-semibold text-green-600">
                +${summary.monthlyIncome.toFixed(2)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <ArrowUpRight className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Monthly Expenses
              </p>
              <p className="text-2xl font-semibold text-red-600">
                -${summary.monthlyExpenses.toFixed(2)}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <ArrowDownLeft className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Monthly Overview
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#10B981" name="Income" />
                <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Expenses by Category
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <BudgetNotification />
    </div>
  );
}
export default Dashboard;
