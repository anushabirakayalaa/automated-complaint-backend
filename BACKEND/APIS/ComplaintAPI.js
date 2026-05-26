import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import { createComplaint,getMyComplaints,updateStatus,getAllComplaints,getDashboardStats,searchComplaints,filterComplaints,softDeleteComplaint  } from "../services/complaintService.js";
import adminOnly from "../middlewares/adminOnly.js";
export const complaintRoute = express.Router();

// Creating a complaint
complaintRoute.post("/", verifyToken, createComplaint);
complaintRoute.post("/create", verifyToken, createComplaint);
// paginated complaints list
complaintRoute.get("/", verifyToken, adminOnly, getAllComplaints);
// get my complaint
complaintRoute.get("/my", verifyToken, getMyComplaints);
//get all complaints--admin
complaintRoute.get("/all", verifyToken, adminOnly, getAllComplaints);
//update status of a complaint---admin
complaintRoute.put("/status/:id", verifyToken, adminOnly, updateStatus);
//get admin dashboard--to keep strack of no. of complaints
complaintRoute.get("/dashboard",verifyToken,adminOnly,getDashboardStats);
// seraching for a complaint
complaintRoute.get("/search", verifyToken, searchComplaints);
//GET filtered complaints based on status
complaintRoute.get("/filter", verifyToken, filterComplaints);
//soft delete complaint without permanently removing record
complaintRoute.delete("/:id", verifyToken, softDeleteComplaint);
