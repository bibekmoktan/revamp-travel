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
 * Launch a Chromium browser appropriate for the current environment.
 * - Production / Linux servers (Render, etc.): @sparticuz/chromium ships the binary,
 *   no download step needed.
 * - Local development (Windows / macOS): regular `puppeteer` with its bundled Chrome.
 */
async function launchBrowser() {
  const useServerlessChromium =
    process.env.NODE_ENV === 'production' || process.env.USE_SPARTICUZ_CHROMIUM === 'true';

  if (useServerlessChromium) {
    const chromium = (await import('@sparticuz/chromium')).default;
    const puppeteerCore = (await import('puppeteer-core')).default;
    return puppeteerCore.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  }

  const puppeteer = (await import('puppeteer')).default;
  return puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
}

/**
 * DOWNLOAD ITINERARY PDF
 * Renders /print/itinerary/:slug from the frontend via headless Chrome and
 * streams a PDF back to the client.
 */
export const downloadItineraryPdf = catchAsync(async (req: Request, res: Response) => {
  const { slug } = req.params;

  // Verify package exists (throws NotFoundError if missing → 404)
  await PackageService.getPackageBySlug(slug);

  const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
  const printUrl = `${frontendUrl}/print/itinerary/${slug}`;

  const browser = await launchBrowser();

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1024, height: 1400 });
    await page.goto(printUrl, { waitUntil: 'networkidle0', timeout: 60000 });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '15mm', right: '12mm', bottom: '15mm', left: '12mm' },
    });

    logger.info(`Itinerary PDF generated (${pdfBuffer.length} bytes)`, { slug });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${slug}-itinerary.pdf"`
    );
    res.setHeader('Content-Length', String(pdfBuffer.length));
    res.end(pdfBuffer);
  } finally {
    await browser.close();
  }
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