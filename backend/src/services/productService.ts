import Product from '../models/Product';
import Category from '../models/Category';
import Style from '../models/Style';

export interface ProductFilters {
  category?: string;
  style?: string;
  minPrice?: string;
  maxPrice?: string;
  occasion?: string;
  gender?: string;
  search?: string;
}

export async function listProducts(filters: ProductFilters) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: Record<string, any> = { isActive: true };

  if (filters.category) {
    const cat = await Category.findOne({ slug: filters.category, isActive: true }, '_id').lean();
    if (!cat) return [];
    query.categoryId = cat._id;
  }

  if (filters.style) {
    const slugs = filters.style.split(',').filter(Boolean);
    const matched = await Style.find({ slug: { $in: slugs }, isActive: true }, '_id').lean();
    if (matched.length) query.styleIds = { $in: matched.map((s) => s._id) };
  }

  if (filters.minPrice || filters.maxPrice) {
    const priceFilter: Record<string, number> = {};
    if (filters.minPrice && !isNaN(+filters.minPrice)) priceFilter.$gte = +filters.minPrice;
    if (filters.maxPrice && !isNaN(+filters.maxPrice)) priceFilter.$lte = +filters.maxPrice;
    query.price = priceFilter;
  }

  if (filters.occasion) {
    query.occasion = { $in: filters.occasion.split(',').filter(Boolean) };
  }

  if (filters.gender) query.gender = filters.gender;

  if (filters.search?.trim()) query.$text = { $search: filters.search };

  return Product.find(query)
    .populate('categoryId', 'name slug')
    .populate('styleIds', 'name slug family')
    .lean();
}

export async function getProductBySlug(slug: string) {
  return Product.findOne({ slug, isActive: true })
    .populate('categoryId', 'name slug')
    .populate('styleIds', 'name slug family')
    .lean();
}
