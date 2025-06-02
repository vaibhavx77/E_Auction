import Auction from "../models/auction.js";
import Lot from "../models/lot.js";
import User from "../models/user.js";

// Create Auction (with optional lots)
export const createAuction = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      reservePrice,
      currency,
      startTime,
      endTime,
      autoExtension,
      extensionMinutes,
      invitedSuppliers,
      costParams,
      lots // Array of lot objects
    } = req.body;

    // Handle auction-level documents
    const documents = req.files?.auctionDocs?.map(file => file.path) || [];

    // Create auction
    const auction = new Auction({
      title,
      description,
      category,
      reservePrice,
      currency,
      startTime,
      endTime,
      autoExtension,
      extensionMinutes,
      invitedSuppliers,
      costParams,
      documents,
      createdBy: req.user.userId,
    });

    await auction.save();

    // Validate invited suppliers
    if (invitedSuppliers && invitedSuppliers.length > 0) {
      const validSuppliers = await User.find({
        _id: { $in: invitedSuppliers },
        role: "Supplier"
      }).select("_id");
      if (validSuppliers.length !== invitedSuppliers.length) {
        return res.status(400).json({ message: "One or more invited users are not valid suppliers." });
      }
    }

    // Handle lots (if any)
    if (lots && lots.length > 0) {
      for (let i = 0; i < lots.length; i++) {
        const lot = lots[i];
        const lotDocs = req.files?.[`lotDocs${i}`]?.map(file => file.path) || [];
        const newLot = new Lot({
          auction: auction._id,
          name: lot.name,
          description: lot.description,
          specifications: lot.specifications,
          documents: lotDocs,
          reservePrice: lot.reservePrice,
          currency: lot.currency,
        });
        await newLot.save();
        auction.lots.push(newLot._id);
      }
      await auction.save();
    }

    res.status(201).json({ message: "Auction created successfully", auction });
  } catch (err) {
    res.status(500).json({ message: "Auction creation failed", error: err.message });
  }
};

// List all auctions (EP members: all, Suppliers: only invited & active)
export const listAuctions = async (req, res) => {
  try {
    let auctions;
    if (["Admin", "Manager", "Viewer"].includes(req.user.role)) {
      auctions = await Auction.find().populate("lots invitedSuppliers createdBy");
    } else if (req.user.role === "Supplier") {
      auctions = await Auction.find({
        invitedSuppliers: req.user.userId,
        status: { $in: ["Active", "Scheduled"] }
      }).populate("lots invitedSuppliers createdBy");
    } else {
      return res.status(403).json({ message: "Access denied" });
    }
    res.json(auctions);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch auctions", error: err.message });
  }
};

// Get auction details by ID
export const getAuctionDetails = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id)
      .populate("lots invitedSuppliers createdBy");
    if (!auction) return res.status(404).json({ message: "Auction not found" });

    // Suppliers can only view auctions they're invited to
    if (
      req.user.role === "Supplier" &&
      !auction.invitedSuppliers.some(s => s._id.equals(req.user.userId))
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(auction);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch auction details", error: err.message });
  }
};