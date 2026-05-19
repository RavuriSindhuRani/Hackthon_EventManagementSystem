var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Event = require('../models/events');
const Registration = require('../models/registrations');
const Attendance = require('../models/attendance');
const VolunteerHours = require('../models/volunteerHours');
const User = require('../models/users');

/* GET Admin Dashboard Stats */
router.get('/admin-stats', async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments({ status: { $ne: 'DRAFT' } });
    const totalRegistrations = await Registration.countDocuments();
    const attendanceMarked = await Attendance.countDocuments();
    
    // Calculate total approved volunteer hours
    const volunteerHoursResult = await VolunteerHours.aggregate([
      { $match: { status: 'APPROVED' } },
      { $group: { _id: null, total: { $sum: '$hoursContributed' } } }
    ]);
    const volunteerHours = volunteerHoursResult.length > 0 ? volunteerHoursResult[0].total : 0;

    // Calculate unique students impacted
    const studentsImpacted = await Registration.distinct('userId', { registrationType: 'STUDENT' });
    
    // Get recent events
    const recentEvents = await Event.find({ status: { $ne: 'DRAFT' } })
      .sort({ startDateTime: -1 })
      .limit(4);
    
    // Registration Overview (counts per status for students and volunteers)
    const statsAggregation = async (type) => {
      const stats = await Registration.aggregate([
        { $match: { registrationType: type } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);
      
      const result = { PENDING: 0, APPROVED: 0, REJECTED: 0, Total: 0 };
      stats.forEach(s => {
        if (result.hasOwnProperty(s._id)) {
          result[s._id] = s.count;
        }
        result.Total += s.count;
      });
      return result;
    };

    const studentOverview = await statsAggregation('STUDENT');
    const volunteerOverview = await statsAggregation('VOLUNTEER');

    // Recent Registrations
    const recentRegistrations = await Registration.find()
      .populate('userId', 'firstName lastName profileImage')
      .populate('eventId', 'title')
      .sort({ createdAt: -1 })
      .limit(5);

    // Category distribution
    const categoryStats = await Event.aggregate([
      { $match: { status: { $ne: 'DRAFT' } } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalEvents,
          totalRegistrations,
          attendanceMarked,
          volunteerHours,
          studentsImpacted: studentsImpacted.length,
          activeUsers: await User.countDocuments({ status: 'ACTIVE' })
        },
        categoryDistribution: categoryStats,
        recentEvents,
        registrationsOverview: {
          students: studentOverview,
          volunteers: volunteerOverview
        },
        recentRegistrations
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/* GET Volunteer Dashboard Stats */
router.get('/volunteer-stats/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Total and Pending Hours
    const hoursStats = await VolunteerHours.aggregate([
      { $match: { volunteerId: new mongoose.Types.ObjectId(userId) } },
      { $group: { 
          _id: null, 
          totalApproved: { $sum: { $cond: [{ $eq: ["$status", "APPROVED"] }, "$hoursContributed", 0] } },
          totalPending: { $sum: { $cond: [{ $eq: ["$status", "PENDING"] }, "$hoursContributed", 0] } }
        } 
      }
    ]);
    const totalHours = hoursStats.length > 0 ? hoursStats[0].totalApproved : 0;
    const pendingHours = hoursStats.length > 0 ? hoursStats[0].totalPending : 0;

    // Events Joined
    const eventsJoined = await Registration.countDocuments({ userId: userId });

    // Certificates (placeholder logic: count of approved registrations for events with certificates enabled)
    const certificates = await Registration.find({ userId: userId, status: 'APPROVED' })
      .populate({
        path: 'eventId',
        match: { certificateEnabled: true }
      });
    const certificatesCount = certificates.filter(c => c.eventId).length;

    // Upcoming Opportunities with spots left calculation
    const opportunities = await Event.find({ 
      status: { $in: ['PUBLISHED', 'ONGOING'] },
      startDateTime: { $gte: new Date() },
      volunteerRequiredCount: { $gt: 0 }
    }).limit(3).lean();

    const upcomingOpportunities = opportunities.map(event => ({
      ...event,
      spotsLeft: (event.volunteerRequiredCount || 0) - (event.volunteerAssignedCount || 0)
    }));

    // Recent Activity (Mixed timeline)
    const registrations = await Registration.find({ userId: userId })
      .populate('eventId', 'title')
      .sort({ createdAt: -1 })
      .limit(5).lean();

    const attendances = await Attendance.find({ userId: userId })
      .populate('eventId', 'title')
      .sort({ checkInTime: -1 })
      .limit(5).lean();

    const activity = [];
    registrations.forEach(r => {
      activity.push({
        ...r,
        type: 'REGISTRATION',
        action: 'Registered for',
        date: r.createdAt
      });
    });
    attendances.forEach(a => {
      activity.push({
        ...a,
        type: 'ATTENDANCE',
        action: 'Checked-in from',
        date: a.checkInTime
      });
    });

    activity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const recentActivity = activity.slice(0, 5);

    res.json({
      success: true,
      data: {
        stats: {
          totalHours,
          pendingHours,
          eventsJoined,
          certificatesEarned: certificatesCount
        },
        upcomingOpportunities,
        recentActivity: recentActivity
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/* GET Student Dashboard Stats */
router.get('/student-stats/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const registeredCount = await Registration.countDocuments({ userId: userObjectId });
    const attendedCount = await Attendance.countDocuments({ userId: userObjectId });
    const pendingCount = await Registration.countDocuments({ userId: userObjectId, status: 'APPROVED', attendanceMarked: false });
    const certificatesCount = attendedCount;

    const upcomingRegistrations = await Registration.find({ 
      userId: userObjectId, 
      status: 'APPROVED',
      attendanceMarked: false
    })
    .populate({
      path: 'eventId',
      match: { published: true }
    })
    .sort({ appliedAt: -1 });

    const upcomingEvents = upcomingRegistrations
      .map(r => r.eventId)
      .filter(e => e) // Filters out nulls from the 'match' above
      .slice(0, 3);

    const registrations = await Registration.find({ userId: userObjectId })
      .populate('eventId', 'title')
      .sort({ createdAt: -1 })
      .limit(5);

    const activities = registrations.map(r => ({
      type: 'REGISTRATION',
      title: r.status === 'APPROVED' ? `Approved for ${r.eventId?.title}` : `Applied for ${r.eventId?.title}`,
      date: r.updatedAt,
      status: r.status
    }));

    const attendances = await Attendance.find({ userId: userObjectId })
      .populate('eventId', 'title')
      .sort({ checkInTime: -1 })
      .limit(3);
    
    attendances.forEach(a => {
      activities.push({
        type: 'ATTENDANCE',
        title: `Attended ${a.eventId?.title}`,
        date: a.checkInTime,
        status: 'COMPLETED'
      });
    });

    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    res.json({
      success: true,
      data: {
        stats: {
          registeredEvents: registeredCount,
          attendedEvents: attendedCount,
          pendingEvents: pendingCount,
          certificatesEarned: certificatesCount
        },
        upcomingEvents,
        recentActivity: activities.slice(0, 5)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/* GET Detailed Event Report (All Events) */
router.get('/event-report', async (req, res) => {
  try {
    const events = await Event.find({ status: { $ne: 'DRAFT' } }).lean();
    
    const reportData = await Promise.all(events.map(async (event) => {
      const studentRegs = await Registration.countDocuments({ eventId: event._id, registrationType: 'STUDENT', status: 'APPROVED' });
      const studentAttended = await Attendance.countDocuments({ eventId: event._id });
      const volunteerRegs = await Registration.countDocuments({ eventId: event._id, registrationType: 'VOLUNTEER', status: 'APPROVED' });
      
      return {
        id: event._id,
        title: event.title,
        category: event.category,
        date: event.startDateTime,
        venue: event.venue,
        stats: {
          studentsApproved: studentRegs,
          studentsAttended: studentAttended,
          attendanceRate: studentRegs > 0 ? Math.round((studentAttended / studentRegs) * 100) : 0,
          volunteersRequired: event.volunteerRequiredCount || 0,
          volunteersAssigned: volunteerRegs,
          recruitmentRate: event.volunteerRequiredCount > 0 ? Math.round((volunteerRegs / event.volunteerRequiredCount) * 100) : 100
        }
      };
    }));

    res.json({
      success: true,
      report: reportData
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/* GET Top Volunteers Report */
router.get('/top-volunteers', async (req, res) => {
  try {
    const topVolunteers = await VolunteerHours.aggregate([
      { $match: { status: 'APPROVED' } },
      { $group: { 
          _id: '$volunteerId', 
          totalHours: { $sum: '$hoursContributed' },
          eventsCount: { $addToSet: '$eventId' } 
        } 
      },
      { $sort: { totalHours: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      { $unwind: '$userDetails' },
      {
        $project: {
          _id: 1,
          totalHours: 1,
          eventsCount: { $size: '$eventsCount' },
          name: { $concat: ['$userDetails.firstName', ' ', '$userDetails.lastName'] },
          email: '$userDetails.email'
        }
      }
    ]);

    res.json({ success: true, volunteers: topVolunteers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;