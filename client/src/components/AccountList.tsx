import React, { useState, useEffect } from "react";
import { Plus, CreditCard, Smartphone, Wallet } from "lucide-react";
import { fetchAccounts } from "../lib/api";
import type { Account } from "../types";
import toast from "react-hot-toast";

export default function AccountsList() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAccounts();
  }, []);

  async function loadAccounts() {
    try {
      setLoading(true);
      const data = await fetchAccounts();
      setAccounts(data);
    } catch (error) {
      toast.error("Error fetching accounts");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  const getAccountIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "bank":
        return <CreditCard className="h-6 w-6" />;
      case "mobile money":
        return <Smartphone className="h-6 w-6" />;
      default:
        return <Wallet className="h-6 w-6" />;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Accounts</h2>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Add Account
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading accounts...</div>
      ) : accounts.length === 0 ? (
        <div className="text-center text-gray-500">No accounts found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
                    {getAccountIcon(account.type)}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {account.name}
                    </h3>
                    <p className="text-sm text-gray-500">{account.type}</p>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-600">Current Balance</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ${account.balance.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
