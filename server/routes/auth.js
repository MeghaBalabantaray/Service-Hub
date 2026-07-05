import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

function signToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, name: user.name },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: '7d' },
  );
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'user', city, area, phone } = req.body;
    const user = await User.create({
      name,
      email,
      password,
      role,
      city,
      area,
      phone,
      approved: role === 'user',
    });

    res.status(201).json({
      token: signToken(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role, city: user.city, area: user.area, phone: user.phone },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  return res.json({
    token: signToken(user),
    user: { id: user._id, name: user.name, email: user.email, role: user.role, city: user.city, area: user.area, phone: user.phone },
  });
});

export default router;
