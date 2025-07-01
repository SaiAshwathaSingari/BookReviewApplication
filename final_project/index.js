const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());
const SECRET_KEY = "your_secret_key";
app.use("/customer",session({secret:SECRET_KEY,resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
  const auth = req.session.authorization;
  if (!auth || !auth.accessToken) {
    return res.status(401).json({ message: "You must log in first." });
  }
    jwt.verify(auth.accessToken,SECRET_KEY, (err, payload) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }
    // stash username in req for handlers
    req.user = payload.username;
    next();
    });
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log(`Click me http://localhost:${PORT}`));
