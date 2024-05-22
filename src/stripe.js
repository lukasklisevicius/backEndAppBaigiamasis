const Stripe = require('stripe');
const { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_ENDPOINT_SECRET } = require('./config');

const stripe = Stripe(STRIPE_SECRET_KEY);

module.exports = {
    // stripe: stripe,
    validateWebhook: (rawRequestBody, signature) => stripe.webhooks.constructEvent(rawRequestBody, signature, STRIPE_WEBHOOK_ENDPOINT_SECRET),
    createCustomer: async () => await stripe.customers.create(),
    createEphemeralKey: async (customerID) => await stripe.ephemeralKeys.create({ customer: customerID }, { apiVersion: '2024-04-10' }),
    createPaymentIntent: async (createIntentRequest) => await stripe.paymentIntents.create(createIntentRequest),
};