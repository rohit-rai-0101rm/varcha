import mongoose from 'mongoose';
import Event from '../models/Event';
import Order from '../models/Order';
import User from '../models/User';

export async function getOverview() {
  const [
    topViewedProducts,
    topClickedProducts,
    topCategories,
    topStyles,
    marketplaceClicks,
    orderStatsResult,
  ] = await Promise.all([
    Event.aggregate([
      { $match: { type: 'pageview', productId: { $ne: null } } },
      { $group: { _id: '$productId', views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' },
      { $project: { _id: 1, views: 1, name: '$product.name', slug: '$product.slug' } },
    ]),

    Event.aggregate([
      { $match: { type: 'click', productId: { $ne: null } } },
      { $group: { _id: '$productId', clicks: { $sum: 1 } } },
      { $sort: { clicks: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' },
      { $project: { _id: 1, clicks: 1, name: '$product.name', slug: '$product.slug' } },
    ]),

    Event.aggregate([
      { $match: { type: 'pageview', categoryId: { $ne: null } } },
      { $group: { _id: '$categoryId', views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
      { $unwind: '$category' },
      { $project: { _id: 1, views: 1, name: '$category.name', slug: '$category.slug' } },
    ]),

    // Top styles by combined pageview + click engagement across their products
    Event.aggregate([
      { $match: { type: { $in: ['pageview', 'click'] }, productId: { $ne: null } } },
      { $group: { _id: '$productId', engagements: { $sum: 1 } } },
      { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' },
      { $unwind: { path: '$product.styleIds', preserveNullAndEmptyArrays: false } },
      { $group: { _id: '$product.styleIds', engagements: { $sum: '$engagements' } } },
      { $sort: { engagements: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'styles', localField: '_id', foreignField: '_id', as: 'style' } },
      { $unwind: '$style' },
      { $project: { _id: 1, engagements: 1, name: '$style.name', family: '$style.family' } },
    ]),

    Event.aggregate([
      { $match: { type: 'marketplace_redirect' } },
      { $group: { _id: { $ifNull: ['$platform', 'unknown'] }, clicks: { $sum: 1 } } },
      { $sort: { clicks: -1 } },
    ]),

    // Only website-exclusive products flow through own checkout — all paid orders are premium line
    Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, revenue: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
    ]),
  ]);

  const orderStats = orderStatsResult[0] ?? { revenue: 0, count: 0 };

  return {
    topViewedProducts,
    topClickedProducts,
    topCategories,
    topStyles,
    marketplaceClicks,
    premiumOrders: {
      revenue: orderStats.revenue as number,
      count: orderStats.count as number,
    },
  };
}

export async function getTopEngagedSessions() {
  return Event.aggregate([
    { $match: { type: { $in: ['time_spent', 'click'] } } },
    {
      $group: {
        _id: '$sessionId',
        userId: { $first: '$userId' },
        totalTimeMs: {
          $sum: {
            $cond: [{ $eq: ['$type', 'time_spent'] }, { $ifNull: ['$durationMs', 0] }, 0],
          },
        },
        clickCount: {
          $sum: { $cond: [{ $eq: ['$type', 'click'] }, 1, 0] },
        },
      },
    },
    { $sort: { totalTimeMs: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        totalTimeMs: 1,
        clickCount: 1,
        userId: { $ifNull: ['$user._id', null] },
        userName: { $ifNull: ['$user.name', null] },
        userEmail: { $ifNull: ['$user.email', null] },
      },
    },
  ]);
}

export async function listCustomers() {
  return User.aggregate([
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: 'events',
        localField: '_id',
        foreignField: 'userId',
        as: 'events',
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        phone: 1,
        createdAt: 1,
        marketingConsent: 1,
        pageviews: {
          $size: {
            $filter: { input: '$events', cond: { $eq: ['$$this.type', 'pageview'] } },
          },
        },
        clicks: {
          $size: {
            $filter: { input: '$events', cond: { $eq: ['$$this.type', 'click'] } },
          },
        },
        totalTimeMs: {
          $sum: {
            $map: {
              input: {
                $filter: { input: '$events', cond: { $eq: ['$$this.type', 'time_spent'] } },
              },
              in: { $ifNull: ['$$this.durationMs', 0] },
            },
          },
        },
      },
    },
  ]);
}

export async function getCustomerDetail(userId: string) {
  const [user, timeSpentByProduct] = await Promise.all([
    User.findById(userId).select('-passwordHash'),
    Event.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          type: 'time_spent',
          productId: { $ne: null },
        },
      },
      { $group: { _id: '$productId', totalTimeMs: { $sum: '$durationMs' }, visits: { $sum: 1 } } },
      { $sort: { totalTimeMs: -1 } },
      { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' },
      {
        $project: {
          _id: 1,
          totalTimeMs: 1,
          visits: 1,
          productName: '$product.name',
          productSlug: '$product.slug',
        },
      },
    ]),
  ]);
  return { user, timeSpentByProduct };
}
