var mongoose = require('mongoose')
const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  message: String,
  type: { type: String, enum: ["EVENT_REMINDER", "REGISTRATION_APPROVED", "REGISTRATION_REJECTED", "ATTENDANCE_CONFIRMATION", "SYSTEM"] },
  isRead: { type: Boolean, default: false },
  deliveryStatus: { type: String, enum: ["PENDING", "SENT", "FAILED"] },
  retryCount: { type: Number, default: 0 },
  sentAt: Date
}, { timestamps: true });

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
