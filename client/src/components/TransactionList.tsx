import { useEffect, useState } from "react";
import { format } from "date-fns";
import { fetchTransactions } from "../lib/api";
import type { Transaction } from "../types";
import toast from "react-hot-toast";
import TransactionForm from "./TransactionForm";
import { ArrowDownLeft, ArrowUpRight, Filter, Plus } from "lucide-react";

const TransactionList = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  useEffect(() => {
    loadTransactions();
  }, [dateRange]);

  async function loadTransactions() {
    try {
      setLoading(true);
      const data = await fetchTransactions({
        startDate: dateRange.start || undefined,
        endDate: dateRange.end || undefined,
      });
      setTransactions(data as Transaction[]);
    } catch (error) {
      toast.error("Error fetching transactions");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Transactions</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Transaction
        </button>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <div className="flex gap-4">
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, start: e.target.value }))
            }
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, end: e.target.value }))
            }
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <button className="flex items-center px-4 py-2 text-sm text-gray-600 bg-white rounded-lg border border-gray-300 hover:bg-gray-50">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="min-w-full divide-y divide-gray-200">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              Loading transactions...
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No transactions found
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-2 rounded-full ${
                          transaction.type === "income"
                            ? "bg-green-100"
                            : "bg-red-100"
                        }`}
                      >
                        {transaction.type === "income" ? (
                          <ArrowUpRight className="h-5 w-5 text-green-600" />
                        ) : (
                          <ArrowDownLeft className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {transaction.category?.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {transaction.account?.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-medium ${
                          transaction.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}$
                        {Math.abs(transaction.amount).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(transaction.date), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                  {transaction.description && (
                    <p className="mt-2 text-sm text-gray-500">
                      {transaction.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <TransactionForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            loadTransactions();
          }}
        />
      )}
    </div>
  );
};

export default TransactionList;
