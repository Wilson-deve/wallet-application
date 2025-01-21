import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";

function NavLinks() {
  return (
    <>
      <Button variant="link" asChild>
        <Link to="/accounts">Accounts</Link>
      </Button>
      <Button variant="link" asChild>
        <Link to="/transactions">Transactions</Link>
      </Button>
      <Button variant="link" asChild>
        <Link to="/budgets">Budgets</Link>
      </Button>
      <Button variant="link" asChild>
        <Link to="/reports">Reports</Link>
      </Button>
    </>
  );
}

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    // TODO: Integrate with backend
    // Call logout API endpoint
    // Clear local storage or cookies
    // Navigate to login page using navigate hook if needed
    console.log("Logout clicked");
  };

  return (
    <nav className="bg-indigo-50 text-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            Expense Tracker
          </Link>
          <div className="hidden md:flex space-x-4">
            <NavLinks />
            <Button variant="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </div>
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {isMenuOpen && (
          <div className="mt-4 flex flex-col space-y-2 md:hidden">
            <NavLinks />
            <Button variant="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
