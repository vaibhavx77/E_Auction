import CurrencyRate from "../models/currencyRate.js";

export const addCurrencyRate = async (req, res) => {
  try {
    const { from, to, rate } = req.body;
    const currencyRate = new CurrencyRate({ from, to, rate });
    await currencyRate.save();
    res.status(201).json({ message: "Currency rate added", currencyRate });
  } catch (err) {
    res.status(500).json({ message: "Failed to add currency rate", error: err.message });
  }
};

export const getCurrencyRates = async (req, res) => {
  try {
    const rates = await CurrencyRate.find();
    res.json(rates);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch currency rates", error: err.message });
  }
};