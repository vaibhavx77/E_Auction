import Auction from "../models/auction.js";
import Lot from "../models/lot.js";
import User from "../models/user.js";
import Bid from "../models/bid.js";
import { getAgendaInstance } from '../agenda.js'

// Create Auction (with optional lots)
export const createAuction = async (req, res) => {
  try {
    console.log('Auction payload:', req.body); // <-- Add this line

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

    const agenda = getAgendaInstance();

// Schedule start job
await agenda.schedule(new Date(startTime), 'start auction', { auctionId: auction._id });

// Schedule end job
await agenda.schedule(new Date(endTime), 'end auction', { auctionId: auction._id });

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
    console.error(err); // <-- Also add this for error details
    res.status(500).json({ message: "Auction creation failed", error: err.message });
  }
};

// List all auctions (EP members: all, Suppliers: only invited & active)
export const listAuctions = async (req, res) => {
  try {
    console.log(req.user.userId, "req.user.userId")
    let auctions;
    if (["Admin", "Manager", "Viewer"].includes(req.user.role)) {
      auctions = await Auction.find().populate("lots invitedSuppliers createdBy");
    } else if (req.user.role === "Supplier") {
      auctions = await Auction.find({
        invitedSuppliers: req.user.userId,
        status: { $in: ["Active", "Scheduled"] }
      }).populate("lots invitedSuppliers createdBy");
    // const  auctions = await Auction.find({
    //     status: { $in: ["Active", "Scheduled"] }
    //   }).populate("lots invitedSuppliers createdBy");
    // } else {
    //   return res.status(403).json({ message: "Access denied" });
    // }
    } else{
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

// Pause auction
export const pauseAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).json({ message: "Auction not found" });

    if (auction.status !== "Active") {
      return res.status(400).json({ message: "Only active auctions can be paused." });
    }

    auction.status = "Paused";
    await auction.save();

    // (Optional) Emit real-time update
    if (req.app.get("io")) {
      req.app.get("io").to(auction._id.toString()).emit("auctionStatusChanged", { status: "Paused" });
    }

    res.json({ message: "Auction paused", auction });
  } catch (err) {
    res.status(500).json({ message: "Failed to pause auction", error: err.message });
  }
};

// Resume auction
export const resumeAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).json({ message: "Auction not found" });

    if (auction.status !== "Paused") {
      return res.status(400).json({ message: "Only paused auctions can be resumed." });
    }

    auction.status = "Active";
    await auction.save();

    // (Optional) Emit real-time update
    if (req.app.get("io")) {
      req.app.get("io").to(auction._id.toString()).emit("auctionStatusChanged", { status: "Active" });
    }

    res.json({ message: "Auction resumed", auction });
  } catch (err) {
    res.status(500).json({ message: "Failed to resume auction", error: err.message });
  }
};

export const getAuctionMonitoring = async (req, res) => {
  try {
    const { id } = req.params;
    const auction = await Auction.findById(id).populate("lots invitedSuppliers");
    if (!auction) return res.status(404).json({ message: "Auction not found" });

    // Get all bids for this auction
    const bids = await Bid.find({ auction: id });

    // Participation: unique suppliers who have placed bids
    const participatingSuppliers = [...new Set(bids.map(b => b.supplier.toString()))];

    // Bid activity timeline
    const bidTimeline = bids.map(b => ({
      supplier: b.supplier,
      amount: b.amount,
      createdAt: b.createdAt
    }));

    res.json({
      auction,
      participationCount: participatingSuppliers.length,
      bidTimeline
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch monitoring data", error: err.message });
  }
};