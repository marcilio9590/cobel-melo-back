import { Connection } from 'mongoose';
import CustomerSchema from '../schemas/customer.schema';
import HearingSchema from '../schemas/hearing.schema';
import MovementSchema from '../schemas/movement.schema';
import ProcessAreaSchema from '../schemas/process-area.schema';
import ProcessSchema from '../schemas/process.schema';
import { SeedSchema } from '../schemas/seed.schema';
import UserSchema from '../schemas/user.schema';

export const modelProviders = [
  {
    provide: 'USER_MODEL',
    useFactory: (connection: Connection) => connection.model('User', UserSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'SEED_MODEL',
    useFactory: (connection: Connection) => connection.model('Seed', SeedSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'CUSTOMER_MODEL',
    useFactory: (connection: Connection) => connection.model('Customer', CustomerSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'PROCESS_MODEL',
    useFactory: (connection: Connection) => connection.model('Process', ProcessSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'PROCESS_AREA_MODEL',
    useFactory: (connection: Connection) => connection.model('ProcessArea', ProcessAreaSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'MOVEMENT_MODEL',
    useFactory: (connection: Connection) => connection.model('Movement', MovementSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'HEARING_MODEL',
    useFactory: (connection: Connection) => connection.model('Hearing', HearingSchema),
    inject: ['DATABASE_CONNECTION'],
  }
];