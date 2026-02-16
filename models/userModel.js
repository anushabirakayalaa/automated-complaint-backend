import mongoose from "mongoose";
// data of user 
const userSchema = new mongoose.Schema({
  name: String,
  email: 
  { type: String, 
    unique: true //its only uniquely identified for a user
  },
  password: {
    type:String,
    required:true
  },
  role: {
    type: String,
    enum: ["USER", "AGENT", "ADMIN"],
    default: "USER"
  }
},{ 
  timestamps: true
 });

export default mongoose.model("User", userSchema);
