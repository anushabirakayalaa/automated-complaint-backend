import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import ComplaintFilters from "../components/ComplaintFilters";
import ComplaintModal from "../components/ComplaintModal";
import ComplaintTable from "../components/ComplaintTable";
import LoadingSpinner from "../components/LoadingSpinner";
import PageHeader from "../components/PageHeader";
import { useToast } from "../context/ToastContext";
import { deleteComplaint, filterComplaints, getMyComplaints, searchComplaints } from "../services/complaintService";
import { unwrapComplaintList } from "../utils/formatters";

const emptyFilters = {
  keyword: "",
  status: "",
  category: "",
  priority: ""
};

export default function UserComplaintsPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState([]);
  const [filters, setFilters] = useState(emptyFilters);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const response = await getMyComplaints({ page: 1, limit: 20 });
      setComplaints(unwrapComplaintList(response.data));
    } catch (error) {
      showToast(error.response?.data?.message || "Unable to load complaints", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const applyFilters = async () => {
    try {
      setLoading(true);
      const hasFilters = filters.status || filters.category || filters.priority;
      const response = filters.keyword
        ? await searchComplaints({ ...filters, page: 1, limit: 20 })
        : hasFilters
          ? await filterComplaints({ ...filters, page: 1, limit: 20 })
          : await getMyComplaints({ page: 1, limit: 20 });

      setComplaints(unwrapComplaintList(response.data));
    } catch (error) {
      showToast(error.response?.data?.message || "Search failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters(emptyFilters);
    loadComplaints();
  };

  const handleDelete = async (id) => {
    try {
      await deleteComplaint(id);
      showToast("Complaint removed from active list");
      loadComplaints();
    } catch (error) {
      showToast(error.response?.data?.message || "Unable to delete complaint", "error");
    }
  };

  return (
    <>
      <PageHeader
        title="My Complaints"
        subtitle="Track your complaint status, priority, and complete timeline."
        action={<Link to="/complaints/new"><Button><Plus className="h-4 w-4" /> New Complaint</Button></Link>}
      />

      <ComplaintFilters filters={filters} onChange={setFilters} onApply={applyFilters} onReset={resetFilters} />

      {loading ? (
        <LoadingSpinner label="Loading complaints" />
      ) : (
        <ComplaintTable complaints={complaints} onView={setSelectedComplaint} onDelete={handleDelete} />
      )}

      <ComplaintModal complaint={selectedComplaint} onClose={() => setSelectedComplaint(null)} />
    </>
  );
}
