const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Stripe = require("stripe");
require("dotenv").config();

admin.initializeApp();

const stripe = new Stripe(process.env.STRIPE_SECRET);

exports.createSubscription = functions.https.onCall(
    async (data, context) => {
        if (!context.auth) {
            throw new functions.https.HttpsError(
                "unauthenticated",
                "User must be logged in"
            );
        }

        const uid = context.auth.uid;
        const plan = data.plan;

        const priceId =
            plan === "premium"
                ? "price_1SzjXCPpMtwKwUItpyg0E18X"
                : "price_1SzjVIPpMtwKwUIta1zre45D";

        const userDoc = await admin
            .firestore()
            .collection("users")
            .doc(uid)
            .get();

        const email = userDoc.data()?.email;

        const customer = await stripe.customers.create({
            email: email,
            metadata: { firebaseUID: uid },
        });

        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price: priceId }],
            payment_behavior: "default_incomplete",
            expand: ["latest_invoice.payment_intent"],
        });

        const invoice = subscription.latest_invoice;

        let clientSecret = null;

        if (invoice && invoice.payment_intent) {
            clientSecret = invoice.payment_intent.client_secret;
        }

        return { clientSecret };
    }
);
