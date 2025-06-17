require("dotenv").config();
const axios = require("axios");
const mongoose = require("mongoose");
const countryModel = require("./models/country");

// Optional: Configure axios-retry (only if installed)
let axiosRetry;
try {
  axiosRetry = require("axios-retry").default;
  axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });
} catch (e) {
  console.log("axios-retry not installed, proceeding without retries");
}

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function fetchAndSeedCountries() {
  try {
    // Fetch specific fields from v3.1 API
    const response = await axios.get(
      "https://restcountries.com/v3.1/all?fields=name,cca2,currencies,flags,timezones"
    );
    console.log("API response status:", response.status);

    const countryList = response.data.map((country) => ({
      countryName: country.name.common,
      countryCode: country.cca2, // ISO 3166-1 alpha-2 code
      countryCurrency: country.currencies
        ? Object.keys(country.currencies)[0] // First currency code (e.g., "USD")
        : null,
      flagImage: country.flags.png, 
      countryTimeZone: country.timezones[0], 
    }));

    // Remove duplicates by countryName
    const uniqueCountries = Array.from(
      new Map(countryList.map((c) => [c.countryName, c])).values()
    );

    await countryModel.deleteMany({});
    await countryModel.insertMany(uniqueCountries);

    console.log("✅ All countries seeded successfully.");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding countries:", err.message, err.response?.data, err.response?.status);
    process.exit(1);
  }
}

fetchAndSeedCountries();