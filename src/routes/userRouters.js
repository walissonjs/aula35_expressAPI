import createResourceController from '../controllers/resourceController.js';
import { users } from '../repository/index.js';
import asyncRouter from './asyncRouter.js';
import express from 'express'


const controller = createController(users)
const router = express.Router();

router.get('/', asyncRouter(controller.list));
router.get('/:id',  asyncRouter(controller.get));
router.patch('/:id', asyncRouter(controller.update));
router.delete('/:id', asyncRouter(controller.remove));
//Vai lidar com todas as rotas desse controlador ; do domínio do usuário.

export default router;
