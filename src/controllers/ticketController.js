import Ticket from "../models/ticket.js";

export const getUserTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ purchaserId: req.user.id }).populate(
      "eventId"
    );
    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching user tickets:", error);
    res.status(500).json({ message: "Error fetching user tickets" });
  }
};
