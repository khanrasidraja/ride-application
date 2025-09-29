require("dotenv").config();
const mongoose = require("mongoose");
const countryModel = require("./models/country");

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Common country phone codes
const phoneCountryCodes = [
  { countryName: "United States", countryCode: "+1" },
  { countryName: "Canada", countryCode: "+1" },
  { countryName: "India", countryCode: "+91" },
  { countryName: "United Kingdom", countryCode: "+44" },
  { countryName: "Australia", countryCode: "+61" },
  { countryName: "Germany", countryCode: "+49" },
  { countryName: "France", countryCode: "+33" },
  { countryName: "Japan", countryCode: "+81" },
  { countryName: "China", countryCode: "+86" },
  { countryName: "Brazil", countryCode: "+55" },
  { countryName: "Russia", countryCode: "+7" },
  { countryName: "South Africa", countryCode: "+27" },
  { countryName: "Mexico", countryCode: "+52" },
  { countryName: "Italy", countryCode: "+39" },
  { countryName: "Spain", countryCode: "+34" },
  { countryName: "Netherlands", countryCode: "+31" },
  { countryName: "Belgium", countryCode: "+32" },
  { countryName: "Switzerland", countryCode: "+41" },
  { countryName: "Austria", countryCode: "+43" },
  { countryName: "Sweden", countryCode: "+46" },
  { countryName: "Norway", countryCode: "+47" },
  { countryName: "Denmark", countryCode: "+45" },
  { countryName: "Finland", countryCode: "+358" },
  { countryName: "Poland", countryCode: "+48" },
  { countryName: "Turkey", countryCode: "+90" },
  { countryName: "Greece", countryCode: "+30" },
  { countryName: "Portugal", countryCode: "+351" },
  { countryName: "Ireland", countryCode: "+353" },
  { countryName: "Czech Republic", countryCode: "+420" },
  { countryName: "Hungary", countryCode: "+36" },
  { countryName: "Romania", countryCode: "+40" },
  { countryName: "Bulgaria", countryCode: "+359" },
  { countryName: "Croatia", countryCode: "+385" },
  { countryName: "Serbia", countryCode: "+381" },
  { countryName: "Ukraine", countryCode: "+380" },
  { countryName: "Belarus", countryCode: "+375" },
  { countryName: "Lithuania", countryCode: "+370" },
  { countryName: "Latvia", countryCode: "+371" },
  { countryName: "Estonia", countryCode: "+372" },
  { countryName: "Slovenia", countryCode: "+386" },
  { countryName: "Slovakia", countryCode: "+421" },
  { countryName: "South Korea", countryCode: "+82" },
  { countryName: "Thailand", countryCode: "+66" },
  { countryName: "Vietnam", countryCode: "+84" },
  { countryName: "Malaysia", countryCode: "+60" },
  { countryName: "Singapore", countryCode: "+65" },
  { countryName: "Indonesia", countryCode: "+62" },
  { countryName: "Philippines", countryCode: "+63" },
  { countryName: "Hong Kong", countryCode: "+852" },
  { countryName: "Taiwan", countryCode: "+886" },
  { countryName: "New Zealand", countryCode: "+64" },
  { countryName: "Argentina", countryCode: "+54" },
  { countryName: "Chile", countryCode: "+56" },
  { countryName: "Colombia", countryCode: "+57" },
  { countryName: "Peru", countryCode: "+51" },
  { countryName: "Venezuela", countryCode: "+58" },
  { countryName: "Ecuador", countryCode: "+593" },
  { countryName: "Uruguay", countryCode: "+598" },
  { countryName: "Paraguay", countryCode: "+595" },
  { countryName: "Bolivia", countryCode: "+591" },
  { countryName: "Egypt", countryCode: "+20" },
  { countryName: "Nigeria", countryCode: "+234" },
  { countryName: "Kenya", countryCode: "+254" },
  { countryName: "Ghana", countryCode: "+233" },
  { countryName: "Morocco", countryCode: "+212" },
  { countryName: "Tunisia", countryCode: "+216" },
  { countryName: "Algeria", countryCode: "+213" },
  { countryName: "Libya", countryCode: "+218" },
  { countryName: "Sudan", countryCode: "+249" },
  { countryName: "Ethiopia", countryCode: "+251" },
  { countryName: "Uganda", countryCode: "+256" },
  { countryName: "Tanzania", countryCode: "+255" },
  { countryName: "Zimbabwe", countryCode: "+263" },
  { countryName: "Zambia", countryCode: "+260" },
  { countryName: "Botswana", countryCode: "+267" },
  { countryName: "Namibia", countryCode: "+264" },
  { countryName: "Israel", countryCode: "+972" },
  { countryName: "United Arab Emirates", countryCode: "+971" },
  { countryName: "Saudi Arabia", countryCode: "+966" },
  { countryName: "Kuwait", countryCode: "+965" },
  { countryName: "Qatar", countryCode: "+974" },
  { countryName: "Bahrain", countryCode: "+973" },
  { countryName: "Oman", countryCode: "+968" },
  { countryName: "Jordan", countryCode: "+962" },
  { countryName: "Lebanon", countryCode: "+961" },
  { countryName: "Syria", countryCode: "+963" },
  { countryName: "Iraq", countryCode: "+964" },
  { countryName: "Iran", countryCode: "+98" },
  { countryName: "Afghanistan", countryCode: "+93" },
  { countryName: "Pakistan", countryCode: "+92" },
  { countryName: "Bangladesh", countryCode: "+880" },
  { countryName: "Sri Lanka", countryCode: "+94" },
  { countryName: "Nepal", countryCode: "+977" },
  { countryName: "Bhutan", countryCode: "+975" },
  { countryName: "Maldives", countryCode: "+960" }
];

async function seedPhoneCountryCodes() {
  try {
    console.log("Connecting to database...");
    
    // Clear existing data
    await countryModel.deleteMany({});
    console.log("Cleared existing country data");
    
    // Insert phone country codes
    await countryModel.insertMany(phoneCountryCodes);
    console.log(`✅ Successfully seeded ${phoneCountryCodes.length} countries with phone codes`);
    
    // Verify the data
    const count = await countryModel.countDocuments();
    console.log(`Total countries in database: ${count}`);
    
    // Show first few entries
    const sample = await countryModel.find().limit(5);
    console.log("Sample entries:", sample);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding phone country codes:", error);
    process.exit(1);
  }
}

seedPhoneCountryCodes();