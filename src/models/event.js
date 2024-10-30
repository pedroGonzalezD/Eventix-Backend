import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    applicant: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    eventName: {
      type: String,
      required: true,
    },
    eventLocation: {
      type: String,
      required: true,
    },
    totalCapacity: {
      type: Number,
      required: true,
    },
    ticketsSold: {
      type: Number,
      default: 0,
    },
    ticketsRemaining: {
      type: Number,
      required: true,
    },
    eventType: {
      type: String,
      required: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    eventTime: {
      type: String,
      required: true,
    },

    comments: {
      type: String,
      default: "",
    },
    image: {
      type: String,
    },
    price: Number,
    isVisible: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

eventSchema.statics.shouldDisplay = (isVisible, eventDate) => {
  return isVisible && eventDate > new Date();
};

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

export default Event;
