const express = require("express");
const router = express.Router();
const VolunteerHours = require("../models/volunteerHours");
const User = require("../models/users");

// Get All Pending Volunteer Hours
router.get("/pending", async (req, res) => {
  try {
    const pending = await VolunteerHours.find({ status: 'PENDING' })
      .populate('volunteerId', 'firstName lastName email profileImage')
      .populate('eventId', 'title');
    res.json(pending);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve Volunteer Hours
router.patch("/approve/:id", async (req, res) => {
  try {
    const hours = await VolunteerHours.findByIdAndUpdate(
      req.params.id,
      { status: 'APPROVED', approvedAt: new Date() },
      { new: true }
    );
    
    // Update user's total hours (Bonus feature: aggregation could be better but let's keep it simple)
    await User.findByIdAndUpdate(hours.volunteerId, {
      $inc: { totalVolunteerHours: hours.hoursContributed }
    });

    res.json({ success: true, hours });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reject Volunteer Hours
router.patch("/reject/:id", async (req, res) => {
  try {
    const hours = await VolunteerHours.findByIdAndUpdate(
      req.params.id,
      { status: 'REJECTED' },
      { new: true }
    );
    res.json({ success: true, hours });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Volunteer Hours for a Specific User
router.get("/user/:userId", async (req, res) => {
  try {
    const hours = await VolunteerHours.find({ volunteerId: req.params.userId })
      .populate('eventId', 'title startDateTime')
      .sort({ createdAt: -1 });
    res.json(hours);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit/Log Volunteer Hours
router.post("/", async (req, res) => {
  try {
    const { volunteerId, eventId, hoursContributed, description } = req.body;
    
    const newHours = new VolunteerHours({
      volunteerId,
      eventId,
      hoursContributed,
      description,
      status: 'PENDING'
    });

    const saved = await newHours.save();
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
