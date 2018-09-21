import { Router } from 'express';
import AuthController from '../controllers/auth';
import { generateToken, respond } from '../middleware/authMiddleware';
import passport from 'passport';

const router = new Router();

router.route('/register')
  .post(AuthController.register);

router.route('/login')
  .post(AuthController.login);

router.route('/logout')
  .post(AuthController.logout);

/* router.post('/register', (req, res) => {
    AuthController.register(req, res);
});

router.post('/login', (req, res, next) => {
    AuthController.login(req, res, next);
});

router.post('/profile', (req, res) => {
    AuthController.profile(req, res);
}); */

export default router;