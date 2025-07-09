// apps/api/src/app/routes/auth.route.ts
import express from 'express';
import { AuthService } from '../services/auth.service';
import { UserModel } from '../models/user.model';

const router = express.Router();
const authService = new AuthService();
/**
 * @route POST /api/auth/signup
 * @desc Sign up a new user
 */
router.post('/signup', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const user = await authService.signup(username, password, email);
    res.json({ id: user.id, username: user.username });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @route POST /api/auth/login
 * @desc Login a user
 */
router.post('/login', async (req, res) => {
  try {
    const { password, email } = req.body;
    const { token, userId, username } = await authService.login(
      password,
      email
    );
    res.json({ accessToken: token, userId, username });
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
});

/**
 * @route POST /api/auth/recovery-password
 * @desc Recovery password
 */
router.post('/recovery-password', async (req, res) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) return res.status(404).json({ message: 'Email not found' });
  return res.json({
    message:
      'Recovery email sent successfully. Please check your email.(Note: Just for testing purposes)',
  });
});
export default router;
