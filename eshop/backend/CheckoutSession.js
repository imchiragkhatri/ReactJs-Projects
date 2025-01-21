const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");
require("dotenv").config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

app.post("/create-checkout-session", async (req, res) => {
    const { items, discountAmount, couponCode } = req.body; // Data from the frontend
  
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          ...items.map((item) => ({
            price_data: {
              currency: "usd",
              product_data: {
                name: item.title,
              },
              unit_amount: item.price * 100, // Stripe expects the amount in cents
            },
            quantity: item.quantity,
          })),
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `Discount (${couponCode || "Custom"})`,
                description: `Coupon: ${couponCode || "No Code Applied"}`,
              },
              unit_amount: -Math.abs(discountAmount) * 100, // Negative value for discount
            },
            quantity: 1,
          },
        ],
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel",
      });
  
      res.json({ url: session.url });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).send("Internal Server Error");
    }
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
