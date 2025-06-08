import mongoose from "mongoose";

const dutyTableSchema = new mongoose.Schema({
  country: { type: String, required: true },
  productCategory: { type: String, required: true },
  dutyRate: { type: Number, required: true }, // e.g., 5.5 for 5.5%
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("DutyTable", dutyTableSchema);