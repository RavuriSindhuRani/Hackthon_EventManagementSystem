const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["NGO", "COMPANY"], required: true },
  description: { type: String },
  logoUrl: { type: String },
  contactEmail: { type: String },
  contactPhone: { type: String },
  address: {
    city: String,
    state: String,
    country: String
  },
  status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
  createdBy: String,
  // { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

organizationSchema.index({ status: 1 });
organizationSchema.index({ type: 1 });

module.exports = mongoose.model('Organization', organizationSchema);
