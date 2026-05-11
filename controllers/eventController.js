import Event from "../models/Event.js";


// 🔹 Create Event
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      location,
      price,
      totalTickets,
      image,
    } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      location,
      price,
      totalTickets,
      availableTickets: totalTickets,
      image,
      createdBy: req.user._id,
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔹 Get All Events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find();

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔹 Get Single Event
export const getSingleEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};