import type { Request, Response } from 'express';
import * as productService from '../services/productService';

function str(v: unknown): string | undefined {
  return typeof v === 'string' ? v : undefined;
}

export async function list(req: Request, res: Response) {
  try {
    const { category, style, minPrice, maxPrice, occasion, gender, search } = req.query;
    const products = await productService.listProducts({
      category: str(category),
      style: str(style),
      minPrice: str(minPrice),
      maxPrice: str(maxPrice),
      occasion: str(occasion),
      gender: str(gender),
      search: str(search),
    });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}

export async function getBySlug(req: Request, res: Response) {
  try {
    const product = await productService.getProductBySlug(req.params.slug);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(product);
  } catch {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
}
