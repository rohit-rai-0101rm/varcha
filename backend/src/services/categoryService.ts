import Category from '../models/Category';

export async function listCategories() {
  return Category.find({ isActive: true }).lean();
}

export async function getCategoryBySlug(slug: string) {
  return Category.findOne({ slug, isActive: true }).lean();
}
