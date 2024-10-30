import Event from "../models/event.js";

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();

    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json("Error fetching all events");
  }
};

export const updateEvent = async (req, res) => {
  const { id } = req.params;
  const {
    eventName,
    applicant,
    phoneNumber,
    eventType,
    eventDate,
    eventTime,
    eventLocation,
    comments,
    totalCapacity,
    price,
    isVisible,
  } = req.body;

  let imagePath = req.file ? req.file.path : undefined;

  try {
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const previousTicketsSold = event.ticketsSold || 0;

    const updateData = {
      eventName,
      applicant,
      phoneNumber,
      eventType,
      eventDate,
      eventTime,
      eventLocation,
      comments: comments || null,
      totalCapacity,
      ticketsRemaining: totalCapacity - previousTicketsSold,
      price,
      isVisible,
    };

    if (imagePath) {
      updateData.image = imagePath;
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Error updating event" });
  }
};

export const deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(204).json();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting event" });
  }
};
