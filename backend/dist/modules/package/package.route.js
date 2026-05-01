"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageRoutes = void 0;
const express_1 = require("express");
const PackageController = __importStar(require("./package.controller"));
const fileUpload_1 = require("../../utils/fileUpload");
const authorize_1 = require("../../middlewares/authorize");
const protect_1 = require("../../middlewares/protect");
const router = (0, express_1.Router)();
/**
 * @route   POST /api/v1/packages
 * @desc    Create a new travel package with images (Admin only)
 */
router.post("/", protect_1.protect, (0, authorize_1.authorize)('admin'), fileUpload_1.upload.fields([
    { name: "featureImage", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
]), ...PackageController.createPackage);
/**
 * @route   GET /api/v1/packages
 * @desc    Get all packages with filtering, sorting, and pagination (Public)
 */
router.get("/", ...PackageController.getAllPackages);
/**
 * @route   GET /api/v1/packages/:slug
 * @desc    Get detailed view of a single package by its slug (Public)
 */
router.get("/:slug", PackageController.getSinglePackage);
/**
 * @route   PATCH /api/v1/packages/:id
 * @desc    Update package details (Admin only)
 */
router.patch("/:id", protect_1.protect, (0, authorize_1.authorize)('admin'), ...PackageController.updatePackage);
/**
 * @route   PATCH /api/v1/packages/:id/status
 * @desc    Update package status (Admin only)
 */
router.patch("/:id/status", protect_1.protect, (0, authorize_1.authorize)('admin'), ...PackageController.updatePackageStatus);
/**
 * @route   DELETE /api/v1/packages/:id
 * @desc    Remove a package from the database (Admin only)
 */
router.delete("/:id", protect_1.protect, (0, authorize_1.authorize)('admin'), PackageController.deletePackage);
exports.PackageRoutes = router;
