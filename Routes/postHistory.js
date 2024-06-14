const express = require('express');
const router = express.Router();
const { Post } = require("../models/post");
const {PostHistory} = require('../models/postHistory'); 

router.post('/closepost', async (req, res) => {
  try {
    const { postId } = req.body;

    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send('Post not found');
    }

    // Move the post to PostHistory
    const postHistory = new PostHistory(post.toObject());
    await postHistory.save();

    // Remove the post from Post collection
    await Post.findByIdAndDelete(postId);

    res.status(200).send('Post closed successfully');
  } catch (error) {
    console.error('Error closing post:', error);
    res.status(500).send('Server error while closing post');
  }
});



  router.get("/reademployerpost", async (req, res)=>{
    try{
      const employerid =req.query.employerid;
    
      await PostHistory.find({employerid: employerid} )
      
    .then(Post => res.json(Post))
    }catch (error){
        console.log("errorr", error.message)
        res.status(500).send("server error while reading post")
  
    }
  })


  

module.exports = router;
