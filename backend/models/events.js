var mongoose = require('mongoose')
const eventSchema = new mongoose.Schema({
  // organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  description: String,
  category: { type: String, enum: ["WORKSHOP", "MOCK_INTERVIEW", "HACKATHON", "MENTORING", "SEMINAR", "BOOTCAMP", "NETWORKING", "COMPETITION", "COMMUNITY", "SOCIAL", "CULTURAL", "SPORTS", "TECHNICAL"] },
  mode: { type: String, enum: ["ONLINE", "OFFLINE", "HYBRID"] },
  venue: String,
  meetingLink: String,
  requiredSkills: [String],
  eventBanner: String,
  startDateTime: Date,
  endDateTime: Date,
  durationInHours: Number,
  capacity: Number,
  registeredCount: { type: Number, default: 0 },
  waitlistCount: { type: Number, default: 0 },
  volunteerRequiredCount: Number,
  volunteerAssignedCount: { type: Number, default: 0 },
  status: { type: String, enum: ["DRAFT", "REGISTRATION_CLOSED", "ONGOING", "COMPLETED", "CANCELLED"], default: "DRAFT" },
  published:{type:Boolean,default:false},
  tags: [String],
  qrCodeValue: String,
  attendanceEnabled: { type: Boolean, default: true },
  certificateEnabled: { type: Boolean, default: false },
  analyticsSnapshot: {
    totalAttendance: Number,
    volunteerHours: Number
  }
}, { timestamps: true });

eventSchema.index({ organizationId: 1, startDateTime: 1, status: 1 });
eventSchema.index({ status: 1 });

module.exports = mongoose.model('Event', eventSchema);
