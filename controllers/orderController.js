import Order from "../models/Order.js";
import Event from "../models/Event.js";
import stripe from "../config/stripe.js";


// 🔹 Create Order
export const createOrder = async (req, res) => {
  try {
    const { eventId, quantity } = req.body;

    // Find event
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    // Check ticket availability
    if (event.availableTickets < quantity) {
      return res.status(400).json({
        message: "Not enough tickets available",
      });
    }

    // Calculate total
    const totalPrice = event.price * quantity;

    // Create pending order
    const order = await Order.create({
      userId: req.user._id,
      eventId,
      quantity,
      totalPrice,
      paymentStatus: "pending",
    });

    res.status(201).json(order);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const createCheckoutSession = async (req, res) => {
  try {
    const { orderId } = req.body;

    // Find order
    const order = await Order.findById(orderId).populate("eventId");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "usd",

            product_data: {
              name: order.eventId.title,
            },

            unit_amount: order.totalPrice * 100,
          },

          quantity: 1,
        },
      ],

      mode: "payment",

      success_url: "http://localhost:3000/success",

      cancel_url: "http://localhost:3000/cancel",
    });

    // Save session ID
    order.stripeSessionId = session.id;
    await order.save();

    res.json({
      url: session.url,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};