// const mongoose = require("mongoose");


// const country_Schema = new mongoose.Schema({
//   countryName: {
//     type: String,
//     required:true,
//     unique: true,
//   },
//   countryTimeZone: {
//     type: String,
//   },
//   countryCode: {
//     type: String,
//   },
//   countryCurrency: {
//     type: String,
//   },
//   flagImage: {              
//     type: String,
//   }
// });

// const countryModel = mongoose.model("countryModel", country_Schema);  //mapping vehicle_model data into vehicle_data


// module.exports = countryModel;

// // const mongoose = require("mongoose");

// // const country_Schema = new mongoose.Schema({
// //   countryName: {
// //     type: String,
// //     required: true,
// //     unique: true,
// //     trim: true,
// //   },
// //   countryTimeZone: {
// //     type: String,
// //   },
// //   countryCode: {
// //     type: String,
// //     trim: true,
// //     uppercase: true,
// //   },
// //   countryCurrency: {
// //     type: String,
// //   },
// //   flagImage: {
// //     type: String,
// //     validate: {
// //       validator: function (v) {
// //         return /^https?:\/\/.+\.(jpg|jpeg|png|svg|webp)$/i.test(v);
// //       },
// //       message: "Invalid image URL",
// //     },
// //   },
// // }, { timestamps: true });

// // const countryModel = mongoose.model("countryModel", country_Schema);
// // module.exports = countryModel;


const mongoose = require("mongoose");
const countrySchema = new mongoose.Schema({
  countryName: { type: String, required: true, unique: true },
  countryTimeZone: { type: String },
  countryCode: { type: String },
  countryCurrency: { type: String },
  flagImage: { type: String }
});
module.exports = mongoose.model("countryModel", countrySchema);