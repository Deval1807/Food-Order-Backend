// Email

// Notifications

// OTP
export const GenerateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 90000);

    // set expiry for 30 mins fron generating
    let expiry = new Date();
    expiry.setTime( new Date().getTime() + (30 * 60 * 1000) )

    return { otp, expiry }
}

// sendint otp to phone number
export const SendOtp = async (otp: number, toPhoneNumber: string) => {
    const accountSid = process.env.TWILIO_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);

    const res = client.messages.create({
        body: `Your OTP is ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+91${toPhoneNumber}`,
    });


    return res;

}

// Payment Notifications