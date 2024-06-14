const express = require("express");
const router = express.Router();
const {Hired} = require("../models/hired");
const {applicant} = require("../models/applicant");
const { ObjectId } = require('mongoose').Types;


router.get("/searchhiredposts", async (req, res)=>{
    try{
      const freelancerid =req.query.freelancerid;
      await Hired.find({ Freelancerid:freelancerid })
      
    .then(applicant => res.json(applicant))
    
    }catch (error){
        console.log("errorr", error.message)
        res.status(500).send("server error while searching applied post")
  
    }
  })

  router.post('/addhired', async (req, res) => {
    try {
        const { appId } = req.body;

        // Find the applicant by ID
        const Applicant = await applicant.findById(appId);
        if (!Applicant) {
            return res.status(404).send('Applicant not found');
        }

        const hiredApplicant = new Hired(Applicant.toObject());

        await hiredApplicant.save();

        await applicant.findByIdAndDelete(appId);

        res.status(200).send('Applicant moved to hired successfully');
    } catch (error) {
        console.error('Error adding hired:', error);
        res.status(500).send('Server error while moving applicant to hired');
    }
});



  
module.exports = router;
  