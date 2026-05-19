const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const Registration = require("../models/registrations"); 
const jwt = require("jsonwebtoken");

const multer = require("multer");
const sharp = require("sharp");

// ================= MULTER =================
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});

// ================= REGISTRATION =================
router.post(
    "/",
    upload.single("image"),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "Image is required",
                });
            }

            const imageBuffer = await sharp(req.file.buffer)
                .jpeg()
                .toBuffer();

            // CHECK FOR EXISTING REGISTRATION
            const existing = await Registration.findOne({ 
                userId: req.body.userId, 
                eventId: req.body.eventId 
            });

            if (existing) {
                return res.status(400).json({
                    success: false,
                    message: "You are already registered for this event",
                });
            }

            const registration = new Registration({
                eventId: req.body.eventId,
                userId: req.body.userId,
                registrationType: req.body.registrationType,
                appliedAt: new Date(),
                image: imageBuffer,
            });

            const savedData = await registration.save();

            return res.status(201).json({
                success: true,
                message: "Registration Successful",
                data: savedData,
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                error: err.message,
            });
        }
    }
);

//To get all registrations for admin dashboard
router.get('/all', async(req, res)=>{
  await Registration.find({})
  .populate('userId', 'firstName lastName profileImage')
  .populate('eventId', 'title')
  .sort({appliedAt: -1})
  .then((docs)=>res.json({status:"success", count:docs.length, registrations:docs}))
  .catch((err)=>console.log(err));
})

//list of Student Registraion for specific event
router.get('/studentsRegistered/:eventId',async(req,res)=>{
  await Registration.find({eventId: req.params.eventId,registrationType:"STUDENT"})
  .populate('userId', 'firstName lastName profileImage')
  .then((docs)=>res.json({status:"Registered",count:docs.length,students:docs}))
  .catch((err)=>console.log(err));
})

//list of VOLUNTEER Registered for specific event
router.get('/volunteerRegistered/:eventId',async(req,res)=>{
  await Registration.find({eventId: req.params.eventId,registrationType:"VOLUNTEER"})
  .populate('userId', 'firstName lastName profileImage')
  .then((docs)=>res.json({status:"Registered",count:docs.length,volunteer:docs}))
  .catch((err)=>console.log(err));
})

// Get all registrations for a specific event
router.get('/event/:eventId', async (req, res) => {
  try {
    const registrations = await Registration.find({ eventId: req.params.eventId })
      .populate('userId', 'firstName lastName email profileImage role')
      .populate('eventId', 'title')
      .sort({ appliedAt: -1 });
    res.json({ success: true, registrations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get registrations for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const registrations = await Registration.find({ userId: req.params.userId })
      .populate('eventId')
      .sort({ appliedAt: -1 });
    res.json({ success: true, registrations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

//Approving the Registered Users by Organizer
router.patch('/approve/:pid',async(req,res)=>{
  await Registration.findByIdAndUpdate(req.params.pid,{ status:"APPROVED", approvedBy:"6a0081bdbe81d777f3852b9e",approvalNote:"Approved by organizer"},{ returnDocument: "after" })
  .then((docs)=>res.json({"status":"Approved",docs}))
  .catch((err)=>console.log(err))
})

//Rejected the Registered users by Organizer
router.patch('/reject/:pid',async(req,res)=>{
  await Registration.findByIdAndUpdate(req.params.pid,{ status:"REJECTED",approvalNote:"REJECTED by organizer",approvedBy:null},{ returnDocument: "after" })
  .then((docs)=>res.json({"status":"Approved",docs}))
  .catch((err)=>console.log(err))
})

//Canceled by the user himself
router.patch('/cancel/:pid',async(req,res)=>{
  await Registration.findByIdAndUpdate(req.params.pid,{ status:"CANCELLED"},{ returnDocument: "after" })
  .then((docs)=>res.json({"status":"Cancelled",docs}))
  .catch((err)=>console.log(err))
})

// Get stats for a specific event
router.get('/event-stats/:eventId', async (req, res) => {
  try {
    const stats = await Registration.aggregate([
      { $match: { eventId: new (require('mongoose')).Types.ObjectId(req.params.eventId) } },
      { $group: {
          _id: "$registrationType",
          total: { $sum: 1 },
          approved: { $sum: { $cond: [{ $eq: ["$status", "APPROVED"] }, 1, 0] } },
          rejected: { $sum: { $cond: [{ $eq: ["$status", "REJECTED"] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ["$status", "PENDING"] }, 1, 0] } }
        }
      }
    ]);
    res.json({ success: true, stats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Bulk Approve Pending Users for an Event
router.patch('/bulk-approve/:eventId/:type', async (req, res) => {
  try {
    const { eventId, type } = req.params;
    const result = await Registration.updateMany(
      { eventId, registrationType: type, status: 'PENDING' },
      { $set: { status: 'APPROVED', approvedBy: "6a0081bdbe81d777f3852b9e", approvalNote: "Bulk approved by admin" } }
    );
    res.json({ success: true, message: `Approved ${result.modifiedCount} registrations` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;