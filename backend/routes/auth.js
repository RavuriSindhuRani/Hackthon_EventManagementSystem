const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken"); 
const User = require("../models/users");


// Registration route
router.post("/registration", async (req, res) => {
   await User.findOne({ email: req.body.email })
   .then(async(existingUser)=>{
    if (existingUser) {
      return res.json({ status: "User already exists" });
    }
    // Create new user according to schema
    const newUser = await User.create({
      organizationId: req.body.organizationId, // ObjectId of Organization
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10),
      role: req.body.role, // must be one of STUDENT, VOLUNTEER, ORGANIZER, ADMIN
      phone: req.body.phone,
      profileImage: req.body.profileImage,
      bio: req.body.bio,
      skills: req.body.skills, // array of strings
      interests: req.body.interests, // array of strings
      availability: req.body.availability, // { weekends: true/false, weekdays: true/false }
      totalVolunteerHours: req.body.totalVolunteerHours || 0,
      participationCount: req.body.participationCount || 0,
      isEmailVerified: false,
      lastLoginAt: null,
      accountStatus: "ACTIVE"
    });
    res.json({ status: "Registration successful", userId: newUser._id });
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "akuladilipkumar99@gmail.com",
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      to: req.body.email,
      from: "akuladilipkumar85@gmail.com",
      subject: "Thanks for Registering",
      text: `Hey ${req.body.firstName}, your registration was successful!`
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) console.error("Email error:", err);
      else console.log("Email sent.");
    });

  })
  .catch((err)=> {
    console.error(err);
    res.status(500).json({ status: "Error during registration" });
  })
});


//Login
router.post('/login', async(req, res)=> {
  await User.findOne({email:req.body.email})
  .then(async(data)=>{
    if(data){
      if(await bcrypt.compare(req.body.password,data.password)){
        const token = await jwt.sign({userId:data._id},process.env.JWT_SECRET,{expiresIn:'2h'});
        res.json({status:"Login Successfull",token:token,userId:data._id,role:data.role});
      }else{
        res.json({status:"Password Incorrect"});
      }
    }else{
      res.json({status:"User Not Found"});
    }
  })
  .catch((err)=>console.log(err));
});


// Get All Students
router.get("/students", async (req, res) => {
  try {
    const students = await User.find({ role: 'STUDENT' }).select('-password');
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Volunteers
router.get("/volunteers", async (req, res) => {
  try {
    const volunteers = await User.find({ role: 'VOLUNTEER' }).select('-password');
    res.json(volunteers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get User Profile
router.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update User Profile
router.patch("/profile/:id", async (req, res) => {
  try {
    const { firstName, lastName, phone, bio } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, phone, bio },
      { new: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    res.json({ success: true, user: updatedUser });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;