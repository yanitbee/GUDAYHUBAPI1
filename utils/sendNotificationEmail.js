const nodemailer = require('nodemailer');
const{google} = require('googleapis')
const OAuth2 = google.auth.OAuth2
require("dotenv").config();


async function sendNotificationEmail(freelancer, job) {
 
   
const OAuth2_client = new OAuth2(process.env.clientId ,process.env.clientSecret)
OAuth2_client.setCredentials({refresh_token: process.env.refreshToken})


const accessToken = OAuth2_client.getAccessToken()

// Configure nodemailer with email 
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAUTH2',
    user: process.env.user,
    clientId: process.env.clientId ,
    clientSecret: process.env.clientSecret,
    refreshToken:process.env.refreshToken,
    accessToken: accessToken
  }
});
 
  const mailOptions = {
    from: process.env.user,
    to: freelancer.Email,
    subject: `New Job Matching Your Profile: ${job.Jobtitle}`,
    text: `Hello ${freelancer.Fullname},\n\nA new job titled "${job.Jobtitle}" that matches your skills has been posted. Check it out!`,
    html: `<p>Hello ${freelancer.Fullname},</p><p>A new job titled "<strong>${job.Jobtitle}</strong>" that matches your skills has been posted. Check it out!</p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${freelancer.Email}`);
  } catch (error) {
    console.error(`Error sending email to ${freelancer.Email}:`, error);
  }
}

module.exports = {
    sendNotificationEmail
  };
 