const express = require("express");
const registerRoutes = express.Router()
const adminModel = require("../models/login");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require("dotenv").config();
const jwtSecret = process.env.jwtSecret         //jwt secret key used to verify jwt token stored in env varibales
const session = require('express-session');


registerRoutes.use(session({
  secret: 'my-session-key',
  resave: false,
  saveUninitialized: true
}));


//  API to register data of user in database using Angular form.
registerRoutes.post('/register', async (req, res) => {
  console.log(req.body);

  try {
    // Extract data from request body, handling both old and new field names
    const { Name, adminName, email, password, cnfpassword } = req.body;
    
    // Validate required fields
    if (!email || !password || !cnfpassword) {
      return res.status(400).json({ success: false, message: "Email, password, and confirm password are required" });
    }
    
    // Check password match
    if (password !== cnfpassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    const user = new adminModel({
      adminName: Name || adminName, // Handle both field names
      email: email,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)), // Hashing the password
      cnfpassword: cnfpassword,
    })
    
    await user.save()
      .then(() => {
        // Generate a JWT token
        const token = jwt.sign({ email: user.email }, jwtSecret);

        // Store token in session
        req.session.token = token;

        console.log("Registration jwt Token :", token)
        res.json({ success: true, message: "Account has been created", token })

      })
      .catch((err) => {
        console.log(err);
        if (err.keyPattern) {
          console.log("User Already Exists")
          return res.status(500).json({ success: false, message: "User Already Exists" });
        }
        throw err;
      })
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Registration failed: " + err.message });
  }
})

module.exports = registerRoutes;


