import mongoose from 'mongoose';

const WasteBagSchema = new mongoose.Schema(
  {
    qrCode: {
      type: String,
      required: [true, 'Please provide a QR Code'],
      unique: true,
      index: true,
    },
    citizenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    wasteType: {
      type: String,
      enum: ['dry', 'wet', 'hazardous', 'mixed'],
    },
    weightAtSource: {
      type: Number, // In kg
    },
    weightAtCollection: {
      type: Number, // In kg
    },
    weightAtFacility: {
      type: Number, // In kg
    },
    photoUrl: {
      type: String,
    },
    aiClassification: {
      type: String,
    },
    status: {
      type: String,
      enum: ['created', 'collected', 'in_transit', 'at_facility', 'processed', 'recycled'],
      default: 'created',
      index: true,
    },
    timeline: [
      {
        status: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        location: {
          lat: Number,
          lng: Number,
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        note: String,
      },
    ],
    collectorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    anomalyFlag: {
      type: Boolean,
      default: false,
      index: true,
    },
    anomalyReason: {
      type: String,
    },
    carbonImpact: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Optimize sorting by timeline entries
WasteBagSchema.index({ 'timeline.timestamp': -1 });

export default mongoose.models.WasteBag || mongoose.model('WasteBag', WasteBagSchema);
