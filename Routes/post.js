const express = require("express");
const router = express.Router();
const { Post } = require("../models/post");
const { User } = require("../models/User");
const { findMatchingFreelancers } = require('../utils/findMatchingFreelancers');
const { sendNotificationEmail } = require('../utils/sendNotificationEmail');
const { body, validationResult } = require('express-validator');

router.get("/readpost", async (req, res) => {
  try {
    const search = req.query.search;
    const searchtitle = req.query.serachtitle;
     const filter =req.query.filter

    await Post.find({
      Jobtype: { $regex: search, $options: "i" },
      Jobtitle: { $regex: searchtitle, $options: "i" },
      JobTask: { $regex: filter, $options: "i" },
    })
    .then((Post) => res.json(Post));
  } catch (error) {
    console.log("errorr", error.message);
    res.status(500).send("server error while reading post");
  }
});



// to write post
router.post("/writepost", [
  body('JobTask').notEmpty().withMessage('JobTask is required'),
  body('Jobtype').notEmpty().withMessage('Jobtype is required'),
  body('Jobtitle').notEmpty().withMessage('Jobtitle is required'),
  body('Description').notEmpty().withMessage('Description is required'),
  body('Qualification').optional().isString().withMessage('Qualification must be a string'),
  body('PostedDate').optional().isISO8601().withMessage('PostedDate must be a valid date'),
  body('Deadline').optional().isISO8601().withMessage('Deadline must be a valid date'),
  body('Salary').optional().isNumeric().withMessage('Salary must be a number'),
  body('Contact').optional().isString().withMessage('Contact must be a string'),
  body('location').optional().isString().withMessage('Location must be a string'),
  body('urgency').notEmpty().isBoolean().withMessage('Urgency must be true or false'),
  body('employerid').notEmpty().isMongoId().withMessage('Employer ID must be a valid Mongo ID'),
  body('anonymous').optional().isBoolean().withMessage('Anonymous must be true or false'),
  body('cv').optional().isBoolean().withMessage('CV must be true or false'),
  body('coverletter').optional().isBoolean().withMessage('Cover Letter must be true or false')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      JobTask,
      Jobtype,
      Jobtitle,
      Description,
      Qualification,
      PostedDate,
      Deadline,
      Salary,
      Contact,
      location,
      urgency,
      employerid,
      anonymous,
      cv,
      coverletter
    } = req.body;

    const newPost = new Post({
      JobTask,
      Jobtype,
      Jobtitle,
      Description,
      Qualification,
      PostedDate,
      Deadline,
      Salary,
      Contact,
      location,
      urgency: urgency === 'true',
      employerid,
      anonymous,
      cv,
      coverletter
    });

    await newPost.save();

    const userFilter = { _id: employerid };
    const userUpdate = { $inc: { 'freelancerprofile.gudayhistory.jobs': 1 } };
    const user = await User.findOneAndUpdate(userFilter, userUpdate, { new: true });

    if (!user) {
      return res.status(404).json({ message: "Freelancer not found" });
    }

    res.json({ message: "Post saved successfully" });

    const matchedFreelancers = await findMatchingFreelancers(newPost);

    if (matchedFreelancers) {
      matchedFreelancers.forEach(freelancer => {
        sendNotificationEmail(freelancer, newPost);
      });
    }
    
  } catch (error) {
    console.log("Error posting job:", error.message);
    res.status(500).send("Server error while saving post");
  }
});

  

  router.get("/searchpost/:id", async (req, res) => {
    try {
      const postId = req.params.id;
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error reading post:", error);
      res.status(500).json({ message: "Server error while reading post" });
    }
  });

  //read employers for intervew
  router.get("/searchemployer/:id", async (req, res) => {
    try {
  
      const postId = req.params.id;
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      const employer = await User.findById(post.employerid);
      if (!employer) {
        return res.status(404).json({ message: "Employer not found" });
      }

  
      res.json({ post, employer });
    } catch (error) {
      console.error("Error reading user for intervew:", error);
      res.status(500).json({ message: "Server error while reading user for intervew" });
    }
  });

    //job employer has posted
    router.get("/reademployerpost", async (req, res)=>{
      try{
        const employerid =req.query.employerid;
      
        await Post.find({employerid: employerid} )
        
      .then(Post => res.json(Post))
      }catch (error){
          console.log("errorr", error.message)
          res.status(500).send("server error while reading post")
    
      }
    })


    // delete post
router.delete('/deletepost/:id', async (req, res) => {
  try {
      const postId = req.params.id;
     const post = await Post.findOneAndDelete({ _id: postId });
      
   console.log(postId)
      if (!post) {
          return res.status(404).json({ error: 'Post not found' });
      }

      return res.json({ message: 'Post deleted successfully' });
  } catch (error) {
      console.error('Error deleting post:', error.message);
      return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

