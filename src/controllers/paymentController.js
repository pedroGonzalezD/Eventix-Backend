import fetch from "node-fetch";
import Ticket from "../models/ticket.js";
import Event from "../models/event.js";
import { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } from "../config.js";

export const validatePayment = async (req, res) => {
  const { orderId, eventId, ticketQuantity } = req.body;
  console.log(ticketQuantity);
  if (!orderId || !eventId || !ticketQuantity) {
    return res
      .status(400)
      .json({ message: "All required fields must be provided" });
  }

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (ticketQuantity > event.totalCapacity) {
      return res.status(400).json({ message: "Not enough tickets available" });
    }

    const auth = Buffer.from(
      `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
    ).toString("base64");

    const response = await fetch(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to verify payment with PayPal");
    }

    const orderDetails = await response.json();

    if (orderDetails.status !== "COMPLETED") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    const payerId = orderDetails.payer.payer_id;

    if (!payerId) {
      return res
        .status(400)
        .json({ message: "Amount and Payer ID must be provided" });
    }

    for (let i = 0; i < ticketQuantity; i++) {
      const newTicket = new Ticket({
        eventId,
        purchaserId: req.user.id,
        code: `TICKET-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        payerId,
      });
      await newTicket.save();
    }

    event.ticketsRemaining -= ticketQuantity;
    event.ticketsSold += ticketQuantity;

    await event.save();

    res.status(201).json({ message: "Tickets created successfully" });
  } catch (error) {
    console.error("Error handling payment success: ", error);
    res.status(500).json({ message: "Error validating payment" });
  }
};
