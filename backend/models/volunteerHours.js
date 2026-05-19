var mongoose = require('mongoose')
const volunteerHoursSchema = new mongoose.Schema({
  volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  hoursContributed: Number,
  activityType: { type: String, enum: ["MENTORING", "TEACHING", "INTERVIEW_PANEL", "WORKSHOP_SUPPORT", "EVENT_COORDINATION"] },
  contributionDescription: String,
  status: { type: String, enum: ["PENDING", "APPROVED", "REJECTED"], default: "PENDING" },
  approvedAt: Date
}, { timestamps: true });

volunteerHoursSchema.index({ volunteerId: 1, status: 1 });
volunteerHoursSchema.index({ eventId: 1 });

module.exports = mongoose.model('VolunteerHours', volunteerHoursSchema);
