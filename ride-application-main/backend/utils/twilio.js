const twilio = require('twilio');

const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const twilioPhoneNumber = process.env.twilioPhoneNumber;

// console.log(accountSid, authToken, twilioPhoneNumber);

//------------------Create a Twilio client-----------------------//
// Only initialize if credentials are available
let client = null;
if (accountSid && authToken) {
    try {
        client = twilio(accountSid, authToken);
        console.log('Twilio client initialized successfully');
    } catch (error) {
        console.warn('Failed to initialize Twilio client:', error.message);
    }
} else {
    console.warn('Twilio credentials not found. SMS functionality will be disabled.');
}



//-------------------------------SEND WELCOME SMS--------------------------------//
function sendWelcomeSMS(toPhoneNumber) {
    if (!client) {
        console.log('Twilio not configured. Skipping welcome SMS.');
        return;
    }
    
    const welcomeMessage = `Welcome to Eber Ride! \n Your Account has been Successfully Created.`;
    
    // Send the welcome SMS
    client.messages.create({
        to: toPhoneNumber,
        from: twilioPhoneNumber,
        body: welcomeMessage
    })
    .then(message => console.log(`Welcome SMS sent to ${toPhoneNumber}`))
    .catch(error => console.error(`Failed to send welcome SMS: ${error.message}`));
}


//-------------------------------SEND RIDE STATUS SMS--------------------------------//
function sendRideSMS(toPhoneNumber, status) {
    if (!client) {
        console.log('Twilio not configured. Skipping ride status SMS.');
        return;
    }
    
    // Create the SMS message body based on the event code
    let smsBody = "";
    switch (status) {
        case 4:
            smsBody = "Driver has accepted your ride request.";
            break;
        case 5: 
            smsBody = "Driver has started your ride.";
            break;
        case 7: 
            smsBody = "Driver has completed your ride.";
            break;
        case 8: 
            smsBody = "Your payment has been processed.";
            break;
        default:
            smsBody = "Invalid event code";
            break;
    }

    // Send the SMS
    client.messages.create({
        to: toPhoneNumber,
        from: twilioPhoneNumber,
        body: smsBody
    })
    .then(message => console.log(`SMS sent to ${toPhoneNumber} for Ride Status: ${status}`))
    .catch(error => console.error(`Failed to send SMS: ${error.message}`));
}


module.exports = {
    client,
    sendRideSMS,
    sendWelcomeSMS
};