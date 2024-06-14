const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const path = require('path');
const user = require("./Routes/User");
const login = require("./Routes/login")
const post = require("./Routes/post")
const freelancer = require("./Routes/freelancer")
const applicant = require("./Routes/applicant")
const employer = require("./Routes/employer")
const conversation = require("./Routes/conversations")
const message = require("./Routes/messages")
const PostHistory = require("./Routes/postHistory")


mongoose
  .connect(process.env.URL)
  .then(() => console.log("Success, MongoDB connected"))
  .catch((ex) => console.error(ex));

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


app.use("/user", user);
app.use("/login", login)
app.use("/post", post)
app.use("/freelancer", freelancer)
app.use("/applicant", applicant)
app.use("/employer", employer)
app.use("/conversations", conversation)
app.use("/messages", message)
app.use("/PostHistory", PostHistory)


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
