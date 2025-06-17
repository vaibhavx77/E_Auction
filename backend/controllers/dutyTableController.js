import mongoose from "mongoose";
import DutyTable from "../models/dutyTable.js";
import Product from "../models/product.js";
import Country from "../models/country.js";


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

export const getProductsAndCountries = async (req, res) => {
  try {
    const [products, countries] = await Promise.all([
      Product.find(),
      Country.find()
    ]);

    res.json({
      products,
      countries
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch products and countries",
      error: err.message
    });
  }
};



export const addDutyRate = async (req, res) => {
  try {
    const { product, country, dutyRate } = req.body;
    console.log(country, product, dutyRate, typeof(country));

    const products = await Product.findOne({_id: product});
    const nation = await Country.findOne({_id: country});
    console.log(products, nation);


    if (!products || !nation) {
      return res.status(400).json({ message: "Invalid product or country ID" });
    }
    const decimalDutyRate = dutyRate !== null ? mongoose.Types.Decimal128.fromString(dutyRate.toString()) : null;

    let duty = await DutyTable.findOne({ product, country });

    if (duty) {
      duty.dutyRate = decimalDutyRate;
      await duty.save();
      return res.status(200).json({ message: "Duty rate updated", duty });
    } else {
      duty = new DutyTable({ product, country, dutyRate: decimalDutyRate });
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
      .populate('product', 'name')
      .populate('country', 'name code');

 const formattedRates = rates.map((rate) => ({
      _id: rate._id,
      product: rate.product.name,
      country: rate.country.name,
      code: rate.country.code,
      dutyRate: rate.dutyRate ? parseFloat(rate.dutyRate.toString()) : null,
      createdAt: rate.createdAt,
      updatedAt: rate.updatedAt
    }));

    res.json(formattedRates);
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