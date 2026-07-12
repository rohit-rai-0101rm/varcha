import mongoose, { Schema, Document } from 'mongoose';

export interface ILead extends Document {
  name: string;
  phone: string;
  email?: string;
  createdAt: Date;
}

const LeadSchema = new Schema<ILead>({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ILead>('Lead', LeadSchema);
