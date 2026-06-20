import { Request, Response } from 'express';
import Session from '../models/Session';
import Event from '../models/Event';

export async function logEvent(req: Request, res: Response) {
  const sessionId = req.sessionId;
  if (!sessionId) {
    res.status(400).json({ message: 'X-Session-Id header required' });
    return;
  }

  const { type, productId, categoryId, durationMs, platform } = req.body;
  if (!type) {
    res.status(400).json({ message: 'type is required' });
    return;
  }

  try {
    const userId = req.auth?.userId ?? null;
    const ua = req.headers['user-agent'] ?? '';
    const device = ua.slice(0, 200);

    await Session.findOneAndUpdate(
      { _id: sessionId },
      {
        $setOnInsert: { startedAt: new Date(), device },
        $set: { endedAt: new Date(), ...(userId ? { userId } : {}) },
      },
      { upsert: true, new: true },
    );

    const event = await Event.create({
      sessionId,
      userId,
      type,
      productId: productId || null,
      categoryId: categoryId || null,
      durationMs: durationMs || null,
      platform: platform || null,
    });

    res.status(201).json({ _id: event._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}
