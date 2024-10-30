import Event from "../models/event.js";

export const createEvent = async (req, res) => {
  const {
    applicant,
    phoneNumber,
    eventName,
    eventLocation,
    totalCapacity,
    eventType,
    eventDate,
    eventTime,
    comments,
    image,
    price,
  } = req.body;

  if (
    !applicant ||
    !phoneNumber ||
    !eventName ||
    !eventLocation ||
    !totalCapacity ||
    !eventType ||
    !eventDate ||
    !eventTime ||
    !price
  ) {
    return res.status(400).json("All required fields must be provided");
  }

  try {
    const imagePath = req.file ? req.file.path.replace(/\\/g, "/") : null;

    const newEvent = new Event({
      applicant,
      phoneNumber,
      eventName,
      eventLocation,
      totalCapacity,
      ticketsRemaining: totalCapacity,
      eventType,
      eventDate,
      eventTime,
      price,
      comments: comments || null,
      image: imagePath,
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json("Error creating event");
  }
};

export const getVisibleEvents = async (req, res) => {
  try {
    const events = await Event.find();
    const visibleEvents = events.filter((event) =>
      Event.shouldDisplay(event.isVisible, event.eventDate)
    );
    res.status(200).json(visibleEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error events not found" });
  }
};

export const getEventById = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching event details" });
  }
};
