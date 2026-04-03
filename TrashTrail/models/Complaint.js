import mongoose from 'mongoose';

const ComplaintSchema = new mongoose.Schema(
  {
    citizenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['missed_pickup', 'improper_handling', 'overflow', 'other'],
      required: true,
    },
    description: {
      type: String,
    },
    photoUrl: {
      type: String,
    },
    location: {
      lat: Number,
      lng: Number,
    },
    ward: {
      type: String,
      index: true,
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved'],
      default: 'open',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Complaint || mongoose.model('Complaint', ComplaintSchema);
