import Complaint from "../models/complaintModel.js";

//craeting complaint
export const createComplaint = async (req, res) => {
  const { title, description,priority  } = req.body;
  const complaint = await Complaint.create({
    title,
    description,
    priority: priority || "LOW",
    user: req.user.userId, // from token
    status: "PENDING"
  });

  res.status(200).json({
    message: "Complaint created",
    complaint
  });
};

//View Complaint which i created
export const getMyComplaints = async (req, res) => {

  const complaints = await Complaint.find({
    user: req.user.userId
  });

  res.json(complaints);
};

//get all complaints--admin
export const getAllComplaints = async (req, res) => {

  const complaints = (await Complaint.find().populate("user")).toSorted({createdAt: -1});

  res.json(complaints);
};

//change admin status
export const updateStatus = async (req, res) => {

  const { status } = req.body;

  await Complaint.findByIdAndUpdate(
    req.params.id,
    { status }
  );

  res.json({ message: "Status updated" });
};


//Admin Dashboard
  //simple way to keep track of complaints of the admin
export const getDashboardStats = async (req, res) => {
  //total no. of complaints
const total = await Complaint.countDocuments();
  //no. of pending complaints
const pending = await Complaint.countDocuments({ status: "PENDING" });
  //no. of resloved complaints
const resolved = await Complaint.countDocuments({ status: "RESOLVED" });
  //no. of escalated complaints
const escalated = await Complaint.countDocuments({ status: "ESCALATED" });
res.status(200).json({total,pending,resolved,escalated});
};

// Search complaints by title
export const searchComplaints = async (req, res) => {

  const { keyword } = req.query;

  let query = {
    title: { $regex: keyword, $options: "i" }
        //regex-->used for searching a text "i" ----> case insensitive

  };

  // if normal user--> show only their complaints
  if (req.user.role !== "ADMIN") {
    query.user = req.user.userId;
  }

  const complaints = await Complaint.find(query);

  res.json(complaints);
};

 
// Filter complaints by status
export const filterComplaints = async (req, res) => {
  const { status } = req.query;
  let query = { status };
  if (req.user.role !== "ADMIN") {
    query.user = req.user.userId;
  }
  const complaints = await Complaint.find(query);
  res.json(complaints);
};

