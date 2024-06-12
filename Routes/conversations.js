const express = require("express");
const router = express.Router();
const {Conversation} = require("../models/Conversation");


//new conversation

router.post("/", async (req,res)=>{
    const newConversation = new Conversation({
        member:[req.body.senderId, req.body.receiverId],
    })

    try{
      const savedConversation = await newConversation.save();
      res.status(200).json(savedConversation) 
    }catch(err){
        res.status(500).json(err)
    }
})

//get conversation

router.get("/:userId", async (req,res)=>{
    try{
        const conversation = await Conversation.find({
            member: { $in:[req.params.userId]}
        });
        res.status(200).json(conversation)
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports = router;
