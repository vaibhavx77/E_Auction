import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["Admin", "Manager", "Viewer", "Supplier"],
    default: "Supplier",
  },
  isVerified: { type: Boolean, default: false },
  businessDocs: [{ type: String }], // URLs or file references
  profile: {
    companyName: String,
    address: String,
    phone: String,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);