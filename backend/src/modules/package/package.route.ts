import { Router } from "express";
import * as PackageController from "./package.controller";
import { upload } from "../../utils/fileUpload";
import { authorize } from "../../middlewares/authorize";
import { protect } from "../../middlewares/protect";

const router = Router();

/**
 * @route   POST /api/v1/packages
 * @desc    Create a new travel package with images (Admin only)
 */
router.post(
  "/",
  protect,
  authorize('admin'),
  upload.fields([
    { name: "featureImage", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ]),
  ...PackageController.createPackage
);

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
router.patch("/:id", protect, authorize('admin'), ...PackageController.updatePackage);

/**
 * @route   PATCH /api/v1/packages/:id/status
 * @desc    Update package status (Admin only)
 */
router.patch("/:id/status", protect, authorize('admin'), ...PackageController.updatePackageStatus);

/**
 * @route   DELETE /api/v1/packages/:id
 * @desc    Remove a package from the database (Admin only)
 */
router.delete("/:id", protect, authorize('admin'), PackageController.deletePackage);

export const PackageRoutes = router;