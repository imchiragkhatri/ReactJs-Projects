const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const Stripe = require("stripe");
const path = require("path");

dotenv.config(); // Load environment variables from a .env file
const app = express();
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.static(path.join(__dirname, "build")));

const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Initialize Stripe with secret key

app.post("/create-payment-intent", async (req, res) => {
  try {
    console.log(req);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount * 100, // Replace with your amount
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating payment intent");
  }
});

const createCustomCoupon = async (discountAmount) => {
  try {
    const coupon = await stripe.coupons.create({
      amount_off: Math.round(discountAmount * 100), // Convert to cents
      currency: "usd",
      duration: "once", // One-time discount
    });

    return coupon.id;
  } catch (error) {
    console.error("Error creating custom coupon:", error);
    throw error;
  }
};

app.post("/create-checkout-session", async (req, res) => {
  const { items, discountAmount, couponCode, shipping, customerEmail, customerName, order_id } = req.body; 
  try {
    const line_items = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
          images: [item.thumbnail],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: 1, // Assume 1 quantity for simplicity
    }));

    const sessionData = {
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.APP_URL}/?session_id={CHECKOUT_SESSION_ID}&ref=${order_id}`,
      cancel_url: `${process.env.APP_URL}/checkout`,
      customer_email: customerEmail,
      metadata: {
        customer_name: customerName,
        order_id: order_id,
        coupon_code: couponCode || "",
        discount: discountAmount || 0
      },
      shipping_options: [
        {
          shipping_rate_data: {
            display_name: shipping.name || "Standard Shipping",
            type: "fixed_amount",
            fixed_amount: {
              amount: Math.round(shipping.amount * 100), // Convert to cents
              currency: "usd",
            },
            metadata: {
              description: shipping.info,
            },
          },
        },
      ],
    };
    

    if (discountAmount > 0) {
      sessionData.discounts = [
        {
          coupon: await createCustomCoupon(discountAmount),
        },
      ];
    }

    console.log("Session Data:", sessionData);
    const session = await stripe.checkout.sessions.create(sessionData);
   // console.log(session);
    res.json({ url: session.url });
  } catch (error) {
    //console.error("Error creating checkout session:", error);
    res.json({ error: error });
   // res.status(500).send("Internal Server Error");
  }
});

app.post("/retrieve-session", async (req, res) => {
  const { sessionId } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    res.json(session); // Send session details to frontend
  } catch (error) {
    console.error("Error retrieving session:", error);
    res.status(500).send("Error retrieving session");
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on the port ${PORT} for Stripe Payment Integration.`);
});
