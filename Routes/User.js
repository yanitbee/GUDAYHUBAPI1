const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User } = require("../models/User");
const { Vcode } = require("../models/verifycod");
const { sendWelcomeEmail } = require('../utils/sendNotificationEmail');

router.post("/registerUser", async (req, res) => {
  try { 

    let aUser = await User.find({ username: req.body.username });
    if (aUser.length > 0) {
      return res.status(400).send("User already registered");
    }
    const code = req.body.code
    const user = new User({
      Usertype: req.body.Usertype,
      Fullname: req.body.Fullname,
      username: req.body.username,
      Phonenumber: req.body.Phonenumber,
      Email: req.body.Email,
      Password: await bcrypt.hash(req.body.Password, 10),
      Gender: req.body.Gender,
      profilepic: req.body.profilepic,
      title: req.body.title,
      freelancerprofile: req.body.freelancerprofile,
    });
    const vercode = await Vcode.findOne({email:user.Email });
  

    if (!vercode) {
      return res.status(404).send("User not found");
    }

    if (vercode.verificationCode !== code) {
      return res.status(400).send("Invalid code");
    }

    if (new Date() > vercode.codeExpiry) {
      return res.status(400).send("Code has expired");
    }

    Vcode.verificationCode = null;
    Vcode.codeExpiry = null;
    console.log(user);
    await user.save();

    res.status(201).json({ message: "data saved successfully" });
  } catch (error) {
    console.log("errorrrrrrr", error);
    res.status(500).send("server error while saving data erorrrrrrrr");
  }
});

function generateCode() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

router.post("/sendcode", async (req, res) => {
  try {
    const { email } = req.body;

    const code = generateCode();
    const expiryDate = new Date(Date.now() + 10 * 60 * 1000); // Code expires in 10 minutes

    // Save the code and expiry date to the user's record in the database
    await Vcode.updateOne(
      { email: email },
      { $set: { verificationCode: code, codeExpiry: expiryDate } },
      { upsert: true } // This will insert the document if it doesn't exist
    );

    console.log("email",email)
    // Send the code via email
    await sendWelcomeEmail(email, code);

    res.status(200).send("Code sent successfully");
  } catch (error) {
    console.log("errorrrrrrr", error);
    res.status(500).send("Server error while sending code");
  }
});
  

module.exports = router;
