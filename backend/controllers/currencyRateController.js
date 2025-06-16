import mongoose from "mongoose";
import CurrencyRate from "../models/currencyRate.js";

// export const addCurrencyRate = async (req, res) => {
//   try {
//     const { from, to, rate } = req.body;
//     const currencyRate = new CurrencyRate({ from, to, rate });
//     await currencyRate.save();
//     res.status(201).json({ message: "Currency rate added", currencyRate });
//   } catch (err) {
//     res.status(500).json({ message: "Failed to add currency rate", error: err.message });
//   }
// };

// export const getCurrencyRates = async (req, res) => {
//   try {
//     const rates = await CurrencyRate.find();
//     res.json(rates);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch currency rates", error: err.message });
//   }
// };

export const addCurrencyRate = async (req, res) => {
  try {
    const { from, to, rate } = req.body;

    const decimalRate = mongoose.Types.Decimal128.fromString(rate.toString());

    let currencyRate = await CurrencyRate.findOne({ from, to });

    if (currencyRate) {
      currencyRate.rate = decimalRate;
      currencyRate.date = new Date();
      await currencyRate.save();
      return res.status(200).json({ message: "Currency rate updated", currencyRate });
    } else {
      currencyRate = new CurrencyRate({ from, to, rate: decimalRate });
      await currencyRate.save();
      return res.status(201).json({ message: "Currency rate added", currencyRate });
    }

  } catch (err) {
    res.status(500).json({ message: "Failed to add/update currency rate", error: err.message });
  }
};

// Get All Currency Rates (with parsed decimals)
export const getCurrencyRates = async (req, res) => {
  try {
    const rates = await CurrencyRate.find();

    const formattedRates = rates.map(rate => ({
      _id: rate._id,
      from: rate.from,
      to: rate.to,
      rate: parseFloat(rate.rate.toString()),
      date: rate.date
    }));

    res.json(formattedRates);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch currency rates", error: err.message });
  }
};