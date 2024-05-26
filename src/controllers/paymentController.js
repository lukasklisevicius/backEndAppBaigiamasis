const express = require('express')
const router = express.Router()
const stripe = require('../stripe')
const { STRIPE_PUBLISHABLE_KEY } = require('../config')
const { connectionPool: connectionPool } = require('../db')

router.post('/payment-sheet', async (req, res) => {
    const customer = await stripe.createCustomer();
    console.log('PO PIRMO')
    const ephemeralKey = await stripe.createEphemeralKey(customer.id);
    console.log('PO antro')
    const data = req.body
    const paymentIntent = await stripe.createPaymentIntent({
        amount: data.credits * 3 * 10,
        currency: 'eur',
        customer: customer.id,
        metadata: {
            uuid: data.UUID,
            credits: data.credits
        },

        // In the latest version of the API, specifying the `automatic_payment_methods` parameter
        // is optional because Stripe enables its functionality by default.
        automatic_payment_methods: {
            enabled: true,
        },
    });
    console.log('PO trecio')

    res.json({
        paymentIntent: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: customer.id,
        publishableKey: STRIPE_PUBLISHABLE_KEY
    });
});

router.post('/webhook', express.raw({ type: 'application/json' }), (request, response) => {
    const signature = request.headers['stripe-signature'];

    let event;
    try {
        event = stripe.validateWebhook(request.body, signature);
    } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    switch (event.type) {
        
        case 'payment_intent.succeeded':
            const paymentIntentSucceeded = event.data.object;
            const userId = paymentIntentSucceeded.metadata.uuid
            const credits = paymentIntentSucceeded.metadata.credits
            connectionPool.getConnection(function(err, connection) {
                const sql = 'UPDATE users SET credits = credits + ? WHERE UUID = ?';
                connection.query(sql, [credits, userId], (error, results) => {
                    console.log('results', results);
                    if (error) {
                        console.log('Error updating user credits:', error);
                        response.status(500).json({ error: 'Server error' });
                        return;
                    }
                    connection.commit(function (err) {
                        if (err) {
                            return connection.rollback(function () {
                                console.error('Failed to commit changes')
                                response.status(500).json({ error: 'Server error' });
                                return
                            });
                        }
                        return;
                    });
                })

            })

            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    response.send();
});

module.exports = router