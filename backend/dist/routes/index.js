"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("../modules/users/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const package_route_1 = require("../modules/package/package.route");
const review_route_1 = require("../modules/reviews/review.route");
const booking_route_1 = require("../modules/bookings/booking.route");
const upload_route_1 = require("../modules/upload/upload.route");
const category_route_1 = require("../modules/category/category.route");
const enquiry_route_1 = require("../modules/enquiry/enquiry.route");
const payment_route_1 = require("../modules/payment/payment.route");
const wishlist_route_1 = require("../modules/wishlist/wishlist.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/users',
        route: user_route_1.UserRoutes,
    },
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/packages',
        route: package_route_1.PackageRoutes,
    },
    {
        path: '/reviews',
        route: review_route_1.ReviewRoutes,
    },
    {
        path: '/bookings',
        route: booking_route_1.BookingRoutes,
    },
    {
        path: '/upload',
        route: upload_route_1.UploadRoutes,
    },
    {
        path: '/categories',
        route: category_route_1.CategoryRoutes,
    },
    {
        path: '/enquiries',
        route: enquiry_route_1.EnquiryRoutes,
    },
    {
        path: '/payments',
        route: payment_route_1.PaymentRoutes,
    },
    {
        path: '/wishlist',
        route: wishlist_route_1.WishlistRoutes,
    },
];
// Loop through the array to register all routes dynamically
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
