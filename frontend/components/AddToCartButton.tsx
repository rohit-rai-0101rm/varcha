'use client';

import { useCart } from '@/context/CartContext';

interface Props {
  productId: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  stockQty: number;
}

export default function AddToCartButton({ productId, name, price, image, slug, stockQty }: Props) {
  const { addItem, items } = useCart();
  const inCart = items.find((i) => i.productId === productId);
  const atMax = inCart ? inCart.qty >= stockQty : false;

  function handleClick() {
    if (atMax) return;
    addItem({ productId, name, price, image, slug, stockQty });
  }

  return (
    <button
      onClick={handleClick}
      disabled={stockQty === 0 || atMax}
      className="w-full rounded-lg bg-[var(--wine)] px-6 py-3 font-medium text-[var(--surface)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {stockQty === 0 ? 'Out of Stock' : atMax ? 'Max quantity added' : inCart ? 'Add one more' : 'Add to Cart'}
    </button>
  );
}
