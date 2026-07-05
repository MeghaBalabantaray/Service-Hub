import dotenv from 'dotenv';
import mongoose, { connectDatabase } from './db.js';
import Service from './models/Service.js';
import User from './models/User.js';

dotenv.config();

const seedServices = [
  ['Emergency Electrician', 'Home Services', 'Electrician', 'Bhubaneswar', 'Patia', '+91 98765 41021', 249, 4.8, 126, 'Ramesh Kumar', 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=80', 'Switchboard, wiring, MCB, fan, light fitting, inverter, and urgent power fault repair near Patia.'],
  ['Leakage & Tap Plumber', 'Home Services', 'Plumber', 'Bhubaneswar', 'Jayadev Vihar', '+91 98765 41022', 299, 4.7, 104, 'Sanjay Behera', 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=900&q=80', 'Tap repair, pipe leakage, bathroom fitting, water tank connection, and kitchen sink service.'],
  ['Door & Furniture Carpenter', 'Home Services', 'Carpenter', 'Bhubaneswar', 'Khandagiri', '+91 98765 41023', 349, 4.6, 92, 'Ajay Sahoo', 'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?auto=format&fit=crop&w=900&q=80', 'Door lock fitting, shelf repair, modular furniture work, bed repair, and wardrobe service.'],
  ['AC Repair & Gas Filling', 'Home Services', 'AC Repair', 'Bhubaneswar', 'Saheed Nagar', '+91 98765 41024', 499, 4.9, 148, 'CoolAir Technicians', 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=900&q=80', 'Split/window AC servicing, cooling issue, gas filling, water leakage, and installation support.'],
  ['Bike & Car Mechanic', 'Home Services', 'Mechanic', 'Bhubaneswar', 'Rasulgarh', '+91 98765 41026', 399, 4.5, 83, 'Mohan Auto Care', 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=900&q=80', 'Puncture, battery jump, engine check, brake service, doorstep bike and car mechanic support.'],
  ['Spark Home Deep Cleaning', 'Home Services', 'House Cleaning', 'Mumbai', 'Andheri West', '+91 98765 41027', 899, 4.8, 214, 'CleanNest Services', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80', 'Full-room cleaning, bathroom sanitization, kitchen degreasing, and sofa vacuuming with verified staff.'],
  ['Daily Home Cook', 'Home Services', 'Cook', 'Bhubaneswar', 'Old Town', '+91 98765 41028', 600, 4.7, 119, 'Anita Das', 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=80', 'Breakfast, lunch, dinner, Odia meals, North Indian meals, and monthly home cooking plans.'],
  ['Verified Maid Service', 'Home Services', 'Maid', 'Bhubaneswar', 'Chandrasekharpur', '+91 98765 41029', 1500, 4.6, 76, 'Sushree Nayak', 'https://images.unsplash.com/photo-1581578017426-04fbc2bb4d35?auto=format&fit=crop&w=900&q=80', 'Daily sweeping, mopping, dish washing, dusting, and verified household help for nearby homes.'],
  ['Wash & Iron Laundry', 'Home Services', 'Laundry', 'Bhubaneswar', 'Infocity', '+91 98765 41030', 99, 4.5, 68, 'FreshFold Laundry', 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=900&q=80', 'Pickup and delivery for wash, fold, iron, dry cleaning, bedsheets, curtains, and office wear.'],
  ['UrbanStay PG for Students', 'Accommodation', 'PG', 'Bengaluru', 'BTM Layout', '+91 98765 41031', 6500, 4.6, 88, 'UrbanStay Living', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80', 'Furnished PG with meals, Wi-Fi, laundry, security, and easy access to metro and colleges.'],
  ['Secure Student Hostel', 'Accommodation', 'Hostel', 'Pune', 'Kothrud', '+91 98765 41036', 5200, 4.5, 74, 'StudyStay Hostel', 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=900&q=80', 'Separate boys and girls hostel rooms with meals, CCTV, study area, Wi-Fi, and monthly rent plans.'],
  ['2BHK Flat for Rent', 'Accommodation', 'Flat Rent', 'Delhi', 'Saket', '+91 98765 41037', 18500, 4.6, 53, 'NorthKey Rentals', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80', 'Semi-furnished family flat with modular kitchen, parking, lift, security, and quick owner visit.'],
  ['Single Room Near College', 'Accommodation', 'Room Rent', 'Bhubaneswar', 'Vani Vihar', '+91 98765 41038', 4200, 4.4, 61, 'RoomMate Homes', 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=900&q=80', 'Single and shared rooms for students and working professionals with bed, table, fan, and water.'],
  ['Quick Food Delivery', 'Food', 'Food Delivery', 'Mumbai', 'Powai', '+91 98765 41039', 49, 4.6, 208, 'MealDash Express', 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=900&q=80', 'Fast delivery from local kitchens, snacks, meals, desserts, beverages, and late evening orders.'],
  ['Family Restaurant Booking', 'Food', 'Nearby Restaurants', 'Hyderabad', 'Madhapur', '+91 98765 41040', 350, 4.7, 156, 'SpiceCourt Restaurant', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80', 'Nearby restaurant table booking, party meals, family dinner, takeaway, and corporate lunch orders.'],
  ['Daily Fresh Tiffin', 'Food', 'Tiffin Service', 'Pune', 'Hinjewadi', '+91 98765 41032', 120, 4.7, 173, 'GharKaKhana', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80', 'Home-style vegetarian and non-vegetarian lunch plans with same-day pause and weekly billing.'],
  ['RideEasy Bike Rental', 'Vehicle Rental', 'Bike Rental', 'Delhi', 'Lajpat Nagar', '+91 98765 41033', 499, 4.5, 131, 'RideEasy Mobility', 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80', 'Scooters and bikes for daily or weekly rental with helmets, insurance, and doorstep pickup.'],
  ['Self Drive Car Rental', 'Vehicle Rental', 'Car Rental', 'Bengaluru', 'Indiranagar', '+91 98765 41041', 1799, 4.6, 94, 'DriveMore Cars', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80', 'Hatchback, sedan, and SUV rentals with self-drive and chauffeur options for daily or weekend use.'],
  ['Local & Airport Taxi', 'Vehicle Rental', 'Taxi Booking', 'Bhubaneswar', 'Airport Square', '+91 98765 41042', 299, 4.8, 121, 'SwiftCab Bhubaneswar', 'https://images.unsplash.com/photo-1511527844068-006b95d162c2?auto=format&fit=crop&w=900&q=80', 'Local taxi, airport drop, railway pickup, outstation rides, hourly rentals, and verified drivers.'],
  ['Nearby Tourist Places Guide', 'Travel', 'Tourist Places', 'Bhubaneswar', 'Old Town', '+91 98765 41043', 799, 4.7, 82, 'Heritage Walks', 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=900&q=80', 'Lingaraj Temple, Dhauli, Khandagiri, Udayagiri, local guide support, cab planning, and day routes.'],
  ['Budget Hotel Booking', 'Travel', 'Hotels', 'Delhi', 'Karol Bagh', '+91 98765 41044', 1499, 4.4, 103, 'ComfortStay Hotels', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80', 'Budget and premium hotel rooms with breakfast, early check-in, family rooms, and local transport help.'],
  ['Weekend Hill Travel Package', 'Travel', 'Travel Packages', 'Bhubaneswar', 'Master Canteen', '+91 98765 41034', 3499, 4.9, 65, 'TrailMate Tours', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80', 'Two-day package with hotel, cab, breakfast, guided sightseeing, and flexible group slots.'],
  ['General Doctor Consultation', 'Other Services', 'Doctor', 'Bhubaneswar', 'Nayapalli', '+91 98765 41025', 400, 4.8, 177, 'Dr. Priya Mishra', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80', 'Fever, cold, BP, diabetes follow-up, basic consultation, and nearby clinic appointment slots.'],
  ['Home Tutor for Maths', 'Other Services', 'Tutor', 'Bhubaneswar', 'Baramunda', '+91 98765 41045', 500, 4.8, 89, 'Rahul Patnaik', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80', 'Class 6 to 12 maths and science tuition, weekly tests, doubt clearing, and board exam preparation.'],
  ['Beauty Salon at Home', 'Other Services', 'Beauty Salon', 'Mumbai', 'Bandra', '+91 98765 41046', 799, 4.7, 132, 'GlowUp Salon', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80', 'Haircut, facial, cleanup, waxing, threading, party makeup, and bridal trial appointments.'],
  ['Personal Gym Trainer', 'Other Services', 'Gym Trainer', 'Hyderabad', 'Gachibowli', '+91 98765 41035', 699, 4.7, 97, 'FitForm Studio', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80', 'Certified trainer for weight loss, strength plans, posture correction, and home workout programs.'],
];

function emailFor(name, index) {
  return `${name.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.|\.$/g, '')}.${index}@servicehub.local`;
}

async function seed() {
  await connectDatabase();

  await Service.deleteMany({});
  await User.deleteMany({ email: /@servicehub\.local$/ });

  for (const [index, row] of seedServices.entries()) {
    const [
      title,
      category,
      serviceType,
      city,
      area,
      phone,
      price,
      ratingAverage,
      ratingCount,
      contactName,
      image,
      description,
    ] = row;

    const provider = await User.create({
      name: contactName,
      email: emailFor(contactName, index + 1),
      password: 'provider123',
      role: 'provider',
      city,
      area,
      phone,
      approved: true,
    });

    await Service.create({
      title,
      category,
      serviceType,
      city,
      area,
      contactName,
      phone,
      price,
      description,
      images: [image],
      provider: provider._id,
      status: 'approved',
      ratingAverage,
      ratingCount,
    });
  }

  console.log(`Seeded ${seedServices.length} services into MongoDB.`);
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
