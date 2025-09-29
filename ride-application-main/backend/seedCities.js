require('dotenv').config();
const mongoose = require('mongoose');
const cityModel = require('./models/city');
const countryModel = require('./models/country');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const cities = [
    { city: "Mumbai", coordinates: [19.0760, 72.8777] },
    { city: "Delhi", coordinates: [28.7041, 77.1025] },
    { city: "Bengaluru", coordinates: [12.9716, 77.5946] },
    { city: "Hyderabad", coordinates: [17.3850, 78.4867] },
    { city: "Ahmedabad", coordinates: [23.0225, 72.5714] },
    { city: "Chennai", coordinates: [13.0827, 80.2707] },
    { city: "Kolkata", coordinates: [22.5726, 88.3639] },
    { city: "Pune", coordinates: [18.5204, 73.8567] },
    { city: "Jaipur", coordinates: [26.9124, 75.7873] },
    { city: "Surat", coordinates: [21.1702, 72.8311] },
    { city: "Lucknow", coordinates: [26.8467, 80.9462] },
    { city: "Kanpur", coordinates: [26.4499, 80.3319] },
    { city: "Nagpur", coordinates: [21.1458, 79.0882] },
    { city: "Indore", coordinates: [22.7196, 75.8577] },
    { city: "Thane", coordinates: [19.2183, 72.9781] },
    { city: "Bhopal", coordinates: [23.2599, 77.4126] },
    { city: "Visakhapatnam", coordinates: [17.6868, 83.2185] },
    { city: "Pimpri-Chinchwad", coordinates: [18.6279, 73.8000] },
    { city: "Patna", coordinates: [25.5941, 85.1376] },
    { city: "Vadodara", coordinates: [22.3072, 73.1812] },
    { city: "Ghaziabad", coordinates: [28.6692, 77.4538] },
    { city: "Ludhiana", coordinates: [30.9009, 75.8573] },
    { city: "Agra", coordinates: [27.1767, 78.0081] },
    { city: "Nashik", coordinates: [19.9975, 73.7898] },
    { city: "Faridabad", coordinates: [28.4089, 77.3178] },
    { city: "Meerut", coordinates: [28.9845, 77.7064] },
    { city: "Rajkot", coordinates: [22.3039, 70.8022] },
    { city: "Kalyan-Dombivli", coordinates: [19.2354, 73.1299] },
    { city: "Vasai-Virar", coordinates: [19.3919, 72.8397] },
    { city: "Varanasi", coordinates: [25.3176, 82.9739] },
    { city: "Srinagar", coordinates: [34.0837, 74.7973] },
    { city: "Aurangabad", coordinates: [19.8762, 75.3433] },
    { city: "Dhanbad", coordinates: [23.7957, 86.4304] },
    { city: "Amritsar", coordinates: [31.6340, 74.8723] },
    { city: "Navi Mumbai", coordinates: [19.0330, 73.0297] },
    { city: "Allahabad", coordinates: [25.4358, 81.8463] },
    { city: "Ranchi", coordinates: [23.3441, 85.3096] },
    { city: "Howrah", coordinates: [22.5958, 88.2636] },
    { city: "Coimbatore", coordinates: [11.0168, 76.9558] },
    { city: "Jabalpur", coordinates: [23.1815, 79.9864] },
    { city: "Gwalior", coordinates: [26.2183, 78.1828] },
    { city: "Vijayawada", coordinates: [16.5062, 80.6480] },
    { city: "Jodhpur", coordinates: [26.2389, 73.0243] },
    { city: "Madurai", coordinates: [9.9252, 78.1198] },
    { city: "Raipur", coordinates: [21.2514, 81.6296] },
    { city: "Kota", coordinates: [25.2138, 75.8648] },
    { city: "Guwahati", coordinates: [26.1445, 91.7362] },
    { city: "Chandigarh", coordinates: [30.7333, 76.7794] },
    { city: "Solapur", coordinates: [17.6599, 75.9064] },
    { city: "Hubli-Dharwad", coordinates: [15.3647, 75.1240] }
];

// Function to get India's country_id
async function getIndiaCountryId() {
    try {
        const country = await countryModel.findOne({ countryName: 'India' });
        if (!country) {
            throw new Error('Country "India" not found in the database');
        }
        return country._id;
    } catch (error) {
        console.error('Error fetching India country_id:', error);
        throw error;
    }
}

// Seed cities function
async function seedCities() {
    try {
        // Fetch India's country_id
        const indiaCountryId = await getIndiaCountryId();
        console.log('India country_id:', indiaCountryId);

        // Add country_id to each city
        const citiesWithCountryId = cities.map(city => ({
            country_id: indiaCountryId,
            city: city.city,
            coordinates: city.coordinates
        }));

        // Validate data
        const validCities = citiesWithCountryId.filter(city => {
            if (!city.city || !city.coordinates || !city.country_id) {
                console.error('Invalid city data:', city);
                return false;
            }
            return true;
        });

        // Clear existing cities
        await cityModel.deleteMany({});

        // Insert cities
        await cityModel.insertMany(validCities);
        console.log('Cities seeded successfully');

    } catch (error) {
        console.error('Error seeding cities:', error);
        if (error.code === 11000) {
            console.error('Duplicate city name detected. Ensure all city names are unique.');
        }
    } finally {
        mongoose.connection.close();
    }
}

// Run the seeding function
seedCities();