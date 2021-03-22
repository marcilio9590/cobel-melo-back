import * as mongoose from 'mongoose';

export const mongooseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (): Promise<typeof mongoose> =>
      await mongoose.connect(process.env.ENV_DB_URL),
  }
];