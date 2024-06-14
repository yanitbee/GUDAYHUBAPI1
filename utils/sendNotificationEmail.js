const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
require("dotenv").config();

const OAuth2_client = new OAuth2(process.env.clientId, process.env.clientSecret);
OAuth2_client.setCredentials({ refresh_token: process.env.refreshToken });

async function sendEmail(to, subject, text, html) {
  const accessToken = await OAuth2_client.getAccessToken();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAUTH2',
      user: process.env.user,
      clientId: process.env.clientId,
      clientSecret: process.env.clientSecret,
      refreshToken: process.env.refreshToken,
      accessToken: accessToken.token
    }
  });

  const mailOptions = {
    from: process.env.user,
    to: to,
    subject: subject,
    text: text,
    html: html
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
  }
}

async function sendNotificationEmail(freelancer, job) {
  const subject = `New Job Matching Your Profile: ${job.Jobtitle}`;
  const text = `Hello ${freelancer.Fullname},\n\nA new job titled "${job.Jobtitle}" that matches your skills has been posted. Check it out!`;
  const html = `<p>Hello ${freelancer.Fullname},</p><p>A new job titled "<strong>${job.Jobtitle}</strong>" that matches your skills has been posted. Check it out!</p>`;

  await sendEmail(freelancer.Email, subject, text, html);
}

async function sendWelcomeEmail(email,code) {
  const subject = 'Your Verification Code';
  const text = `Hello,\n\nWelcome to our GudayHub. To finish registration, please enter this verification  code: ${code} .This code will expire in 10 minutes. \n\n
  If you did not make this request, please ignore this email.`;
  const html = `<p>Hello ,</p><p>Welcome to our GudayHub. To finish registration, please enter this verification  code: ${code}. This code will expire in 10 minutes.</p>
  ,</p><p> If you did not make this request, please ignore this email.</p>`;

  await sendEmail(email, subject, text, html);
}

async function sendInterviewDateEmail(freelancer,job,applicant) {
  const subject = 'You have got an interview date';
  const text = `Hello ${freelancer.Fullname},\n\n An interview date has been scheduled for &#34;${job.Jobtitle}&#34 job; on ${applicant.interivewDate+" "+applicant.interivewTime}  \n\n 
  Good luck. \n\n `;
  const html = `<p>Hello ${freelancer.Fullname}</p><p>An interview date has been scheduled for &#34;${job.Jobtitle}&#34; on ${applicant.interivewDate+" "+applicant.interivewTime} </p>
  ,</p><p>  Good luck.</p>`;

  await sendEmail(freelancer.Email, subject, text, html);
}


module.exports = {
  sendNotificationEmail,
  sendWelcomeEmail,
  sendInterviewDateEmail
};
