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
    required: true,
  },
  userphone: {
    type: String,
    required: true,
    unique: true,
  },
  customer_id:{
    type: String 
 },
  role: { 
    type: String, 
    enum: ['admin', 'customer', 'driver'], 
    default: 'customer' 
  }
});

const userModel = mongoose.model("userModel", user_Schema);

module.exports = userModel;
