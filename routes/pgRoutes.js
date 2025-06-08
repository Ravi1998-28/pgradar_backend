import express from 'express';
import protect, { authorizeRoles } from '../middleware/authMiddleware.js';
import { addPG, getUnverifiedPGs } from '../controllers/pgController.js';

const router = express.Router();

router.post('/add-pg', protect, authorizeRoles('owner'), addPG);

// 4. List Unverified PGs (Only Superadmin/Admin)
router.get('/unverified-pg-list', protect, authorizeRoles('admin'), getUnverifiedPGs);

export default router;