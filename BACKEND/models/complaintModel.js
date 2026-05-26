import mongoose from "mongoose";

export const COMPLAINT_STATUSES = ["PENDING", "ESCALATED", "RESOLVED"];
export const COMPLAINT_CATEGORIES = [
  "ATM",
  "LOAN",
  "CREDIT_CARD",
  "NET_BANKING",
  "UPI",
  "FRAUD"
];
export const COMPLAINT_PRIORITIES = ["LOW", "MEDIUM", "HIGH"];
const priorityScores = {
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3
};

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
    enum: COMPLAINT_STATUSES,
    default: "PENDING"
  },
  category: {
    type: String,
    enum: COMPLAINT_CATEGORIES,
    required: true
  },
  priority: {
    type: String,
    enum: COMPLAINT_PRIORITIES,
    default: "LOW"
  },
  priorityScore: {
    type: Number,
    default: 3
  },
  history: [
    {
      status: {
        type: String,
        enum: COMPLAINT_STATUSES,
        required: true
      },
      updatedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    default: null
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

complaintSchema.pre("validate", function addInitialHistory() {
  this.priorityScore = priorityScores[this.priority] || priorityScores.LOW;

  if (this.isNew && this.history.length === 0) {
    this.history.push({
      status: this.status || "PENDING",
      updatedAt: new Date()
    });
  }
});

export default mongoose.model("Complaint", complaintSchema);
