import { Router } from 'express';
import { UserRoutes } from '../modules/users/user.route';
import { AuthRoutes } from '../modules/auth/auth.route'; 
import { PackageRoutes } from '../modules/package/package.route';
import { ReviewRoutes } from '../modules/reviews/review.route';
import { BookingRoutes } from '../modules/bookings/booking.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/packages',
    route: PackageRoutes,
  },
  {
    path: '/reviews',
    route: ReviewRoutes,
  },
  {
    path: '/bookings',
    route: BookingRoutes,
  },
];

// Loop through the array to register all routes dynamically
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;