import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ['citizen', 'collector', 'admin'],
      default: 'citizen',
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    ward: {
      type: String,
      index: true,
    },
    greenScore: {
      type: Number,
      default: 0,
    },
    totalWasteRecycled: {
      type: Number,
      default: 0, // In kg
    },
    carbonSaved: {
      type: Number,
      default: 0, // In kg CO2
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
