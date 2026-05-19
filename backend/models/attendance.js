var mongoose = require('mongoose')
const attendanceSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  registrationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Registration' },
  checkInTime: Date,
  checkOutTime: Date,
  attendanceMethod: { type: String, enum: ["QR", "MANUAL","FACE"] },
  qrValidationStatus: { type: String, enum: ["VALID", "INVALID", "EXPIRED"] },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: String
}, { timestamps: true });

attendanceSchema.index({ eventId: 1, checkInTime: 1 });
attendanceSchema.index({ userId: 1, eventId: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
