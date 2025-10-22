const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// ✅ Session middleware
app.use(session({
  secret: "fingerprint_customer",
  resave: true,
  saveUninitialized: true
}));

// ✅ Middleware opsional — biarkan lewat, JWT diverifikasi di auth_users.js
app.use("/customer/auth/*", (req, res, next) => {
  next();
});

// ✅ Routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
