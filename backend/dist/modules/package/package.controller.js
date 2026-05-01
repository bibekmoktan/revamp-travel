"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePackageStatus = exports.deletePackage = exports.updatePackage = exports.getSinglePackage = exports.getAllPackages = exports.createPackage = void 0;
const package_service_1 = require("./package.service");
const catchAsync_1 = require("../../utils/catchAsync");
const validation_1 = require("../../utils/validation");
const package_validation_1 = require("./package.validation");
const fileUpload_1 = require("../../utils/fileUpload");
const logger_1 = require("../../utils/logger");
/**
 * CREATE PACKAGE (With Media Support)
 */
exports.createPackage = [
    (0, validation_1.validateBody)(package_validation_1.createPackageSchema),
    (0, catchAsync_1.catchAsync)(async (req, res) => {
        const files = req.files;
        // Parse the validated data
        let packageData = req.body;
        // 1. Handle Feature Image upload
        if (files?.featureImage) {
            try {
                const uploadRes = await (0, fileUpload_1.sendToCloudinary)(files.featureImage[0].path, 'packages');
                packageData.featureImage = {
                    url: uploadRes.secure_url,
                    public_id: uploadRes.public_id
                };
            }
            catch (error) {
                logger_1.logger.error('Failed to upload feature image', { error: error.message });
                throw new Error('Feature image upload failed');
            }
        }
        // 2. Handle Gallery Images upload (Multiple)
        if (files?.gallery) {
            try {
                const galleryUploads = files.gallery.map(file => (0, fileUpload_1.sendToCloudinary)(file.path, 'gallery'));
                const results = await Promise.all(galleryUploads);
                packageData.gallery = results.map(res => ({
                    url: res.secure_url,
                    public_id: res.public_id
                }));
            }
            catch (error) {
                logger_1.logger.error('Failed to upload gallery images', { error: error.message });
                throw new Error('Gallery images upload failed');
            }
        }
        // 3. Save the fully constructed object to Database
        const result = await package_service_1.PackageService.createPackage(packageData);
        res.status(201).json({
            success: true,
            message: "Package created successfully with media",
            data: result,
        });
    }),
];
/**
 * GET ALL PACKAGES
 */
exports.getAllPackages = [
    (0, validation_1.validate)(package_validation_1.packageQuerySchema),
    (0, catchAsync_1.catchAsync)(async (req, res) => {
        const result = await package_service_1.PackageService.getAllPackages(req.query);
        res.status(200).json({
            success: true,
            message: "Packages retrieved successfully",
            meta: result.meta,
            data: result.data,
        });
    }),
];
/**
 * GET SINGLE PACKAGE
 */
exports.getSinglePackage = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await package_service_1.PackageService.getPackageBySlug(req.params.slug);
    res.status(200).json({
        success: true,
        message: "Package retrieved successfully",
        data: result,
    });
});
/**
 * UPDATE PACKAGE
 */
exports.updatePackage = [
    (0, validation_1.validateBody)(package_validation_1.updatePackageSchema),
    (0, catchAsync_1.catchAsync)(async (req, res) => {
        const result = await package_service_1.PackageService.updatePackage(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "Package updated successfully",
            data: result,
        });
    }),
];
/**
 * DELETE PACKAGE
 */
exports.deletePackage = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await package_service_1.PackageService.deletePackage(req.params.id);
    res.status(200).json({
        success: true,
        message: "Package deleted successfully",
        data: result,
    });
});
/**
 * UPDATE PACKAGE STATUS
 */
exports.updatePackageStatus = [
    (0, validation_1.validateBody)(package_validation_1.updatePackageStatusSchema),
    (0, catchAsync_1.catchAsync)(async (req, res) => {
        const { status } = req.body;
        const result = await package_service_1.PackageService.updatePackageStatus(req.params.id, status);
        res.status(200).json({
            success: true,
            message: "Package status updated successfully",
            data: result,
        });
    }),
];
