import { IProduct } from '../models/Product';

const WEBHOOK_URL = process.env.MAKE_PRODUCT_WEBHOOK_URL;
const SITE_URL = process.env.SITE_URL ?? 'https://varcha.in';

export async function postProductToSocial(product: IProduct) {
  if (!WEBHOOK_URL) {
    console.log('[socialPostService] No MAKE_PRODUCT_WEBHOOK_URL set — would have posted:', product.slug);
    return;
  }

  const image = product.images.find((i) => i.type === 'model-shot')?.url ?? product.images[0]?.url;

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: product.name,
        price: product.price,
        imageUrl: image,
        productUrl: `${SITE_URL}/product/${product.slug}`,
      }),
    });
    if (!res.ok) console.error('[socialPostService] Make webhook rejected post:', res.status);
  } catch (err) {
    // Social posting must never break the product-creation flow — log and continue
    console.error('[socialPostService] Failed to post to Make webhook:', err);
  }
}
