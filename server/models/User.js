const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, default: '' },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['customer', 'owner', 'admin'],
      default: 'customer',
    },
    profileImage: { type: String, default: '' },
    status: { type: String, enum: ['active', 'blocked'], default: 'active' },
    company: { type: String, default: '' },
    address: { type: String, default: '' },
    businessType: { type: String, default: '' },
    bio: { type: String, default: '' },
    accountVerified: { type: Boolean, default: false },
    faceHash: { type: String, default: '' },
    faceImage: { type: String, default: '' },
    faceEnabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', userSchema);
