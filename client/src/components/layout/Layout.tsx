import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Bell,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  PieChart,
  Receipt,
  SettingsIcon,
  Wallet,
  X,
} from "lucide-react";
import NotificationCenter from "../NotificationCenter";

const Layout = () => {
  const { user, logout } = useAuth();
  useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Transactions", href: "/transactions", icon: Receipt },
    { name: "Accounts", href: "/accounts", icon: Wallet },
    { name: "Budgets", href: "/budgets", icon: PieChart },
    { name: "Reports", href: "/reports", icon: FileText },
    { name: "Settings", href: "/settings", icon: SettingsIcon },
  ];

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="text-gray-500 hover:text-gray-600"
          >
            {showMobileMenu ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="text-gray-500 hover:text-gray-600 relative"
            >
              <Bell className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out
        ${showMobileMenu ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
      >
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto py-4 px-3">
            <div className="flex items-center justify-center mb-8">
              <Wallet className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-semibold">Finance App</span>
            </div>

            <nav className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) => `
                      flex items-center px-4 py-2 text-sm font-medium rounded-md
                      ${
                        isActive
                          ? "bg-indigo-50 text-indigo-600"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }
                    `}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.email}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-3 flex-shrink-0 p-1 text-gray-400 hover:text-gray-500"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="hidden lg:flex lg:sticky lg:top-0 lg:z-40 lg:h-16 lg:bg-white lg:border-b lg:border-gray-200">
          <div className="flex-1 flex justify-end px-4">
            <div className="ml-4 flex items-center">
              <NotificationCenter />
            </div>
          </div>
        </div>

        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile notifications */}
      {showNotifications && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-gray-600 bg-opacity-50"
            onClick={() => setShowNotifications(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white">
            <div className="h-full overflow-y-auto">
              <NotificationCenter />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
