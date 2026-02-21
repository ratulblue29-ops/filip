const { onCall, onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const Stripe = require("stripe");
require("dotenv").config();

admin.initializeApp();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * =====================================
 * CREATE MEMBERSHIP PAYMENT INTENT (Callable)
 * =====================================
 * plan: basic | premium
 */
exports.createPaymentIntent = onCall(
  { region: "us-central1" },
  async (request) => {
    if (!request.auth) {
      throw new Error("UNAUTHENTICATED");
    }

    const { plan } = request.data;

    if (!["basic", "premium"].includes(plan)) {
      throw new Error("Invalid plan");
    }

    const amount = plan === "basic" ? 799 : 2499;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "eur",
      automatic_payment_methods: { enabled: true },
      metadata: {
        uid: request.auth.uid,
        type: "membership",
        tier: plan,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
    };
  }
);

/**
 * =====================================
 * CREATE CREDIT PACK PAYMENT INTENT (Callable)
 * =====================================
 * pack: credit_1 | credit_5 | credit_12 | credit_30
 */
exports.createCreditPackPaymentIntent = onCall(
  { region: "us-central1" },
  async (request) => {
    if (!request.auth) {
      throw new Error("UNAUTHENTICATED");
    }

    const { pack } = request.data;

    const creditPacks = {
      credit_1: { amount: 199, credits: 1 },
      credit_5: { amount: 799, credits: 5 },
      credit_12: { amount: 1499, credits: 12 },
      credit_30: { amount: 3499, credits: 30 },
    };

    if (!creditPacks[pack]) {
      throw new Error("Invalid credit pack");
    }

    const { amount, credits } = creditPacks[pack];

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "eur",
      automatic_payment_methods: { enabled: true },
      metadata: {
        uid: request.auth.uid,
        type: "credit_pack",
        pack: pack,
        creditsToAdd: String(credits),
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
    };
  }
);

/**
 * =====================================
 * STRIPE WEBHOOK
 * =====================================
 */
exports.stripeWebhook = onRequest(
  {
    region: "us-central1",
    rawBody: true,
  },
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    /**
     * =====================================
     * PAYMENT SUCCESS EVENT
     * =====================================
     */
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;

      const uid = paymentIntent.metadata?.uid;
      const type = paymentIntent.metadata?.type; // membership | credit_pack
      const paymentId = paymentIntent.id;

      if (!uid) {
        console.error("Missing uid in payment metadata");
        return res.status(400).send("Missing uid");
      }

      const now = admin.firestore.Timestamp.now();
      const userRef = admin.firestore().collection("users").doc(uid);

      // 🔥 Prevent duplicate processing (Stripe retries webhook sometimes)
      const paymentRef = admin
        .firestore()
        .collection("stripePayments")
        .doc(paymentId);

      try {
        await admin.firestore().runTransaction(async (transaction) => {
          const paymentDoc = await transaction.get(paymentRef);

          // Already processed
          if (paymentDoc.exists) {
            console.log("Payment already processed:", paymentId);
            return;
          }

          const userDoc = await transaction.get(userRef);

          if (!userDoc.exists) {
            throw new Error("User not found");
          }

          const userData = userDoc.data();

          const currentCredits = userData.credits || {
            balance: 0,
            lifetimeEarned: 0,
            used: 0,
          };

          /**
           * =====================================
           * MEMBERSHIP PAYMENT SUCCESS
           * =====================================
           */
          if (type === "membership") {
            const tier = paymentIntent.metadata?.tier;

            if (!["basic", "premium"].includes(tier)) {
              throw new Error("Invalid membership tier");
            }

            console.log("Membership payment success:", uid, "Tier:", tier);

            const expiresAt = admin.firestore.Timestamp.fromDate(
              new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            );

            let newBalance = currentCredits.balance;
            let newLifetime = currentCredits.lifetimeEarned;

            // BASIC → +50 credits
            if (tier === "basic") {
              newBalance += 50;
              newLifetime += 50;
            }

            // PREMIUM → unlimited credits
            if (tier === "premium") {
              newBalance = 999999999999;
            }

            transaction.update(userRef, {
              membership: {
                tier: tier, // free | basic | premium
                startedAt: now,
                expiresAt: expiresAt,
                fullTimeAdsLimit: tier === "basic" ? 1 : 9999,
                fullTimeAdsPostedThisMonth: 0,
                monthKey: new Date().toISOString().slice(0, 7),
              },
              credits: {
                balance: newBalance,
                lifetimeEarned: newLifetime,
                used: currentCredits.used,
              },
              updatedAt: now,
            });
          }

          /**
           * =====================================
           * CREDIT PACK PAYMENT SUCCESS
           * =====================================
           */
          if (type === "credit_pack") {
            const creditsToAdd = parseInt(
              paymentIntent.metadata?.creditsToAdd || "0"
            );

            if (!creditsToAdd || creditsToAdd <= 0) {
              throw new Error("Invalid creditsToAdd");
            }

            console.log("Credit pack purchase success:", uid, "Credits:", creditsToAdd);

            transaction.update(userRef, {
              credits: {
                balance: currentCredits.balance + creditsToAdd,
                lifetimeEarned: currentCredits.lifetimeEarned + creditsToAdd,
                used: currentCredits.used,
              },
              updatedAt: now,
            });
          }

          /**
           * =====================================
           * SAVE PAYMENT RECORD (Idempotency)
           * =====================================
           */
          transaction.set(paymentRef, {
            uid: uid,
            type: type || "unknown",
            stripePaymentIntentId: paymentId,
            createdAt: now,
          });
        });
      } catch (err) {
        console.error("Webhook transaction failed:", err.message);
        return res.status(500).send("Webhook transaction failed");
      }
    }

    res.status(200).json({ received: true });
  }
);

const { onSchedule } = require("firebase-functions/v2/scheduler");

/**
 * =====================================
 * DAILY CRON — Expire active seasonal jobs
 * Runs every day at midnight UTC
 * Logic: type=seasonal + visibility.priority=active + schedule.end < now + no engagements → expired
 * =====================================
 */
exports.expireSeasonalJobs = onSchedule(
  { schedule: "0 0 * * *", region: "us-central1" },
  async () => {
    const db = admin.firestore();
    const now = new Date();

    // Fetch all active seasonal jobs
    const snap = await db
      .collection("jobs")
      .where("type", "==", "seasonal")
      .where("visibility.priority", "==", "active")
      .get();

    if (snap.empty) return;

    const batch = db.batch();

    for (const jobDoc of snap.docs) {
      const data = jobDoc.data();
      const scheduleEnd = data?.schedule?.end;

      // Skip if no end date
      if (!scheduleEnd) continue;

      const endDate = new Date(scheduleEnd);

      // Skip if not yet expired
      if (endDate > now) continue;

      // Check if any engagement exists for this post
      const engSnap = await db
        .collection("engagements")
        .where("availabilityPostId", "==", jobDoc.id)
        .limit(1)
        .get();

      if (!engSnap.empty) {
        // Has engagement + past end date → consumed
        batch.update(jobDoc.ref, {
          "visibility.priority": "consumed",
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        continue;
      }

      // No engagement + past end date → expire
      batch.update(jobDoc.ref, {
        "visibility.priority": "expired",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    await batch.commit();
    console.log("expireSeasonalJobs cron completed");
  }
);