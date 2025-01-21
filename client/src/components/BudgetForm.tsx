import { useEffect, useState } from "react";
import type { Category } from "../types";
import toast from "react-hot-toast";
import { createBudget, fetchCategories } from "../lib/api";
import { Calendar, DollarSign, X } from "lucide-react";

interface BudgetFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const BudgetForm = ({ onClose, onSuccess }: BudgetFormProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [FormData, setFormaData] = useState<{
    category_id: string;
    amount: string;
    period: "monthly" | "yearly";
    start_date: string;
    end_date: string;
  }>({
    category_id: "",
    amount: "",
    period: "monthly",
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date(new Date().setMonth(new Date().getMonth() + 1))
      .toISOString()
      .split("T")[0],
  });

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const data = (await fetchCategories()) as Category[];
      setCategories(data.filter((c) => c.type === "expense"));
    } catch {
      toast.error("Error fetching categories");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      await createBudget({
        ...FormData,
        amount: parseFloat(FormData.amount),
      });
      toast.success("Budget set successfully");
      onSuccess();
      onClose();
    } catch {
      toast.error("Error setting budget");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Set Budget</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <select
                value={FormData.category_id}
                onChange={(e) =>
                  setFormaData((prev) => ({
                    ...prev,
                    category_id: e.target.value,
                  }))
                }
                className="block w-full rounded-md border-gray-300 pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount Limit
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                step="0.01"
                value={FormData.amount}
                onChange={(e) =>
                  setFormaData((prev) => ({ ...prev, amount: e.target.value }))
                }
                className="block w-full pl-10 pr-3 py-2 rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Period
            </label>
            <select
              value={FormData.period}
              onChange={(e) =>
                setFormaData((prev) => ({
                  ...prev,
                  period: e.target.value as "monthly" | "yearly",
                }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  value={FormData.start_date}
                  onChange={(e) =>
                    setFormaData((prev) => ({
                      ...prev,
                      start_date: e.target.value,
                    }))
                  }
                  className="block w-full pl-10 pr-3 py-2 rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  value={FormData.end_date}
                  onChange={(e) =>
                    setFormaData((prev) => ({
                      ...prev,
                      end_date: e.target.value,
                    }))
                  }
                  className="block w-full pl-10 pr-3 py-2 rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Budget"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetForm;
