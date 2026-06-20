import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import mongoose from 'mongoose';
import Category from './models/Category';
import Style from './models/Style';
import Product from './models/Product';

const U = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set in .env');

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  await Promise.all([
    Category.deleteMany({}),
    Style.deleteMany({}),
    Product.deleteMany({}),
  ]);
  console.log('Cleared existing data');

  const [necklaces, bangles, earrings] = await Category.insertMany([
    {
      name: 'Necklaces',
      slug: 'necklaces',
      image: U('photo-1515562141207-7a88fb7ce338', 600),
    },
    {
      name: 'Bangles',
      slug: 'bangles',
      image: U('photo-1573408301185-9519f94816b5', 600),
    },
    {
      name: 'Earrings',
      slug: 'earrings',
      image: U('photo-1535632066927-ab7c9ab60908', 600),
    },
  ]);

  const [kundan, meenakari, maasai, tribalSilver, minimalist, geometric] =
    await Style.insertMany([
      { name: 'Kundan', slug: 'kundan', family: 'indian-craft' },
      { name: 'Meenakari', slug: 'meenakari', family: 'indian-craft' },
      { name: 'Maasai Beadwork', slug: 'maasai-beadwork', family: 'global-tradition' },
      { name: 'Tribal Silver', slug: 'tribal-silver', family: 'global-tradition' },
      { name: 'Minimalist', slug: 'minimalist', family: 'aesthetic' },
      { name: 'Geometric', slug: 'geometric', family: 'aesthetic' },
    ]);

  await Product.insertMany([
    // --- Website-exclusive (premium / bridal) ---
    {
      name: 'Kundan Polki Necklace',
      slug: 'kundan-polki-necklace',
      categoryId: necklaces._id,
      price: 2499,
      images: [
        { url: U('photo-1611652022419-a9419f74343d'), type: 'product-shot' },
        { url: U('photo-1524504388940-b1c1722653e1', 1800), type: 'model-shot' },
      ],
      description:
        'Handcrafted Kundan Polki necklace with 22K gold-plated setting and polki stone accents. A centrepiece for any bridal or festive occasion.',
      styleIds: [kundan._id],
      occasion: ['festive', 'bridal'],
      gender: 'women',
      channel: 'website-exclusive',
      stockQty: 10,
    },
    {
      name: 'Meenakari Choker',
      slug: 'meenakari-choker',
      categoryId: necklaces._id,
      price: 1899,
      images: [
        { url: U('photo-1599643478518-a784e5dc4c8f'), type: 'product-shot' },
        { url: U('photo-1487412720507-e7ab37603c6f', 1800), type: 'model-shot' },
      ],
      description:
        'Vibrant Meenakari choker with intricate enamel work in peacock motifs. Hand-finished by artisans in Jaipur.',
      styleIds: [meenakari._id],
      occasion: ['festive', 'party'],
      gender: 'women',
      channel: 'website-exclusive',
      stockQty: 8,
    },
    {
      name: 'Kundan Bangle Set (Set of 6)',
      slug: 'kundan-bangle-set',
      categoryId: bangles._id,
      price: 2999,
      images: [
        { url: U('photo-1602173574767-37ac01994b2a'), type: 'product-shot' },
        { url: U('photo-1508214751196-bcfd4ca60f91', 1800), type: 'model-shot' },
      ],
      description:
        'Gold-plated Kundan bangles set with hand-set polki stones. A bridal essential, crafted to be worn as a full set or stacked in pairs.',
      styleIds: [kundan._id, meenakari._id],
      occasion: ['bridal', 'festive', 'anniversary'],
      gender: 'women',
      channel: 'website-exclusive',
      stockQty: 5,
    },
    {
      name: 'Geometric Statement Earrings',
      slug: 'geometric-statement-earrings',
      categoryId: earrings._id,
      price: 1299,
      images: [
        { url: U('photo-1588444837495-c6cfeb53f32d'), type: 'product-shot' },
        { url: U('photo-1524504388940-b1c1722653e1', 1800), type: 'model-shot' },
      ],
      description:
        'Bold geometric drop earrings in oxidised gold finish. Angular silhouettes for a contemporary take on Indian craft.',
      styleIds: [geometric._id],
      occasion: ['party', 'formal', 'gen-z'],
      gender: 'women',
      channel: 'website-exclusive',
      stockQty: 15,
    },

    // --- Marketplace (everyday line) ---
    {
      name: 'Maasai Bead Layered Necklace',
      slug: 'maasai-bead-layered-necklace',
      categoryId: necklaces._id,
      price: 899,
      images: [
        { url: U('photo-1515562141207-7a88fb7ce338'), type: 'product-shot' },
      ],
      description:
        'Multi-strand layered necklace inspired by Maasai beadwork. Vivid colours, lightweight wear — pairs with everything from kurtis to denim.',
      styleIds: [maasai._id],
      occasion: ['daily', 'party'],
      gender: 'women',
      channel: 'marketplace',
      marketplaceLinks: [{ platform: 'amazon', url: 'https://amazon.in/dp/example1' }],
    },
    {
      name: 'Geometric Gold Bangles (Set of 4)',
      slug: 'geometric-gold-bangles-set',
      categoryId: bangles._id,
      price: 699,
      images: [
        { url: U('photo-1573408301185-9519f94816b5'), type: 'product-shot' },
      ],
      description:
        'Sleek geometric bangles with clean angular lines. Lightweight brass with gold plating. Standard 2.6-inch diameter.',
      styleIds: [geometric._id],
      occasion: ['daily', 'formal'],
      gender: 'women',
      channel: 'marketplace',
      marketplaceLinks: [
        { platform: 'amazon', url: 'https://amazon.in/dp/example2' },
        { platform: 'flipkart', url: 'https://flipkart.com/p/example2' },
      ],
    },
    {
      name: 'Tribal Silver Drop Earrings',
      slug: 'tribal-silver-drop-earrings',
      categoryId: earrings._id,
      price: 549,
      images: [
        { url: U('photo-1535632066927-ab7c9ab60908'), type: 'product-shot' },
      ],
      description:
        'Oxidised tribal silver drop earrings with hammered texture and geometric cutouts. Inspired by North African silverwork traditions.',
      styleIds: [tribalSilver._id],
      occasion: ['daily', 'festive'],
      gender: 'women',
      channel: 'marketplace',
      marketplaceLinks: [{ platform: 'amazon', url: 'https://amazon.in/dp/example3' }],
    },
    {
      name: 'Minimalist Pearl Studs',
      slug: 'minimalist-pearl-studs',
      categoryId: earrings._id,
      price: 399,
      images: [
        { url: U('photo-1605100804763-247f67b3557e'), type: 'product-shot' },
      ],
      description:
        'Delicate faux-pearl studs on sterling silver posts. The ideal everyday pair — subtle enough for the office, refined enough for dinner.',
      styleIds: [minimalist._id],
      occasion: ['daily', 'formal'],
      gender: 'women',
      channel: 'marketplace',
      marketplaceLinks: [
        { platform: 'amazon', url: 'https://amazon.in/dp/example4' },
        { platform: 'flipkart', url: 'https://flipkart.com/p/example4' },
      ],
    },
    {
      name: 'Tribal Beaded Bangle Stack',
      slug: 'tribal-beaded-bangle-stack',
      categoryId: bangles._id,
      price: 799,
      images: [
        { url: U('photo-1589128777073-263566ae5e4d'), type: 'product-shot' },
      ],
      description:
        'Woven beaded bangles in earthy ochre and terracotta tones. Wear three together or mix into your own stack.',
      styleIds: [maasai._id, tribalSilver._id],
      occasion: ['daily', 'festive', 'party'],
      gender: 'women',
      channel: 'marketplace',
      marketplaceLinks: [{ platform: 'flipkart', url: 'https://flipkart.com/p/example5' }],
    },
  ]);

  console.log('Seed complete: 3 categories, 6 styles, 9 products');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
