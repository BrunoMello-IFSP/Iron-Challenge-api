import './model';

import mongoose from 'mongoose';

import AppError from '@/shared/errors/AppError';

async function connectWithMongoDB() {
  try {
    const uri = process.env.URL_DATABASE_STRING;

    if (!uri) {
      throw new AppError(
        'Environment variable URL_DATABASE_STRING is missing.',
      );
    }

    await mongoose.connect(uri);

    console.log(
      '[iron_fit_api] MongoDB connection has been established successfully.',
    );
  } catch (error) {
    console.error(
      '[iron_fit_api] Unable to connect to the MongoDB database:',
      error,
    );
  }
}

export default connectWithMongoDB();
