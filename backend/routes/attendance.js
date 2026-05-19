const express = require("express");
const router = express.Router();
const Attendance = require("../models/attendance");
const jwt = require("jsonwebtoken");
const Registration = require("../models/registrations");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const sharp = require("sharp");

require("dotenv").config();

// ================= MULTER =================
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});

// ================= CHECK-IN ROUTE =================
router.post("/", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image uploaded" });
        }

        const { eventId } = req.body;
        console.log(`Face Recognition Request. EventID: ${eventId || 'AUTO-DETECT'}`);

        let query = { status: 'APPROVED' };
        if (eventId && eventId !== 'AUTO_DETECT') {
            query.eventId = eventId;
        }

        // GET REGISTRATIONS (Populate event to check status if auto-detecting)
        const registrations = await Registration.find(query)
            .populate('userId', 'firstName lastName role')
            .populate('eventId');

        // If auto-detecting, filter by ONGOING events only
        let filteredRegs = registrations;
        if (!eventId || eventId === 'AUTO_DETECT') {
            filteredRegs = registrations.filter(r => r.eventId?.status === 'ONGOING');
        }

        if (!filteredRegs.length) {
            return res.status(404).json({
                success: false,
                message: eventId ? "No approved participants found for this event." : "No participants found for any currently ONGOING events.",
            });
        }

        // CONVERT LIVE IMAGE (Auto-rotate)
        const liveImageBuffer = await sharp(req.file.buffer)
            .rotate()
            .jpeg()
            .toBuffer();

        // LOOP THROUGH EVENT REGISTRATIONS
        for (const reg of filteredRegs) {
            try {
                if (!reg.image) continue;

                const registeredImageBuffer = await sharp(reg.image)
                    .rotate()
                    .jpeg()
                    .toBuffer();

                const formData = new FormData();
                formData.append("api_key", process.env.FACE_API_KEY);
                formData.append("api_secret", process.env.FACE_API_SECRET);

                formData.append("image_file1", registeredImageBuffer, {
                    filename: "registered.jpg",
                    contentType: "image/jpeg",
                });

                formData.append("image_file2", liveImageBuffer, {
                    filename: "live.jpg",
                    contentType: "image/jpeg",
                });

                const response = await axios.post(
                    "https://api-us.faceplusplus.com/facepp/v3/compare",
                    formData,
                    { headers: formData.getHeaders() }
                );

                console.log(`Comparing ${reg.userId?.firstName} for ${reg.eventId?.title}: Confidence ${response.data.confidence}`);

                // MATCH FOUND (Lowered to 50 for better usability)
                if (response.data.confidence > 50) {
                    const alreadyMarked = await Attendance.findOne({ registrationId: reg._id });

                    if (alreadyMarked) {
                        return res.json({
                            success: true,
                            attendanceMarked: false,
                            message: `Attendance already recorded for ${reg.userId?.firstName} at ${alreadyMarked.checkInTime.toLocaleTimeString()}`,
                            user: reg.userId,
                            eventTitle: reg.eventId?.title,
                            alreadyMarkedTime: alreadyMarked.checkInTime
                        });
                    }

                    const attendance = new Attendance({
                        eventId: reg.eventId?._id,
                        userId: reg.userId?._id,
                        registrationId: reg._id,
                        checkInTime: new Date(),
                        attendanceMethod: "FACE",
                    });

                    await attendance.save();
                    await Registration.findByIdAndUpdate(reg._id, { attendanceMarked: true });

                    const User = require("../models/users");
                    await User.findByIdAndUpdate(reg.userId?._id, { $inc: { participationCount: 1 } });

                    return res.json({
                        success: true,
                        attendanceMarked: true,
                        confidence: response.data.confidence,
                        user: reg.userId,
                        eventTitle: reg.eventId?.title,
                        message: `Attendance marked successfully for ${reg.userId?.firstName} in ${reg.eventId?.title}`,
                    });
                }

            } catch (compareError) {
                console.log("Comparison Error:", compareError.message);
                continue;
            }
        }

        return res.json({
            success: false,
            attendanceMarked: false,
            message: "Face not recognized. Please ensure you are looking at the camera clearly.",
        });

    } catch (err) {
        console.error("Main Error:", err.message);
        return res.status(500).json({ success: false, error: err.message });
    }
});

// GET /attendance/event/:eventId
router.get("/event/:eventId", async (req, res) => {
  await Attendance.find({ eventId: req.params.eventId })
    .populate("userId", "firstName lastName email role")
    .populate("registrationId")
    .then((records) =>
      res.json({
        status: "Success",
        count: records.length,
        attendance: records,
      }),
    )
    .catch((err) => {
      console.error(err);
      res.status(500).json({ status: "Error fetching attendance" });
    });
});

// GET /attendance/user/:userId
router.get("/user/:userId", async (req, res) => {
  await Attendance.find({ userId: req.params.userId })
    .populate("eventId")
    .then((records) =>
      res.json({
        status: "Success",
        count: records.length,
        attendance: records,
      }),
    )
    .catch((err) => {
      console.error(err);
      res.status(500).json({ status: "Error fetching user attendance" });
    });
});

// PATCH /attendance/checkout/:id
router.patch("/checkout/:id", async (req, res) => {
  await Attendance.findByIdAndUpdate(
    req.params.id,
    { checkOutTime: new Date() },
    { returnDocument: "after" },
  )
    .then((attendance) => {
      if (!attendance) {
        return res.status(404).json({ status: "Attendance record not found" });
      }
      res.json({ status: "Check-out successful", attendance });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ status: "Error during check-out" });
    });
});

// POST /attendance/manual
router.post("/manual", async (req, res) => {
  try {
    const { eventId, userId, registrationId, verifiedBy, notes } = req.body;
    const existing = await Attendance.findOne({ registrationId });
    if (existing) {
      return res.json({ success: true, message: "Already marked" });
    }
    const attendance = new Attendance({
      eventId,
      userId,
      registrationId,
      checkInTime: new Date(),
      attendanceMethod: "MANUAL",
      verifiedBy,
      notes
    });
    await attendance.save();
    await Registration.findByIdAndUpdate(registrationId, { attendanceMarked: true });
    const User = require("../models/users");
    await User.findByIdAndUpdate(userId, { $inc: { participationCount: 1 } });
    res.json({ success: true, message: "Attendance marked manually", attendance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
