var mongoose = require('mongoose');

var userSchema = new mongoose.Schema(
  {
    // organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' }, // Multi-tenant isolation
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["STUDENT", "VOLUNTEER", "ORGANIZER", "ADMIN"], required: true },
    phone: { type: String },
    profileImage: { type: String },
    bio: { type: String },
    skills: [{ type: String }],
    interests: [{ type: String }],
    availability: {
      weekends: { type: Boolean, default: false },
      weekdays: { type: Boolean, default: false }
    },
    totalVolunteerHours: { type: Number, default: 0 },
    participationCount: { type: Number, default: 0 },
    isEmailVerified: { type: Boolean, default: false },
    lastLoginAt: { type: Date },
    accountStatus: { type: String, enum: ["ACTIVE", "SUSPENDED", "PENDING"], default: "ACTIVE" }
  },
  { timestamps: true } // automatically adds createdAt and updatedAt
);

module.exports = mongoose.model('User', userSchema);
