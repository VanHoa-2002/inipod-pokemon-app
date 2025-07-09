// apps/api/src/app/routes/auth.route.ts
import express from 'express';
import { AuthService } from '../services/auth.service';

const router = express.Router();
const authService = new AuthService();

router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await authService.signup(username, password);
    res.json({ id: user.id, username: user.username });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const token = await authService.login(username, password);
    res.json({ accessToken: token });
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
});

export default router;
