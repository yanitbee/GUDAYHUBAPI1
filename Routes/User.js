const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User } = require("../models/User");

router.post("/registerUser", async (req, res) => {
  try { 

    let aUser = await User.find({ username: req.body.username });
    if (aUser.length > 0) {
      return res.status(400).send("User already registered");
    }

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

    console.log(user);
    await user.save();

    res.status(201).json({ message: "data saved successfully" });
  } catch (error) {
    console.log("errorrrrrrr", error);
    res.status(500).send("server error while saving data erorrrrrrrr");
  }
});

module.exports = router;
