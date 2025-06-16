import mongoose from "mongoose";

const currencyRateSchema = new mongoose.Schema({
  from: { type: String, required: true }, // e.g., "USD"
  to: { type: String, required: true },   // e.g., "GBP"
  rate: { type: mongoose.Schema.Types.Decimal128, required: true },
  date: { type: Date, default: Date.now }
});
currencyRateSchema.index({ from: 1, to: 1 }, { unique: true });

export default mongoose.model("CurrencyRate", currencyRateSchema);