// routes/userlogin.js
const express = require("express");
const router = express.Router();
const userModel = require("../models/users");
const jwt = require("jsonwebtoken");

router.post("/userlogin", async (req, res) => {
  const { useremail, userphone } = req.body;

  try {
    const user = await userModel.findOne({ useremail, userphone });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "your_secret_key",
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        useremail: user.useremail,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Login error", error });
  }
});

module.exports = router;
