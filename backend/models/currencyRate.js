import mongoose from "mongoose";

const currencyRateSchema = new mongoose.Schema({
  from: { type: String, required: true }, // e.g., "USD"
  to: { type: String, required: true },   // e.g., "GBP"
  rate: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.model("CurrencyRate", currencyRateSchema);