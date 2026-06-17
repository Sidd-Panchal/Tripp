import mongoose from 'mongoose';
import crypto from 'crypto';

const itinerarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    destination: {
      type: String,
      trim: true,
      index: true,
    },
    extractedData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    generatedItinerary: {
      type: String,
      required: true,
    },
    uploadedFiles: [
      {
        originalName: String,
        filename: String,
        path: String,
        mimeType: String,
        size: Number,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    shareId: {
      type: String,
      unique: true,
      index: true,
      default: () => crypto.randomUUID(),
    },
  },
  {
    timestamps: true,
  }
);

const Itinerary = mongoose.model('Itinerary', itinerarySchema);
export default Itinerary;
