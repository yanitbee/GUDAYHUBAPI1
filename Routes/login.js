const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");


router.post("/", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      res.status(404).send({ error: "Invalid Email or Password" });
      return;
    }

    const password = await bcrypt.compare(req.body.password, user.Password);

    if (!password) {
      res.status(404).json({ error: "Invalid Email or Password1" });
      return;
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: {
        userData: {
          FullName: user.Fullname,
          UserName: user.username,
          Email: user.Email,
          userID: user._id,
          UserType:user.Usertype
        },
        token,
      },
    });
  } catch {
    res.status(500).json({ error: "Server error logingin" });
  }
});


module.exports = router;
