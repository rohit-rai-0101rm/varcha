import mongoose, { Schema } from 'mongoose';

const SessionSchema = new Schema(
  {
    _id: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
    device: { type: String },
  },
  { _id: false },
);

export default mongoose.model('Session', SessionSchema);
