var mongoose = require('mongoose')

const registrationSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  registrationType: { type: String, enum: ["STUDENT", "VOLUNTEER"] },
  status: { type: String, enum: ["PENDING", "APPROVED", "WAITLISTED", "REJECTED", "CANCELLED"], default: "PENDING" },
  appliedAt: Date,
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  approvalNote: {type:String, defalut:"Approval Pending"},
  cancellationReason: String,
  attendanceMarked: { type: Boolean, default: false },
  image:{type:Buffer,required:true}
}, { timestamps: true });

registrationSchema.index({ eventId: 1, status: 1 });
registrationSchema.index({ userId: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
