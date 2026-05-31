import { Send } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import PageHeader from "../components/PageHeader";
import { useToast } from "../context/ToastContext";
import { createComplaint } from "../services/complaintService";
import { CATEGORIES, PRIORITIES } from "../utils/constants";
import { formatLabel } from "../utils/formatters";

export default function CreateComplaintPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "UPI",
    priority: "LOW"
  });

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      showToast("Title and description are required", "error");
      return;
    }

    try {
      setLoading(true);
      await createComplaint(formData);
      showToast("Complaint created successfully");
      navigate("/dashboard");
    } catch (error) {
      showToast(error.message || "Unable to create complaint", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader title="Create Complaint" subtitle="Raise a new banking complaint for tracking and escalation." />

      <form className="max-w-3xl rounded-lg border border-slate-200 bg-white p-5 shadow-soft" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Title</label>
            <input className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-banking-blue" value={formData.title} onChange={(event) => updateField("title", event.target.value)} />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">Category</label>
            <select className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-banking-blue" value={formData.category} onChange={(event) => updateField("category", event.target.value)}>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>{formatLabel(category)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">Priority</label>
            <select className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-banking-blue" value={formData.priority} onChange={(event) => updateField("priority", event.target.value)}>
              {PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>{formatLabel(priority)}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Description</label>
            <textarea className="mt-1 min-h-36 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-banking-blue" value={formData.description} onChange={(event) => updateField("description", event.target.value)} />
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <Button disabled={loading}>
            <Send className="h-4 w-4" />
            {loading ? "Submitting..." : "Submit Complaint"}
          </Button>
        </div>
      </form>
    </>
  );
}
