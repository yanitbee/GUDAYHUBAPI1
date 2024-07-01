const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path');
const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const middleware = require('i18next-http-middleware');
require("dotenv").config();

const skillTestRoutes = require("./Routes/skillTests");
const userRoutes = require("./Routes/User");
const loginRoutes = require("./Routes/login");
const postRoutes = require("./Routes/post");
const freelancerRoutes = require("./Routes/freelancer");
const applicantRoutes = require("./Routes/applicant");
const employerRoutes = require("./Routes/employer");
const conversationRoutes = require("./Routes/conversations");
const messageRoutes = require("./Routes/messages");
const PostHistoryRoutes = require("./Routes/postHistory");
const hiredRoutes = require("./Routes/hired");
const languageRoutes = require("./Routes/language");
const ComplaintRoutes = require("./Routes/Complaint");
const OfferRoutes = require("./Routes/offer");

const app = express();
const PORT = process.env.PORT || 4000;

// MongoDB connection
mongoose.connect(process.env.URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Success, MongoDB connected"))
.catch((error) => console.error("Error connecting to MongoDB:", error));

// CORS middleware
app.use(cors());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// i18next initialization
i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    backend: {
      loadPath: path.join(__dirname, 'locales/{{lng}}/translation.json')
    }
  });

app.use(middleware.handle(i18next));

// Routes
app.use('/skillTests', skillTestRoutes);
app.use("/user", userRoutes);
app.use("/login", loginRoutes);
app.use("/post", postRoutes);
app.use("/freelancer", freelancerRoutes);
app.use("/applicant", applicantRoutes);
app.use("/employer", employerRoutes);
app.use("/conversations", conversationRoutes);
app.use("/messages", messageRoutes);
app.use("/PostHistory", PostHistoryRoutes);
app.use("/hired", hiredRoutes);
app.use("/language", languageRoutes);
app.use("/Complaint", ComplaintRoutes);
app.use("/Offer", OfferRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
