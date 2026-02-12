
const { onCall } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const Stripe = require("stripe");
require("dotenv").config();
admin.initializeApp();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = onCall(
    { region: "us-central1" },
    async (request) => {
        if (!request.auth) {
            throw new Error("UNAUTHENTICATED");
        }

        const { plan } = request.data;

        const amount =
            plan === "basic" ? 799 : 2499;

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "eur",
            automatic_payment_methods: { enabled: true },
        });

        return {
            clientSecret: paymentIntent.client_secret,
        };
    }
);
