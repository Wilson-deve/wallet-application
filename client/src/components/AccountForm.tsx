import { useState } from "react";
import toast from "react-hot-toast";
import { createAccount } from "../lib/api";
import { CreditCard, X } from "lucide-react";

interface AccountFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AccountForm = ({ onClose, onSuccess }: AccountFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "bank",
    balance: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      await createAccount({
        ...formData,
        balance: parseFloat(formData.balance),
      });
      toast.success("Account added successfully");
      onSuccess();
      onClose();
    } catch {
      toast.error("Error adding account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 max-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 onClick={onClose} className="text-lg font-medium">
            Add Account
          </h3>
          <X className="h-6 w-6" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Account Name
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CreditCard className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="block w-full pl-10 pr-3 py-2 rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="e.g., Main Checking"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Account Type
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, type: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            >
              <option value="bank">Bank Account</option>
              <option value="mobile money">Mobile Money</option>
              <option value="cash">Cash</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Initial Balance
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <input
                type="number"
                step="0.01"
                value={formData.balance}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, balance: e.target.value }))
                }
                className="block w-full pl-7 pr-3 py-2 rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountForm;
