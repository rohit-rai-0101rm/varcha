import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmin extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'super-admin' | 'editor' | 'order-manager';
}

const AdminSchema = new Schema<IAdmin>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: ['super-admin', 'editor', 'order-manager'],
    default: 'editor',
  },
});

export default mongoose.model<IAdmin>('Admin', AdminSchema);
