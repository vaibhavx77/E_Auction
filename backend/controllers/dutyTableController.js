import DutyTable from "../models/dutyTable.js";

export const addDutyRate = async (req, res) => {
  try {
    const { country, productCategory, dutyRate } = req.body;
    const duty = new DutyTable({ country, productCategory, dutyRate });
    await duty.save();
    res.status(201).json({ message: "Duty rate added", duty });
  } catch (err) {
    res.status(500).json({ message: "Failed to add duty rate", error: err.message });
  }
};

export const getDutyRates = async (req, res) => {
  try {
    const rates = await DutyTable.find();
    res.json(rates);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch duty rates", error: err.message });
  }
};