import mongoose from "mongoose";
// creating complaint Schema
const complaintSchema = new mongoose.Schema({
 title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["PENDING", "ESCALATED", "RESOLVED"],
    default: "PENDING"
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });


export default mongoose.model("Complaint", complaintSchema);
