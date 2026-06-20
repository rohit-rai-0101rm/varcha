import mongoose, { Schema, Document } from 'mongoose';

export type EventType =
  | 'pageview'
  | 'click'
  | 'time_spent'
  | 'marketplace_redirect'
  | 'checkout_complete';

export interface IEvent extends Document {
  sessionId: string;
  userId?: mongoose.Types.ObjectId;
  type: EventType;
  productId?: mongoose.Types.ObjectId;
  categoryId?: mongoose.Types.ObjectId;
  durationMs?: number;
  platform?: string;
  timestamp: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    sessionId: { type: String, required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    type: {
      type: String,
      enum: ['pageview', 'click', 'time_spent', 'marketplace_redirect', 'checkout_complete'],
      required: true,
    },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', default: null },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    durationMs: { type: Number },
    platform: { type: String },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false },
);

export default mongoose.model<IEvent>('Event', EventSchema);
