import { HydratedDocument } from 'mongoose';
import { TUser } from '../modules/users/user.interface';

declare global {
  namespace Express {
    interface Request {
      user?: HydratedDocument<TUser>;
    }
  }
}
