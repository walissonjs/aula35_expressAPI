import express from 'express'
import userRoutes from './userRouters.js'

const router = express.Router();
router.use('/users', userRoutes);

export default router;