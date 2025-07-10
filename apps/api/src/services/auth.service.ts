import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret';

export class AuthService {
  /**
   * Signup a new user
   * @param username - The username of the user
   * @param password - The password of the user
   * @param email - The email of the user
   * @returns - The user object
   */
  async signup(username: string, password: string, email: string) {
    const existing = await UserModel.findOne({ username, email });
    if (existing) throw new Error('User already exists');

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new UserModel({ username, passwordHash, email });
    await user.save();

    return { id: user._id, username: user.username, email: user.email };
  }

  /**
   * Login a user
   * @param password - The password of the user
   * @param email - The email of the user
   * @returns - The user object
   */
  async login(password: string, email: string) {
    const user = await UserModel.findOne({ email });
    if (!user) throw new Error('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) throw new Error('Invalid credentials');

    const token = jwt.sign(
      { sub: user._id, username: user.username, email: user.email },
      JWT_SECRET,
      {
        expiresIn: '1d',
      }
    );

    return { token, userId: user._id, username: user.username };
  }
}
