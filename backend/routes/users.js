const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const User = require("../models/users"); // import your User schema
const jwt = require("jsonwebtoken"); 

//to get number student
router.get('/students',async(req,res)=>{
  await User.find({role:"STUDENT"})
  .then((docs)=>res.json({status: "success",
      count: docs.length,
      students: docs}))
  .catch((err)=>console.log(err))
})

// To get Number of VOLUNTEER
router.get('/volunteer',async(req,res)=>{
  await User.find({role:"VOLUNTEER"})
  .then((docs)=>res.json({status: "success",
      count: docs.length,
      students: docs}))
  .catch((err)=>console.log(err))
})

//To get all Users
router.get('/all',async(req,res)=>{
  await User.find({})
  .then((docs)=>res.json({status: "success",
      count: docs.length,
      students: docs}))
  .catch((err)=>console.log(err))
})

// Get Profile for currently logged in user
router.get('/profile', async(req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ status: "error", message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Profile Error:", err);
    res.status(401).json({ status: "error", message: "Unauthorized or Invalid Token" });
  }
});

module.exports = router;
