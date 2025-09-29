const express = require("express");
const router = express.Router();
const userModel = require("../models/users");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtSecret = process.env.jwtSecret || "your_secret_key";

/**
 * Google Login/Register Route
 * Handles both new user registration and existing user login via Google
 */
router.post("/google-login", async (req, res) => {
  try {
    const { email, name, picture, googleId } = req.body;

    // Validate required fields
    if (!email || !name || !googleId) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields: email, name, or googleId" 
      });
    }

    // Check if user already exists with this email
    let user = await userModel.findOne({ useremail: email });

    if (user) {
      // User exists - update Google ID if not already set
      if (!user.googleId) {
        user.googleId = googleId;
        user.profile = picture || user.profile;
        await user.save();
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user._id, 
          email: user.useremail,
          role: user.usertype || 'passenger' 
        },
        jwtSecret,
        { expiresIn: "7d" }
      );

      return res.status(200).json({
        success: true,
        message: "Google login successful",
        token,
        user: {
          id: user._id,
          name: user.username || name,
          email: user.useremail,
          role: user.usertype || 'passenger',
          picture: user.profile || picture
        }
      });

    } else {
      // New user - create account with Google info
      const newUser = new userModel({
        username: name,
        useremail: email,
        usertype: 'passenger', // Default role
        googleId: googleId,
        profile: picture,
        // Set a random password since they're using Google auth
        userpassword: require('crypto').randomBytes(32).toString('hex'),
        userphone: '', // Can be updated later
        usercountry: '', // Can be updated later
        usercountrycode: '+1' // Default country code
      });

      const savedUser = await newUser.save();

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: savedUser._id, 
          email: savedUser.useremail,
          role: savedUser.usertype 
        },
        jwtSecret,
        { expiresIn: "7d" }
      );

      return res.status(201).json({
        success: true,
        message: "Google account registered successfully",
        token,
        user: {
          id: savedUser._id,
          name: savedUser.username,
          email: savedUser.useremail,
          role: savedUser.usertype,
          picture: savedUser.profile
        }
      });
    }

  } catch (error) {
    console.error("Google login error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error during Google authentication",
      error: error.message 
    });
  }
});

module.exports = router;