const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const Event = require("../models/events"); // import your User schema
const jwt = require("jsonwebtoken"); 

//Creating Event
router.post('/addEvent', async(req, res) =>{
  await Event.create(req.body)
  .then(()=>res.json({status:"Event Created"}))
  .catch((err)=>console.log(err))
});

//To Get All Events
router.get('/',async(req,res)=>{
  await Event.find({})
  .then((docs)=>res.json(docs))
  .catch((err)=>console.log(err))
})

// To GET Single event
router.get("/:id", async (req, res) => {
  await Event.findById(req.params.id)
  .then((docs)=>{
    res.json(docs)
  })
  . catch ((err)=> {
    console.log(err)
    res.status(500).json({ status: "Error fetching event" });
  })
});

//To Delete the Event
router.delete('/deleteEvent/:id',async(req,res)=>{
  await Event.findByIdAndDelete(req.params.id)
  .then(()=>res.json({"status":"event Deleted"}))
  .catch((err)=>console.log(err))
  })

//To Update the all the fields in the event  
router.patch('/updateAllEvent/:id',async(req,res)=>{
  await Event.findByIdAndUpdate(req.params.id,{$set:req.body},{ returnDocument: "after" })
  .then((docs)=>res.json({"status":"Event Details Updated"}))
  .catch((err)=>console.log(err))
})

//To cancel the status of the event by organizer (status : canceled)
router.patch('/cancelEvent/:pid',async(req,res)=>{
  await Event.findByIdAndUpdate(req.params.pid,{ status: "CANCELLED" },{ returnDocument: "after" })
  .then((docs)=>res.json({"status":"event details updated",docs}))
  .catch((err)=>console.log(err))
})

//To update published by organizer(publish:true)
router.patch('/publishEvent/:pid',async(req,res)=>{
  await Event.findByIdAndUpdate(req.params.pid,{ published: true, status: "ONGOING" },{ returnDocument: "after" })
  .then((docs)=>res.json({"status":"Event Published",docs}))
  .catch((err)=>console.log(err))
})

// Close Registration
router.patch("/closeRegistration/:id", async (req, res) => {
 await Event.findByIdAndUpdate(req.params.id, { status: "REGISTRATION_CLOSED" },{ returnDocument: "after" })
 .then((docs)=>{
    res.json({ status: "Registration closed",docs});
  })
  .catch((err)=> {
    console.error(err);
    res.status(500).json({ status: "Error closing registration" });
  })
});

// Mark Completed
router.patch("/complete/:id", async (req, res) => {
  await Event.findByIdAndUpdate(req.params.id, { status: "COMPLETED" },{ returnDocument: "after" })
  .then((docs)=>{
    res.json({ status: "Event completed", docs});
  })
  .catch((err)=>{
    console.error(err);
    res.status(500).json({ status: "Error completing event" });
  })
});

module.exports = router;