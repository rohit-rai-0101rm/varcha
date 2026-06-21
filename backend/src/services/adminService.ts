import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';
import Product from '../models/Product';
import Category from '../models/Category';
import Style from '../models/Style';
import Banner from '../models/Banner';
import Order from '../models/Order';
import Settings from '../models/Settings';

function slugify(text: string): string {
  return (text ?? '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export async function adminLogin(email: string, password: string) {
  const admin = await Admin.findOne({ email: email.toLowerCase() });
  if (!admin) throw Object.assign(new Error('Invalid credentials'), { status: 401 });
  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) throw Object.assign(new Error('Invalid credentials'), { status: 401 });
  const token = jwt.sign(
    { adminId: admin._id.toString(), email: admin.email, role: admin.role },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' },
  );
  return {
    token,
    admin: { _id: admin._id.toString(), name: admin.name, email: admin.email, role: admin.role },
  };
}

export async function getAdminById(id: string) {
  return Admin.findById(id).select('-passwordHash');
}

// ── Products ─────────────────────────────────────────────────────────────────

export async function adminListProducts() {
  return Product.find()
    .sort({ createdAt: -1 })
    .populate('categoryId', 'name slug')
    .populate('styleIds', 'name family');
}

export async function adminGetProduct(id: string) {
  return Product.findById(id)
    .populate('categoryId', 'name slug')
    .populate('styleIds', 'name family');
}

export async function adminCreateProduct(data: any) {
  const slug = data.slug || slugify(data.name);
  return Product.create({ ...data, slug });
}

export async function adminUpdateProduct(id: string, data: any) {
  if (data.name && !data.slug) data.slug = slugify(data.name);
  return Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

export async function adminDeleteProduct(id: string) {
  const result = await Product.findByIdAndDelete(id);
  return !!result;
}

// ── Categories ────────────────────────────────────────────────────────────────

export async function adminListCategories() {
  return Category.find().sort({ name: 1 }).populate('parentCategory', 'name');
}

export async function adminCreateCategory(data: any) {
  const slug = data.slug || slugify(data.name);
  return Category.create({ ...data, slug });
}

export async function adminUpdateCategory(id: string, data: any) {
  if (data.name && !data.slug) data.slug = slugify(data.name);
  return Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

export async function adminDeleteCategory(id: string) {
  const result = await Category.findByIdAndDelete(id);
  return !!result;
}

// ── Styles ────────────────────────────────────────────────────────────────────

export async function adminListStyles() {
  return Style.find().sort({ family: 1, name: 1 });
}

export async function adminCreateStyle(data: any) {
  const slug = data.slug || slugify(data.name);
  return Style.create({ ...data, slug });
}

export async function adminUpdateStyle(id: string, data: any) {
  if (data.name && !data.slug) data.slug = slugify(data.name);
  return Style.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

export async function adminDeleteStyle(id: string) {
  const result = await Style.findByIdAndDelete(id);
  return !!result;
}

// ── Banners ───────────────────────────────────────────────────────────────────

export async function adminListBanners() {
  return Banner.find().sort({ createdAt: -1 });
}

export async function adminCreateBanner(data: any) {
  return Banner.create(data);
}

export async function adminUpdateBanner(id: string, data: any) {
  return Banner.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

export async function adminToggleBanner(id: string) {
  const banner = await Banner.findById(id);
  if (!banner) return null;
  banner.isActive = !banner.isActive;
  return banner.save();
}

export async function adminDeleteBanner(id: string) {
  const result = await Banner.findByIdAndDelete(id);
  return !!result;
}

// ── Orders ────────────────────────────────────────────────────────────────────

export async function adminListOrders(status?: string) {
  const filter = status ? { orderStatus: status } : {};
  return Order.find(filter)
    .sort({ createdAt: -1 })
    .populate('userId', 'name email')
    .populate('items.productId', 'name slug');
}

export async function adminUpdateOrderStatus(id: string, orderStatus: string) {
  const valid = ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'];
  if (!valid.includes(orderStatus)) {
    throw Object.assign(new Error('Invalid status'), { status: 400 });
  }
  return Order.findByIdAndUpdate(id, { orderStatus }, { new: true });
}

// ── Settings ──────────────────────────────────────────────────────────────────

const SETTINGS_ID = 'site-settings';

export async function getSettings() {
  let s = await Settings.findById(SETTINGS_ID);
  if (!s) s = await Settings.create({ _id: SETTINGS_ID });
  return s;
}

export async function updateSettings(data: Partial<{
  whatsappNumber: string;
  contactEmail: string;
  socialLinks: { instagram?: string; facebook?: string };
  homeBannerEnabled: boolean;
  firstOrderDiscountText: string;
}>) {
  return Settings.findByIdAndUpdate(SETTINGS_ID, { $set: data }, { new: true, upsert: true });
}
