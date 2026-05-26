import Complaint from "../models/complaintModel.js";

const staffRoles = ["ADMIN", "SUPPORT_AGENT"];
const isStaff = (user) => staffRoles.includes(user.role);

const getVisibleComplaintQuery = (user, extraQuery = {}) => {
  const query = {
    isDeleted: false,
    ...extraQuery
  };

  if (!isStaff(user)) {
    query.user = user.userId;
  }

  return query;
};

const getPagination = (query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 50);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const paginateComplaints = async (query, reqQuery, populateUser = false) => {
  const { page, limit, skip } = getPagination(reqQuery);
  const total = await Complaint.countDocuments(query);
  let complaintQuery = Complaint.find(query)
    .sort({ priorityScore: 1, createdAt: -1 })
    .skip(skip)
    .limit(limit);

  if (populateUser) {
    complaintQuery = complaintQuery.populate("user", "name email role");
  }

  const complaints = await complaintQuery.lean();

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    complaints
  };
};

const escapeRegex = (value = "") => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const logEmailNotification = (complaint, status) => {
  const email = complaint.user?.email || "registered user";
  console.log(`Email sent to ${email}: Your complaint "${complaint.title}" is now ${status}.`);
};

//craeting complaint
export const createComplaint = async (req, res) => {
  const { title, description, category, priority } = req.body;
  const complaint = await Complaint.create({
    title,
    description,
    category,
    priority: priority || "LOW",
    user: req.user.userId,
    status: "PENDING"
  });

  res.status(201).json({
    message: "Complaint created",
    complaint
  });
};

//View Complaint which i created
export const getMyComplaints = async (req, res) => {
  const query = getVisibleComplaintQuery(req.user);
  const result = await paginateComplaints(query, req.query);

  res.json(result);
};

//get all complaints--admin/support agent
export const getAllComplaints = async (req, res) => {
  const query = getVisibleComplaintQuery(req.user);
  const result = await paginateComplaints(query, req.query, true);

  res.json(result);
};

//change complaint status
export const updateStatus = async (req, res) => {
  const { status } = req.body;
  const complaint = await Complaint.findOne({
    _id: req.params.id,
    isDeleted: false
  }).populate("user", "name email");

  if (!complaint) {
    return res.status(404).json({ message: "Complaint not found" });
  }

  if (complaint.status !== status) {
    if (complaint.history.length === 0) {
      complaint.history.push({
        status: complaint.status,
        updatedAt: complaint.createdAt || new Date()
      });
    }

    complaint.status = status;
    complaint.history.push({
      status,
      updatedAt: new Date()
    });
    await complaint.save({ validateModifiedOnly: true });
    logEmailNotification(complaint, status);
  }

  res.json({
    message: "Status updated",
    complaint
  });
};

//Soft delete complaint record
export const softDeleteComplaint = async (req, res) => {
  const complaint = await Complaint.findOneAndUpdate(
    getVisibleComplaintQuery(req.user, { _id: req.params.id }),
    {
      isDeleted: true,
      deletedAt: new Date()
    },
    { new: true }
  );

  if (!complaint) {
    return res.status(404).json({ message: "Complaint not found" });
  }

  res.json({ message: "Complaint deleted safely", complaint });
};

//Admin Dashboard
//simple way to keep track of complaints of the admin
export const getDashboardStats = async (req, res) => {
  const baseQuery = { isDeleted: false };
  const total = await Complaint.countDocuments(baseQuery);
  const pending = await Complaint.countDocuments({ ...baseQuery, status: "PENDING" });
  const resolved = await Complaint.countDocuments({ ...baseQuery, status: "RESOLVED" });
  const escalated = await Complaint.countDocuments({ ...baseQuery, status: "ESCALATED" });

  const byCategory = await Complaint.aggregate([
    { $match: baseQuery },
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  const byPriority = await Complaint.aggregate([
    { $match: baseQuery },
    { $group: { _id: "$priority", count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  const formatCounts = (items) => {
    return items.reduce((counts, item) => {
      counts[item._id] = item.count;
      return counts;
    }, {});
  };

  res.status(200).json({
    total,
    pending,
    resolved,
    escalated,
    byCategory: formatCounts(byCategory),
    byPriority: formatCounts(byPriority),
    mostCommonIssueType: byCategory[0]
      ? { category: byCategory[0]._id, count: byCategory[0].count }
      : null
  });
};

// Search complaints by title, category, or status
export const searchComplaints = async (req, res) => {
  const { keyword = "", status, category, priority } = req.query;
  const searchText = escapeRegex(keyword.trim());
  const filters = {};

  if (status) filters.status = status;
  if (category) filters.category = category;
  if (priority) filters.priority = priority;

  const query = getVisibleComplaintQuery(req.user, filters);

  if (searchText) {
    query.$or = [
      { title: { $regex: searchText, $options: "i" } },
      { category: { $regex: searchText, $options: "i" } },
      { status: { $regex: searchText, $options: "i" } }
    ];
  }

  const result = await paginateComplaints(query, req.query, isStaff(req.user));

  res.json(result);
};

// Filter complaints by status, category, or priority
export const filterComplaints = async (req, res) => {
  const { status, category, priority } = req.query;
  const filters = {};

  if (status) filters.status = status;
  if (category) filters.category = category;
  if (priority) filters.priority = priority;

  const query = getVisibleComplaintQuery(req.user, filters);
  const result = await paginateComplaints(query, req.query, isStaff(req.user));

  res.json(result);
};
