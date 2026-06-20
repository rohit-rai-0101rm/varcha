import { Request, Response } from 'express';
import User from '../models/User';
import Product from '../models/Product';

export async function getWishlist(req: Request, res: Response) {
  try {
    const user = await User.findById(req.auth!.userId).populate('wishlist');
    if (!user) { res.status(404).json({ message: 'User not found' }); return; }
    res.json(user.wishlist);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
}

export async function addToWishlist(req: Request, res: Response) {
  const { productId } = req.params;
  try {
    const product = await Product.findById(productId);
    if (!product) { res.status(404).json({ message: 'Product not found' }); return; }

    await User.findByIdAndUpdate(
      req.auth!.userId,
      { $addToSet: { wishlist: productId } },
    );
    res.json({ message: 'Added to wishlist' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
}

export async function removeFromWishlist(req: Request, res: Response) {
  const { productId } = req.params;
  try {
    await User.findByIdAndUpdate(
      req.auth!.userId,
      { $pull: { wishlist: productId } },
    );
    res.json({ message: 'Removed from wishlist' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
}
