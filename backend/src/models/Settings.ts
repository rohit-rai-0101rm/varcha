import mongoose, { Schema } from 'mongoose';

export interface ISettings {
  _id: string;
  whatsappNumber: string;
  contactEmail: string;
  socialLinks: { instagram?: string; facebook?: string };
  homeBannerEnabled: boolean;
  firstOrderDiscountText: string;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    _id: { type: String },
    whatsappNumber: { type: String, default: '' },
    contactEmail: { type: String, default: '' },
    socialLinks: {
      instagram: { type: String, default: '' },
      facebook: { type: String, default: '' },
    },
    homeBannerEnabled: { type: Boolean, default: true },
    firstOrderDiscountText: { type: String, default: '' },
  },
  { timestamps: { updatedAt: true, createdAt: false } },
);

export default mongoose.model<ISettings>('Settings', SettingsSchema);
