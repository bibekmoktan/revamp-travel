import { Router } from 'express';
import * as EnquiryController from './enquiry.controller';
import { protect } from '../../middlewares/protect';
import { authorize } from '../../middlewares/authorize';

const router = Router();

// Public — anyone can submit
router.post('/', ...EnquiryController.createEnquiry);

// Admin only
router.get('/',          protect, authorize('admin'), EnquiryController.getAllEnquiries);
router.patch('/:id',     protect, authorize('admin'), ...EnquiryController.updateEnquiryStatus);
router.delete('/:id',    protect, authorize('admin'), EnquiryController.deleteEnquiry);

export const EnquiryRoutes = router;
