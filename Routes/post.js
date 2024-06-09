const express = require("express");
const router = express.Router();
const { Post } = require("../models/post");
const { findMatchingFreelancers } = require('../utils/findMatchingFreelancers');
const { sendNotificationEmail } = require('../utils/sendNotificationEmail');

router.get("/readpost", async (req, res) => {
  try {
    const search = req.query.search;
    const searchtitle = req.query.serachtitle;

    await Post.find({
      Jobtype: { $regex: search, $options: "i" },
      Jobtitle: { $regex: searchtitle, $options: "i" },
    })
    .then((Post) => res.json(Post));
  } catch (error) {
    console.log("errorr", error.message);
    res.status(500).send("server error while reading post");
  }
});

//to write post
router.post("/writepost", async (req, res) => {
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
        urgency: urgency === 'true', // Ensure this is a boolean
        employerid
      });
      await newPost.save();
      res.json({ message: "Post saved successfully" });

      const matchedFreelancers = await findMatchingFreelancers(newPost);

      if(matchedFreelancers){
      matchedFreelancers.forEach(freelancer => {
        sendNotificationEmail(freelancer, newPost);
      });
    }
  
    } catch (error) {
      console.log("error posting job", error.message);
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


module.exports = router;

