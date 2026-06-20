import Style from '../models/Style';

export async function listStyles() {
  return Style.find({ isActive: true }).lean();
}

export async function getStyleBySlug(slug: string) {
  return Style.findOne({ slug, isActive: true }).lean();
}
