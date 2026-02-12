// // /**
// //  * Import function triggers from their respective submodules:
// //  *
// //  * const {onCall} = require("firebase-functions/v2/https");
// //  * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
// //  *
// //  * See a full list of supported triggers at https://firebase.google.com/docs/functions
// //  */

// // const {setGlobalOptions} = require("firebase-functions");
// // const {onRequest} = require("firebase-functions/https");
// // const logger = require("firebase-functions/logger");

// // // For cost control, you can set the maximum number of containers that can be
// // // running at the same time. This helps mitigate the impact of unexpected
// // // traffic spikes by instead downgrading performance. This limit is a
// // // per-function limit. You can override the limit for each function using the
// // // `maxInstances` option in the function's options, e.g.
// // // `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// // // NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// // // functions should each use functions.runWith({ maxInstances: 10 }) instead.
// // // In the v1 API, each function can only serve one request per container, so
// // // this will be the maximum concurrent request count.
// // setGlobalOptions({ maxInstances: 10 });

// // // Create and deploy your first functions
// // // https://firebase.google.com/docs/functions/get-started

// // // exports.helloWorld = onRequest((request, response) => {
// // //   logger.info("Hello logs!", {structuredData: true});
// // //   response.send("Hello from Firebase!");
// // // });


// const { onCall, HttpsError } = require("firebase-functions/v2/https");
// const admin = require("firebase-admin");
// const Stripe = require("stripe");

// admin.initializeApp();

// // ⚠️ TEST SECRET KEY (later use Secret Manager in production)
// const stripe = new Stripe("REMOVED_51SL7SOLT7u05bl0TZL2k2X5cZOIkmJzgAWjaHtGrSmmtwTEQTE4DH2wMlwIZqSimuDNl0yhxj559AFGpq8wGUSOG00L8oEuTYJ");

// exports.createPaymentIntent = onCall(
//     {
//         region: "us-central1",
//     },
//     async (request) => {
//         try {
//             // 🔐 Auth check
//             if (!request.auth) {
//                 throw new HttpsError("unauthenticated", "User not authenticated");
//             }

//             const uid = request.auth.uid;
//             const { plan } = request.data;

//             if (!plan) {
//                 throw new HttpsError("invalid-argument", "Plan is required");
//             }

//             let amount;

//             if (plan === "basic") {
//                 amount = 999; // €9.99
//             } else if (plan === "premium") {
//                 amount = 2499; // €24.99
//             } else {
//                 throw new HttpsError("invalid-argument", "Invalid plan selected");
//             }

//             const paymentIntent = await stripe.paymentIntents.create({
//                 amount,
//                 currency: "eur",
//                 automatic_payment_methods: { enabled: true },
//                 metadata: {
//                     uid,
//                     plan,
//                 },
//             });

//             return {
//                 clientSecret: paymentIntent.client_secret,
//             };
//         } catch (error) {
//             console.error("Stripe Error:", error);
//             throw new HttpsError("internal", error.message);
//         }
//     }
// );
const { onCall } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const Stripe = require("stripe");

admin.initializeApp();

const stripe = new Stripe("REMOVED_51SL7SOLT7u05bl0TZL2k2X5cZOIkmJzgAWjaHtGrSmmtwTEQTE4DH2wMlwIZqSimuDNl0yhxj559AFGpq8wGUSOG00L8oEuTYJ");

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
