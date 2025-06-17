// const express = require('express');
// const credentials = express.Router();

// // credentials.get('/env', (req, res) => {
// //   const envData = {
// //     EMAIL_USER: process.env.EMAIL_USER,
// //     EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
// //     accountSid: process.env.accountSid,
// //     authToken: process.env.authToken,
// //     twilioPhoneNumber: process.env.twilioPhoneNumber,
// //     STRIPE_Secret_key: process.env.STRIPE_Secret_key,
// //     STRIPE_Publishable_key: process.env.STRIPE_Publishable_key
// //   };
// //   res.json(envData);
// //   // console.log(envData)
// // });

// module.exports = credentials;

const express = require("express");
const router = express.Router();
const userModel = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/userlogin", async (req, res) => {
  const { useremail, userphone } = req.body;

  try {
    const user = await userModel.findOne({ useremail, userphone });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      "your_jwt_secret", // Replace with process.env.JWT_SECRET if using env
      { expiresIn: "1d" }
    );

    res.json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
