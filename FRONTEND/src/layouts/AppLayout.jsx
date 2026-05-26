import { BarChart3, FilePlus2, Files, LogOut, Menu, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getInitials } from "../utils/formatters";

export default function AppLayout() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = isAdmin
    ? [
        { label: "Dashboard", path: "/dashboard", icon: BarChart3 },
        { label: "Complaints", path: "/admin/complaints", icon: Files }
      ]
    : [
        { label: "My Complaints", path: "/dashboard", icon: Files },
        { label: "New Complaint", path: "/complaints/new", icon: FilePlus2 }
      ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-banking-light">
      <aside className={`fixed inset-y-0 left-0 z-30 w-72 transform bg-banking-navy text-white transition lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-white/10 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-white/10 p-2">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold">Banking Portal</p>
                <p className="text-xs text-blue-100">Complaint Escalation</p>
              </div>
            </div>
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold transition ${
                    isActive ? "bg-white text-banking-navy" : "text-blue-100 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-white/10 p-4">
            <button
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-blue-100 hover:bg-white/10 hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-20 bg-slate-950/40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <button className="rounded-md border border-slate-200 p-2 lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>

            <div>
              <p className="text-sm font-semibold text-slate-900">Automated Complaint Escalation</p>
              <p className="text-xs text-slate-500">Role: {user?.role || "USER"}</p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-banking-blue text-sm font-bold text-white">
              {getInitials(user?.role || "User")}
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
