import express from 'express';
import createResourceController from '../controllers/resourceController.js';
import { users } from '../repository/index.js';
import asyncRouter from './asyncRouter.js';

const router = express.Router();
const controller = createResourceController(users, { required: ['name', 'email'] });

router.get('/', asyncRouter(controller.list));
router.get('/:id', asyncRouter(controller.get));
router.post('/', asyncRouter(controller.create));
router.patch('/:id', asyncRouter(controller.update));
router.delete('/:id', asyncRouter(controller.remove));

export default router;
