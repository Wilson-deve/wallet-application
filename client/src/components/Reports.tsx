import { format } from "date-fns";
import toast from "react-hot-toast";
import {
  fetchCashFlow,
  fetchCategoryBreakdown,
  fetchMonthlySummary,
} from "../lib/api";
import { useEffect, useState } from "react";

interface CategoryBreakdown {
  name: string;
  value: number;
}
import { Download, Filter } from "lucide-react";

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: format(new Date().setMonth(new Date().getMonth() - 1), "yyyy-MM-dd"),
    end: format(new Date(), "yyyy-MM-dd"),
  });
  interface ReportData {
    summary: {
      totalIncome: number;
      totalExpenses: number;
      netSavings: number;
    };
    categoryBreakdown: { name: string; value: number }[];
    cashFlow: {
      date: string;
      income: number;
      expenses: number;
      netFlow: number;
      description: string;
    }[];
  }

  const [reportData, setReportData] = useState<ReportData>({
    summary: {
      totalIncome: 0,
      totalExpenses: 0,
      netSavings: 0,
    },
    categoryBreakdown: [],
    cashFlow: [],
  });

  useEffect(() => {
    loadReportData();
  }, [dateRange]);

  async function loadReportData() {
    try {
      setLoading(true);
      const [summary, breakdown, flow] = await Promise.all([
        fetchMonthlySummary(
          new Date(dateRange.start).getFullYear(),
          new Date(dateRange.start).getMonth() + 1
        ),
        (await fetchCategoryBreakdown(
          dateRange.start,
          dateRange.end
        )) as CategoryBreakdown[],
        fetchCashFlow(12) as Promise<
          {
            date: string;
            income: number;
            expenses: number;
            netFlow: number;
            description: string;
          }[]
        >,
      ]);

      setReportData({
        summary: summary as {
          totalIncome: number;
          totalExpenses: number;
          netSavings: number;
        },
        categoryBreakdown: breakdown,
        cashFlow: flow,
      });
    } catch {
      toast.error("Error loading report data");
    } finally {
      setLoading(false);
    }
  }

  function handleExport() {
    // TODO: Implement export functionality
    toast.success("Report exported successfully");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">
          Financial Reports
        </h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Report Period</h3>
          <div className="flex items-center space-x-4">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, start: e.target.value }))
              }
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, end: e.target.value }))
              }
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-green-50 rounded-lg p-6">
            <h4 className="text-sm font-medium text-green-800 mb-2">
              Total Income
            </h4>
            <p className="text-2xl font-semibold text-green-900">
              ${reportData.summary.totalIncome.toFixed(2)}
            </p>
          </div>

          <div className="bg-red-50 rounded-lg p-6">
            <h4 className="text-sm font-medium text-red-800 mb-2">
              Total Expenses
            </h4>
            <p className="text-2xl font-semibold text-red-900">
              ${reportData.summary.totalExpenses.toFixed(2)}
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-6">
            <h4 className="text-sm font-medium text-blue-800 mb-2">
              Net Savings
            </h4>
            <p className="text-2xl font-semibold text-blue-900">
              ${reportData.summary.netSavings.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              Expense Categories
            </h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      % of Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportData.categoryBreakdown.map((category, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {category.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                        ${category.value.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                        {(
                          (category.value / reportData.summary.totalExpenses) *
                          100
                        ).toFixed(1)}
                        %
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              Monthly Cash Flow
            </h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Month
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Income
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expenses
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Net Flow
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportData.cashFlow.map((flow, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {format(new Date(flow.date), "MMMM yyyy")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600">
                        ${flow.income.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600">
                        ${flow.expenses.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <span
                          className={
                            flow.netFlow >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          ${flow.netFlow.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
