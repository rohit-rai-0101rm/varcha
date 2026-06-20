import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import Session from '../models/Session';
import Event from '../models/Event';

export interface SignupInput {
  name: string;
  email: string;
  phone: string;
  password: string;
  marketingConsent?: boolean;
}

export interface LoginInput {
  email: string;
  password: string;
}

function makeToken(user: IUser): string {
  const secret = process.env.JWT_SECRET!;
  return jwt.sign({ userId: user._id.toString(), email: user.email }, secret, {
    expiresIn: '7d',
  });
}

export async function signup(input: SignupInput) {
  const existing = await User.findOne({ email: input.email.toLowerCase() });
  if (existing) throw new Error('EMAIL_TAKEN');

  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await User.create({
    name: input.name,
    email: input.email,
    phone: input.phone,
    passwordHash,
    marketingConsent: input.marketingConsent ?? false,
  });

  return { token: makeToken(user), user: safeUser(user) };
}

export async function login(input: LoginInput, sessionId?: string) {
  const user = await User.findOne({ email: input.email.toLowerCase() });
  if (!user) throw new Error('INVALID_CREDENTIALS');

  const ok = await bcrypt.compare(input.password, user.passwordHash);
  if (!ok) throw new Error('INVALID_CREDENTIALS');

  if (sessionId) {
    await Session.updateMany({ _id: sessionId }, { $set: { userId: user._id } });
    await Event.updateMany(
      { sessionId, userId: null },
      { $set: { userId: user._id } },
    );
  }

  return { token: makeToken(user), user: safeUser(user) };
}

export async function getMe(userId: string) {
  const user = await User.findById(userId).populate('wishlist');
  if (!user) throw new Error('NOT_FOUND');
  return safeUser(user);
}

export function safeUser(user: IUser) {
  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone,
    marketingConsent: user.marketingConsent,
    wishlist: user.wishlist.map((id) => id.toString()),
    createdAt: user.createdAt,
  };
}
