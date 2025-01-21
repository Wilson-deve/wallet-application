import { useEffect, useState } from "react";
import { fetchBudgetStatus } from "../lib/api";
import { AlertTriangle } from "lucide-react";

interface BudgetAlert {
  category: string;
  spent: number;
  limit: number;
  percentage: number;
}

const BudgetNotification = () => {
  const [alerts, setAlerts] = useState<BudgetAlert[]>([]);

  useEffect(() => {
    checkBudgets();
  }, []);

  async function checkBudgets() {
    try {
      const budgets = (await fetchBudgetStatus()) as {
        category: { name: string };
        currentSpending: number;
        amount: number;
        percentageUsed: number;
      }[];
      const alerts: BudgetAlert[] = budgets
        .filter((budget) => budget.percentageUsed >= 80)
        .map((budget) => ({
          category: budget.category.name,
          spent: budget.currentSpending,
          limit: budget.amount,
          percentage: budget.percentageUsed,
        }));

      setAlerts(alerts);
    } catch (error) {
      console.error("Error checking budgets:", error);
    }
  }

  if (alerts.length === 0) return null;
  <div className="space-y-4">
    {alerts.map((alert, index) => (
      <div
        key={index}
        className="bg-yellow-50 border-l-4 border-yellow-400 p-4"
      >
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              {alert.percentage >= 100
                ? `Budget exceeded for "${
                    alert.category
                  }": Spent $${alert.spent.toFixed(
                    2
                  )} of $${alert.limit.toFixed(2)}`
                : `Close to exceeding budget for "${
                    alert.category
                  }": ${alert.percentage.toFixed(1)}% used`}
            </p>
          </div>
        </div>
      </div>
    ))}
  </div>;
};

export default BudgetNotification;
