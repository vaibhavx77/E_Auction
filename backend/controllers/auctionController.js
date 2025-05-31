import Auction from "../models/auction.js";
import Lot from "../models/lot.js";

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