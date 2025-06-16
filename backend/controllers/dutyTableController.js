import DutyTable from "../models/dutyTable.js";
import Product from "../models/Product.js";
import Country from "../models/Country.js";

export const addProduct = async (req, res) => {
  try {
    const { name } = req.body;
    const product = new Product({ name});
    await product.save();
    res.status(201).json({ message: "Product added", product });
  } catch (err) {
    res.status(500).json({ message: "Failed to add product", error: err.message });
  }
};

export const addCountry = async (req, res) => {
  try {
    const { name } = req.body;
    const country = new Country({ name });
    await country.save();
    res.status(201).json({ message: "Country added", country });
  } catch (err) {
    res.status(500).json({ message: "Failed to add country", error: err.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products", error: err.message });
  }
};

export const getAllCountries = async (req, res) => {
  try {
    const countries = await Country.find();
    res.json(countries);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch countries", error: err.message });
  }
};


export const addDutyRate = async (req, res) => {
  try {
    const { productCategory, country, dutyRate } = req.body;

    const product = await Product.findById(productCategory);
    const nation = await Country.findById(country);

    if (!product || !nation) {
      return res.status(400).json({ message: "Invalid product or country ID" });
    }

    let duty = await DutyTable.findOne({ productCategory, country });

    if (duty) {
      duty.dutyRate = dutyRate;
      await duty.save();
      return res.status(200).json({ message: "Duty rate updated", duty });
    } else {
      duty = new DutyTable({ productCategory, country, dutyRate });
      await duty.save();
      return res.status(201).json({ message: "Duty rate added", duty });
    }

  } catch (err) {
    res.status(500).json({ message: "Failed to add/update duty rate", error: err.message });
  }
};

export const getDutyRates = async (req, res) => {
  try {
    const rates = await DutyTable.find()
      .populate('productCategory', 'name')
      .populate('country', 'name code');

    res.json(rates);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch duty rates", error: err.message });
  }
};


// export const addDutyRate = async (req, res) => {
//   try {
//     const { country, productCategory, dutyRate } = req.body;
//     const duty = new DutyTable({ country, productCategory, dutyRate });
//     await duty.save();
//     res.status(201).json({ message: "Duty rate added", duty });
//   } catch (err) {
//     res.status(500).json({ message: "Failed to add duty rate", error: err.message });
//   }
// };

// export const getDutyRates = async (req, res) => {
//   try {
//     const rates = await DutyTable.find();
//     res.json(rates);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch duty rates", error: err.message });
//   }
// };