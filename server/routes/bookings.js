import express from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  const filter = req.user.role === 'provider'
    ? { provider: req.user.id }
    : { user: req.user.id };
  const bookings = await Booking.find(filter)
    .populate('service', 'title serviceType price city')
    .populate('user provider', 'name email');

  res.json(bookings);
});

router.post('/', requireAuth, async (req, res) => {
  const service = await Service.findById(req.body.serviceId);

  if (!service || service.status !== 'approved') {
    return res.status(404).json({ message: 'Service not available' });
  }

  const booking = await Booking.create({
    service: service._id,
    user: req.user.id,
    provider: service.provider,
    scheduledFor: req.body.scheduledFor,
    address: req.body.address,
    notes: req.body.notes,
  });

  return res.status(201).json(booking);
});

router.patch('/:id/status', requireAuth, requireRole('provider', 'admin'), async (req, res) => {
  const filter = req.user.role === 'admin'
    ? { _id: req.params.id }
    : { _id: req.params.id, provider: req.user.id };

  const booking = await Booking.findOneAndUpdate(
    filter,
    { status: req.body.status },
    { new: true },
  );

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  return res.json(booking);
});

export default router;
