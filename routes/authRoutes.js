import express from 'express';
import { register, login, getUsers, deleteUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/users', getUsers); // यह 404 फिक्स करेगा
router.delete('/users/:id', deleteUser);

export default router;