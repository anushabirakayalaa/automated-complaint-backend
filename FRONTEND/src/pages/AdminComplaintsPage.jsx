import { useEffect, useState } from "react";
import ComplaintFilters from "../components/ComplaintFilters";
import ComplaintModal from "../components/ComplaintModal";
import ComplaintTable from "../components/ComplaintTable";
import LoadingSpinner from "../components/LoadingSpinner";
import PageHeader from "../components/PageHeader";
import { useToast } from "../context/ToastContext";
import { filterComplaints, getAllComplaints, searchComplaints, updateComplaintStatus } from "../services/complaintService";
import { unwrapComplaintList } from "../utils/formatters";

const emptyFilters = {
  keyword: "",
  status: "",
  category: "",
  priority: ""
};

export default function AdminComplaintsPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState([]);
  const [filters, setFilters] = useState(emptyFilters);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const response = await getAllComplaints({ page: 1, limit: 30 });
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
        ? await searchComplaints({ ...filters, page: 1, limit: 30 })
        : hasFilters
          ? await filterComplaints({ ...filters, page: 1, limit: 30 })
          : await getAllComplaints({ page: 1, limit: 30 });

      setComplaints(unwrapComplaintList(response.data));
    } catch (error) {
      showToast(error.response?.data?.message || "Filter failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters(emptyFilters);
    loadComplaints();
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateComplaintStatus(id, status);
      showToast("Status updated and notification simulated");
      loadComplaints();
    } catch (error) {
      showToast(error.response?.data?.message || "Unable to update status", "error");
    }
  };

  return (
    <>
      <PageHeader title="Complaint Management" subtitle="Review, filter, and update banking complaint status." />

      <ComplaintFilters filters={filters} onChange={setFilters} onApply={applyFilters} onReset={resetFilters} />

      {loading ? (
        <LoadingSpinner label="Loading complaints" />
      ) : (
        <ComplaintTable
          complaints={complaints}
          isAdmin
          onView={setSelectedComplaint}
          onStatusChange={handleStatusChange}
        />
      )}

      <ComplaintModal complaint={selectedComplaint} onClose={() => setSelectedComplaint(null)} />
    </>
  );
}
