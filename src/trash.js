// const { paymentIntentT } = await stripe.retrievePaymentIntent(paymentIntent.clientSecret);

// switch (paymentIntentT.status) {
//   case "succeeded":
//     console.log("Payment succeeded!");
//     break;
//   case "processing":
//     console.log("Your payment is processing.");
//     break;
//   case "requires_payment_method":
//     console.log("Your payment was not successful, please try again.");
//     break;
//   default:
//     console.log("Something went wrong.");
//     break;
// }


// const pool = mysql.createPool({
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME,
//   socketPath: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`
// })


// -----------------
// This example sets up an endpoint using the Express framework.
// Watch this video to get started: https://youtu.be/rPR2aJ6XnAc.

// -----------------
// app.post('/purchase-credits', async (req, res) => {
//   const { userId, selectedCredits } = req.body;

//   try {
//     const amount = selectedCredits * 200; // Assuming the price is 2 EUR per 10 credits

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amount,
//       currency: 'eur',
//       metadata: { userId }
//     });

//     const sql = 'UPDATE users SET credits = credits + ? WHERE UUID = ?';
//     connection.query(sql, [selectedCredits, userId], (error, results) => {
//       if (error) {
//         console.error('Error updating user credits:', error);
//         res.status(500).json({ error: 'Server error' });
//         return;
//       }
//       res.json({ clientSecret: paymentIntent.client_secret });
//     });
//   } catch (error) {
//     console.error('Error creating payment intent:', error);
//     res.status(500).json({ error: 'Payment error' });
//   }
// });

// app.post('/sendMessagesv2', async (req, res) => {


//   connection.beginTransaction(async (err) => {
//     if (err) {
//       return res.status(500).json({ message: 'Transaction error' });
//     }

//     try {
//       const userBalance = await getAndLockUser(req.body.userData, connection);
//       if (!userBalance) {
//         return res.status(404).json({ message: 'User not found' });
//       }
//       console.log(userBalance);

//       const assignments = assignGifts(req.body.participants);
//       const messageCost = 1; // Assume each message costs 1 credit
//       const totalCost = assignments.length * messageCost;

//       if (userBalance.credits < totalCost) {
//         return res.status(400).json({ message: 'Insufficient balance' });
//       }


//       const newBalance = userBalance.credits - totalCost;
//       await updateUserBalance(req.body.userData.UUID, newBalance, connection);
//       console.log('mes po balanco msg');

//       await buildMsg(assignments, req.body.participants, req.body.text1, req.body.text2);
//       console.log('mes po build msg');


//       connection.commit((err) => {
//         if (err) {
//           console.log('gavom errora commitinant');
//           return connection.rollback(() => {
//             console.log('roleback 1');
//             res.status(500).json({ message: 'Commit error' });
//           });
//         }
//         res.status(200).json({ message: 'Messages sent successfully' });
//       });
//     } catch (error) {
//       console.log(error);
//       connection.rollback(() => {
//         res.status(500).json({ message: 'Internal server error' });
//       });
//     } finally {
//       console.log('Ar uszidaro connectionas?');
//       connection.end();
//     }
//   });
// });
// ------------------------
// function getAndLockUser(userId, connection) {
//     return new Promise((resolve, reject) => {
//       const sql = 'SELECT * FROM users WHERE uuid = ? FOR UPDATE';
//       connection.query(sql, [userId], (error, results) => {
//         if (error) {
//           return reject(error);
//         }
//         if (results.length === 0) {
//           return resolve(null);  // or handle user not found case differently
//         }
//         resolve(results[0]);
//       });
//     });
//   }
  
//   function updateUserBalance(userId, newBalance, connection) {
//     return new Promise((resolve, reject) => {
//       const sql = 'UPDATE users SET credits = ? WHERE uuid = ?';
//       connection.query(sql, [newBalance, userId], (error, results) => {
//         if (error) {
//           return reject(error);
//         }
//         resolve(results);
//       });
//     });
//   }