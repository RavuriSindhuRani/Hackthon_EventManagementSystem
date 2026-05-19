var mongoose = require('mongoose')
const auditLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: String,
  entityType: String,
  entityId: { type: mongoose.Schema.Types.ObjectId },
  oldValue: Object,
  newValue: Object,
  ipAddress: String
}, { timestamps: { createdAt: true, updatedAt: false } });

module.exports = mongoose.model('AuditLog', auditLogSchema);
