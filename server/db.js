import mongoose from 'mongoose';

export const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/servicehub';

const connectionStates = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
};

export async function connectDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000,
  });
  return mongoose.connection;
}

export function getDatabaseStatus() {
  const { connection } = mongoose;

  return {
    status: connectionStates[connection.readyState] || 'unknown',
    name: connection.name || null,
    host: connection.host || null,
  };
}

export default mongoose;
