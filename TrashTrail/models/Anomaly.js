import mongoose from 'mongoose';

const AnomalySchema = new mongoose.Schema(
  {
    wasteBagId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WasteBag',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['weight_mismatch', 'route_deviation', 'missed_pickup', 'delayed_processing'],
      required: true,
    },
    description: {
      type: String,
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      index: true,
    },
    collectorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    status: {
      type: String,
      enum: ['detected', 'investigating', 'resolved'],
      default: 'detected',
      index: true,
    },
    detectedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true, // will handle createdAt auto assignment
  }
);

export default mongoose.models.Anomaly || mongoose.model('Anomaly', AnomalySchema);
