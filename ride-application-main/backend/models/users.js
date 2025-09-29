const mongoose = require("mongoose");


const user_Schema = new mongoose.Schema({
  profile: {
    type: String,
    default: "default profile.png"
  },
  username: {
    type: String,
    required: true,
  },
  useremail: {
    type: String,
    required: true,
    unique: true,
  },
  countrycode: {
    type: String,
    default: "+1"
  },
  userphone: {
    type: String,
    default: ""
  },
  userpassword: {
    type: String,
    default: ""
  },
  customer_id:{
    type: String 
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allows multiple null values
  },
  usertype: {
    type: String,
    enum: ['admin', 'passenger', 'driver'],
    default: 'passenger'
  },
  role: { 
    type: String, 
    enum: ['admin', 'customer', 'driver'], 
    default: 'customer' 
  },
  usercountry: {
    type: String,
    default: ""
  },
  usercountrycode: {
    type: String,
    default: "+1"
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

const userModel = mongoose.model("userModel", user_Schema);

module.exports = userModel;
