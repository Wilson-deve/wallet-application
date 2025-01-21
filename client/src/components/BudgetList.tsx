import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchBudgetStatus } from "../lib/api";
import { AlertTriangle, Plus } from "lucide-react";
import { format } from "date-fns";
import BudgetForm from "./BudgetForm";

interface Budget {
  id: string;
  category: { name: string };
  amount: number;
  period: "monthly" | "yearly";
  startDate: string;
  endDatee: string;
  currentSpending: number;
  percentageUsed: number;
  status: "OK" | "WARNING" | "EXCEEDED";
}

const BudgetList = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadBudgets();
  }, []);

  async function loadBudgets() {
    try {
      setLoading(true);
      const status = await fetchBudgetStatus();
      setBudgets(status as Budget[]);
    } catch {
      toast.error("Error loading budgets");
    } finally {
      setLoading(false);
    }
  }

  function getStatusColor(status: Budget["status"]) {
    switch (status) {
      case "EXCEEDED":
        return "text-red-600 bg-red-100";
      case "WARNING":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-green-600 bg-green-100";
    }
  }
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Budgets</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Set Budget
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading budgets...</div>
      ) : budgets.length === 0 ? (
        <div className="text-center text-gray-500">No budgets set</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((budget) => (
            <div
              key={budget.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {budget.category.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {format(new Date(budget.startDate), "MMM d, yyyy")} -{" "}
                    {format(new Date(budget.endDatee), "MMM d, yyyy")}
                  </p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full ${getStatusColor(
                    budget.status
                  )}`}
                >
                  {budget.status === "EXCEEDED" ? (
                    <AlertTriangle className="h-5 w-5" />
                  ) : (
                    `${budget.percentageUsed.toFixed(1)}%`
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Budget</span>
                  <span className="font-medium">
                    ${budget.amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Spent</span>
                  <span className="font-medium">
                    ${budget.currentSpending.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Remaining</span>
                  <span
                    className={`font-medium ${
                      budget.amount - budget.currentSpending < 0
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    ${(budget.amount - budget.currentSpending).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      budget.percentageUsed >= 100
                        ? "bg-red-600"
                        : budget.percentageUsed >= 80
                        ? "bg-yellow-500"
                        : "bg-green-600"
                    }`}
                    style={{
                      width: `${Math.min(budget.percentageUsed, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <BudgetForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            loadBudgets();
          }}
        />
      )}
    </div>
  );
};

export default BudgetList;
