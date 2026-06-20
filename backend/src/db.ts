import mongoose from 'mongoose';

let isConnected = false;

export function getDbStatus(): 'connected' | 'disconnected' {
  return isConnected ? 'connected' : 'disconnected';
}

export async function connectDb(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('MONGODB_URI not set — skipping database connection');
    return;
  }

  mongoose.connection.on('connected', () => {
    isConnected = true;
    console.log('MongoDB connected');
  });

  mongoose.connection.on('disconnected', () => {
    isConnected = false;
    console.warn('MongoDB disconnected');
  });

  mongoose.connection.on('error', (err: Error) => {
    isConnected = false;
    console.error('MongoDB error:', err.message);
  });

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  } catch (err) {
    console.error('Initial MongoDB connection failed:', err);
  }
}
