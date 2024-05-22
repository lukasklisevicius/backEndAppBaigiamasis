const express = require('express');
const { APP_PORT } = require('./config');

const messagesRoutes = require('./controllers/messagesController')
const paymentsRoutes = require('./controllers/paymentController')
const userRoutes = require('./controllers/userController')

const app = express();
app.use((req,res,next) => {
  if (req.originalUrl === '/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use(messagesRoutes)
app.use(paymentsRoutes)
app.use(userRoutes)

app.listen(APP_PORT, () => {
  console.log(`Server running on port ${APP_PORT}`);
});