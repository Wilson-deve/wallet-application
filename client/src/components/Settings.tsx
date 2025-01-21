import React, { useState } from "react";
import { Save } from "lucide-react";
import toast from "react-hot-toast";

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: {
      budgetAlerts: true,
      monthlyReport: true,
      lowBalanceAlert: true,
    },
    preferences: {
      currency: "USD",
      dateFormat: "MM/DD/YYYY",
      theme: "light",
    },
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      // TODO: Implement settings update API
      toast.success("Settings saved successfully");
    } catch {
      toast.error("Failed to save settings");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Settings</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Notifications */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Notifications
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Budget Alerts
                </label>
                <p className="text-sm text-gray-500">
                  Get notified when you're close to exceeding your budget
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.budgetAlerts}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    notifications: {
                      ...prev.notifications,
                      budgetAlerts: e.target.checked,
                    },
                  }))
                }
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Monthly Report
                </label>
                <p className="text-sm text-gray-500">
                  Receive a monthly summary of your finances
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.monthlyReport}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    notifications: {
                      ...prev.notifications,
                      monthlyReport: e.target.checked,
                    },
                  }))
                }
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Low Balance Alert
                </label>
                <p className="text-sm text-gray-500">
                  Get notified when your account balance is low
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.lowBalanceAlert}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    notifications: {
                      ...prev.notifications,
                      lowBalanceAlert: e.target.checked,
                    },
                  }))
                }
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Preferences
          </h3>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Currency
              </label>
              <select
                value={settings.preferences.currency}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    preferences: {
                      ...prev.preferences,
                      currency: e.target.value,
                    },
                  }))
                }
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date Format
              </label>
              <select
                value={settings.preferences.dateFormat}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    preferences: {
                      ...prev.preferences,
                      dateFormat: e.target.value,
                    },
                  }))
                }
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Theme
              </label>
              <select
                value={settings.preferences.theme}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    preferences: {
                      ...prev.preferences,
                      theme: e.target.value,
                    },
                  }))
                }
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
