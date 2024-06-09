const express = require("express");
const router = express.Router();
const {applicant} = require("../models/applicant");


//to search if an applicant have already applied

router.get("/searchapplied", async (req, res) => {
    try {
      const freelancerid = req.query.freelancerid;
      const postid = req.query.postid;
      const applied = await applicant.find({Freelancerid:freelancerid, postid:postid});
      if (Array.isArray(applied) && applied.length === 0) {
        return res.json({ message: "have not applied" });
      } else {
        return res.json({ message: "have applied" });
      }
     
      
    } catch (error) {
      console.error("Error reading post:", error);
      res.status(500).json({ message: "Server error while reading freelancer" });
    }
  });

  
  //to write applicant

  router.post("/writeapplicant", async (req, res)=>{
    try{
        const { Freelancerid, postid, Coverletter,status} = req.body;
        const newPost = new applicant({  Freelancerid, postid, Coverletter,status})
        await newPost.save();
        res.json({message: "applicant saved successfully"})

    }catch (error){
        console.log("errorrrrrrr", error.message)
        res.status(500).send("server error while saving applicant erorrrrrrrr")

    }
})

//search applied for taskmanager

router.get("/searchappliedposts", async (req, res)=>{
    try{
      const freelancerid =req.query.freelancerid;
  console.log(freelancerid)
      await applicant.find({ Freelancerid:freelancerid })
      
    .then(applicant => res.json(applicant))
    
    }catch (error){
        console.log("errorr", error.message)
        res.status(500).send("server error while searching applied post")
  
    }
  })

  //shows applicant to employer
  router.get("/readjobapplicant", async (req, res)=>{
    try{
      const postid = req.query.postid;
       await applicant.find({postid:postid})
  
      .then(applicant => res.json(applicant))
  
    
    }catch (error){
        console.log("errorr", error.message)
        res.status(500).send("server error while reading applicant")
        
    }
  })

  
  
    module.exports = router;
