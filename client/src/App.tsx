import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/layout/Layout";
import { AuthProvider } from "./contexts/AuthContext";
import Dashboard from "./components/Dashboard";
import Reports from "./components/Reports";
import BudgetList from "./components/BudgetList";
import TransactionList from "./components/TransactionList";
import Settings from "./components/Settings";
import AccountList from "./components/AccountList";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="transactions" element={<TransactionList />} />
            <Route path="accounts" element={<AccountList />} />
            <Route path="budgets" element={<BudgetList />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
        <Toaster position="top-right" />
      </AuthProvider>
    </Router>
  );
}

export default App;
