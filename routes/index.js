import { Router } from 'express';
import auth from './auth';
import posts from './posts';
import response from '../helpers/response';

const router = new Router();

router.use(response.setHeadersForCORS);

router.use('/posts', posts);
router.use('/auth', auth);

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Ok' });
});

router.use(function(req, res) {
  response.sendNotFound(res);
});

export default router