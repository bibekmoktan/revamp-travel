import { Request, Response } from "express";
import { PackageService } from "./package.service";
import { catchAsync } from "../../utils/catchAsync";
import { validateBody, validate } from "../../utils/validation";
import { createPackageSchema, updatePackageSchema, packageQuerySchema, updatePackageStatusSchema } from "./package.validation";
import { sendToCloudinary } from "../../utils/fileUpload";
import { logger } from "../../utils/logger";

/**
 * CREATE PACKAGE (With Media Support)
 */
export const createPackage = [
  validateBody(createPackageSchema),
  catchAsync(async (req: Request, res: Response) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    // Parse the validated data
    let packageData = req.body;

    // 1. Handle Feature Image upload
    if (files?.featureImage) {
      try {
        const uploadRes: any = await sendToCloudinary(files.featureImage[0].path, 'packages');
        packageData.featureImage = {
          url: uploadRes.secure_url,
          public_id: uploadRes.public_id
        };
      } catch (error: any) {
        logger.error('Failed to upload feature image', { error: error.message });
        throw new Error('Feature image upload failed');
      }
    }

    // 2. Handle Gallery Images upload (Multiple)
    if (files?.gallery) {
      try {
        const galleryUploads = files.gallery.map(file => sendToCloudinary(file.path, 'gallery'));
        const results: any[] = await Promise.all(galleryUploads);
        
        packageData.gallery = results.map(res => ({
          url: res.secure_url,
          public_id: res.public_id
        }));
      } catch (error: any) {
        logger.error('Failed to upload gallery images', { error: error.message });
        throw new Error('Gallery images upload failed');
      }
    }

    // 3. Save the fully constructed object to Database
    const result = await PackageService.createPackage(packageData);

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
export const getAllPackages = [
  validate(packageQuerySchema),
  catchAsync(async (req: Request, res: Response) => {
    const result = await PackageService.getAllPackages(req.query);
    
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
export const getSinglePackage = catchAsync(async (req: Request, res: Response) => {
  const result = await PackageService.getPackageBySlug(req.params.slug);
  
  res.status(200).json({
    success: true,
    message: "Package retrieved successfully",
    data: result,
  });
});

/**
 * UPDATE PACKAGE
 */
export const updatePackage = [
  validateBody(updatePackageSchema),
  catchAsync(async (req: Request, res: Response) => {
    const result = await PackageService.updatePackage(req.params.id, req.body);
    
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
export const deletePackage = catchAsync(async (req: Request, res: Response) => {
  const result = await PackageService.deletePackage(req.params.id);
  
  res.status(200).json({
    success: true,
    message: "Package deleted successfully",
    data: result,
  });
});

/**
 * UPDATE PACKAGE STATUS
 */
export const updatePackageStatus = [
  validateBody(updatePackageStatusSchema),
  catchAsync(async (req: Request, res: Response) => {
    const { status } = req.body;
    const result = await PackageService.updatePackageStatus(req.params.id, status);
    
    res.status(200).json({
      success: true,
      message: "Package status updated successfully",
      data: result,
    });
  }),
];