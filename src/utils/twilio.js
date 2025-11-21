// import twilio from "twilio";
// import "dotenv/config";
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = twilio(accountSid, authToken);
// console.log(accountSid, authToken)
// // const client = twilio(
// //   "ACbab507247b884772a40390657b537f2c",
// //   "f694f2e5681ba1078914e8cf48d99bfe"
// // );
// async function sendOtp(body, user) {
//   const to = `${user.country_code}${user.phone_number}`;
//   console.log(to, "data");
//   try {
//     const message = await client.messages.create({
//       body: body,
//       from: "+12513859835", // Replace with your Twilio number
//       to: to,
//     });

//     console.log("Message sent:", message.body);
//   } catch (error) {
//     console.error("Error sending OTP:", error);
//   }
// }

// export default sendOtp;
