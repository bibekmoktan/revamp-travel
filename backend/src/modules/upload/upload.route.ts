import { Router, Request, Response } from 'express';
import { upload, sendToCloudinary } from '../../utils/fileUpload';
import { protect } from '../../middlewares/protect';
import { authorize } from '../../middlewares/authorize';
import { catchAsync } from '../../utils/catchAsync';

const router = Router();

router.post(
  '/',
  protect,
  authorize('admin'),
  upload.single('file'),
  catchAsync(async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file provided' });
      return;
    }
    const result: any = await sendToCloudinary(req.file.path, 'packages');
    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: { url: result.secure_url, public_id: result.public_id },
    });
  }),
);

export const UploadRoutes = router;
