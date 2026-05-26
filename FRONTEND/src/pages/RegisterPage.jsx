import { UserPlus, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER"
  });
  const [showPassword, setShowPassword] = useState(false);

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name || !formData.email || formData.password.length < 6) {
      showToast("Enter name, email, and a password of at least 6 characters", "error");
      return;
    }

    try {
      setLoading(true);
      await register(formData);
      showToast("Registration successful. Please login.");
      navigate("/login");
    } catch (error) {
      showToast(error.message || "Unable to register", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
      <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
      <p className="mt-1 text-sm text-slate-500">Register as a user or admin for testing the workflow.</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm font-semibold text-slate-700">Full Name</label>
          <input className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-banking-blue" value={formData.name} onChange={(event) => updateField("name", event.target.value)} />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">Email</label>
          <input type="email" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-banking-blue" value={formData.email} onChange={(event) => updateField("email", event.target.value)} />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">Password</label>
          <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full rounded-md border border-slate-300 pl-3 pr-10 py-2 outline-none focus:border-banking-blue"
              value={formData.password}
              onChange={(event) => updateField("password", event.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">Role</label>
          <select className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-banking-blue" value={formData.role} onChange={(event) => updateField("role", event.target.value)}>
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        <Button className="w-full" disabled={loading}>
          <UserPlus className="h-4 w-4" />
          {loading ? "Creating..." : "Create account"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-500">
        Already registered? <Link className="font-semibold text-banking-blue" to="/login">Login</Link>
      </p>
    </div>
  );
}
