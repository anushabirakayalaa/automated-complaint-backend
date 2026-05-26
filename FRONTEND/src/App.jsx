import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import AuthLayout from "./layouts/AuthLayout";
import AdminComplaintsPage from "./pages/AdminComplaintsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import CreateComplaintPage from "./pages/CreateComplaintPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserComplaintsPage from "./pages/UserComplaintsPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

function DashboardRedirect() {
  const { isAdmin } = useAuth();
  return isAdmin ? <AdminDashboardPage /> : <UserComplaintsPage />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route path="/complaints/new" element={<CreateComplaintPage />} />
          <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
            <Route path="/admin/complaints" element={<AdminComplaintsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
