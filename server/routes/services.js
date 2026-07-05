import express from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import Service from '../models/Service.js';
import User from '../models/User.js';

const router = express.Router();

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const ignoredSearchWords = new Set(['in', 'near', 'at', 'for', 'the', 'and']);

function createSearchRegex(value) {
  const escapedValue = escapeRegex(value);
  return /^[a-z0-9]+$/i.test(value)
    ? new RegExp(`\\b${escapedValue}\\b`, 'i')
    : new RegExp(escapedValue, 'i');
}

function createSearchFields(term) {
  return [
    { title: term },
    { category: term },
    { serviceType: term },
    { city: term },
    { area: term },
    { contactName: term },
    { phone: term },
    { description: term },
  ];
}

function findServices(filter) {
  return Service.find(filter)
    .sort({ ratingAverage: -1, ratingCount: -1, createdAt: -1 })
    .populate('provider', 'name city area phone approved');
}

router.get('/', async (req, res) => {
  const { q, city, category } = req.query;
  const baseFilter = { status: 'approved' };
  const searchText = typeof q === 'string' ? q.trim() : '';

  if (city) baseFilter.city = city;
  if (category) baseFilter.category = category;
  if (searchText) {
    const phrase = createSearchRegex(searchText);
    const terms = searchText
      .split(/\s+/)
      .filter(Boolean)
      .filter((term) => !ignoredSearchWords.has(term.toLowerCase()))
      .map(createSearchRegex);

    const strictFilter = {
      ...baseFilter,
      $or: [
        ...createSearchFields(phrase),
        {
          $and: terms.map((term) => ({
            $or: createSearchFields(term),
          })),
        },
      ],
    };

    let services = await findServices(strictFilter);

    if (services.length === 0 && terms.length > 1) {
      services = await findServices({
        ...baseFilter,
        $or: terms.flatMap(createSearchFields),
      });
    }

    return res.json(services);
  }

  const services = await findServices(baseFilter);
  res.json(services);
});

router.get('/mine', requireAuth, requireRole('provider', 'admin'), async (req, res) => {
  const services = await Service.find({ provider: req.user.id });
  res.json(services);
});

router.post('/', requireAuth, requireRole('provider', 'admin'), async (req, res) => {
  const service = await Service.create({
    ...req.body,
    provider: req.user.id,
    status: req.user.role === 'admin' ? 'approved' : 'pending',
  });

  res.status(201).json(service);
});

router.get('/:id', async (req, res) => {
  const service = await Service.findById(req.params.id).populate('provider', 'name city area phone approved');

  if (!service) {
    return res.status(404).json({ message: 'Service not found' });
  }

  return res.json(service);
});

router.patch('/:id', requireAuth, requireRole('provider', 'admin'), async (req, res) => {
  const filter = req.user.role === 'admin'
    ? { _id: req.params.id }
    : { _id: req.params.id, provider: req.user.id };
  const service = await Service.findOneAndUpdate(filter, req.body, { new: true });

  if (!service) {
    return res.status(404).json({ message: 'Service not found' });
  }

  return res.json(service);
});

router.post('/:id/reviews', requireAuth, async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return res.status(404).json({ message: 'Service not found' });
  }

  service.reviews.push({
    user: req.user.id,
    rating: req.body.rating,
    comment: req.body.comment,
  });

  service.ratingCount = service.reviews.length;
  service.ratingAverage =
    service.reviews.reduce((sum, review) => sum + review.rating, 0) / service.ratingCount;

  await service.save();
  return res.status(201).json(service);
});

router.post('/:id/favorite', requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id);
  const serviceId = req.params.id;
  const exists = user.favorites.some((favorite) => favorite.toString() === serviceId);

  user.favorites = exists
    ? user.favorites.filter((favorite) => favorite.toString() !== serviceId)
    : [...user.favorites, serviceId];

  await user.save();
  return res.json({ favorites: user.favorites });
});

router.patch('/:id/approve', requireAuth, requireRole('admin'), async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
  res.json(service);
});

router.patch('/:id/remove', requireAuth, requireRole('admin'), async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, { status: 'removed' }, { new: true });
  res.json(service);
});

export default router;
