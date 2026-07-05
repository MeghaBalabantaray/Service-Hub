import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter,
  NavLink,
  Route,
  Routes,
  useParams,
} from 'react-router-dom';
import {
  BarChart3,
  Building2,
  CalendarCheck,
  Car,
  CheckCircle2,
  Heart,
  Home,
  MapPin,
  Menu,
  Phone,
  Search,
  ShieldCheck,
  Star,
  Store,
  Stethoscope,
  UserPlus,
  Utensils,
  X,
} from 'lucide-react';
import './styles.css';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
});

function normalizeService(item) {
  return {
    id: item._id,
    title: item.title,
    category: item.category,
    service: item.serviceType,
    city: item.city,
    area: item.area,
    phone: item.phone,
    price: item.price,
    rating: item.ratingAverage || 0,
    reviews: item.ratingCount || item.reviews?.length || 0,
    provider: item.contactName || item.provider?.name || 'Verified Provider',
    image: item.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
    description: item.description,
  };
}

const categories = [
  {
    name: 'Home Services',
    icon: Home,
    services: ['Electrician', 'Plumber', 'Carpenter', 'AC Repair', 'Mechanic', 'House Cleaning', 'Cook', 'Maid', 'Laundry'],
  },
  {
    name: 'Accommodation',
    icon: Building2,
    services: ['PG', 'Hostel', 'Flat Rent', 'Room Rent'],
  },
  {
    name: 'Food',
    icon: Utensils,
    services: ['Food Delivery', 'Nearby Restaurants', 'Tiffin Service'],
  },
  {
    name: 'Vehicle Rental',
    icon: Car,
    services: ['Bike Rental', 'Car Rental', 'Taxi Booking'],
  },
  {
    name: 'Travel',
    icon: MapPin,
    services: ['Tourist Places', 'Hotels', 'Travel Packages'],
  },
  {
    name: 'Other Services',
    icon: Stethoscope,
    services: ['Doctor', 'Tutor', 'Beauty Salon', 'Gym Trainer'],
  },
];

const cityList = ['All Cities', 'Mumbai', 'Delhi', 'Bengaluru', 'Pune', 'Hyderabad', 'Bhubaneswar'];
const quickSearches = ['Electrician', 'AC Repair', 'PG', 'Room Bhubaneswar', 'Food Delivery', 'Taxi Booking', 'Doctor'];

const listings = [
  {
    id: 'bright-electrician',
    title: 'Emergency Electrician',
    category: 'Home Services',
    service: 'Electrician',
    city: 'Bhubaneswar',
    area: 'Patia',
    phone: '+91 98765 41021',
    price: 249,
    rating: 4.8,
    reviews: 126,
    provider: 'Ramesh Kumar',
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=80',
    description: 'Switchboard, wiring, MCB, fan, light fitting, inverter, and urgent power fault repair near Patia.',
  },
  {
    id: 'quick-plumber',
    title: 'Leakage & Tap Plumber',
    category: 'Home Services',
    service: 'Plumber',
    city: 'Bhubaneswar',
    area: 'Jayadev Vihar',
    phone: '+91 98765 41022',
    price: 299,
    rating: 4.7,
    reviews: 104,
    provider: 'Sanjay Behera',
    image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=900&q=80',
    description: 'Tap repair, pipe leakage, bathroom fitting, water tank connection, and kitchen sink service.',
  },
  {
    id: 'woodcraft-carpenter',
    title: 'Door & Furniture Carpenter',
    category: 'Home Services',
    service: 'Carpenter',
    city: 'Bhubaneswar',
    area: 'Khandagiri',
    phone: '+91 98765 41023',
    price: 349,
    rating: 4.6,
    reviews: 92,
    provider: 'Ajay Sahoo',
    image: 'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?auto=format&fit=crop&w=900&q=80',
    description: 'Door lock fitting, shelf repair, modular furniture work, bed repair, and wardrobe service.',
  },
  {
    id: 'cool-air-ac',
    title: 'AC Repair & Gas Filling',
    category: 'Home Services',
    service: 'AC Repair',
    city: 'Bhubaneswar',
    area: 'Saheed Nagar',
    phone: '+91 98765 41024',
    price: 499,
    rating: 4.9,
    reviews: 148,
    provider: 'CoolAir Technicians',
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=900&q=80',
    description: 'Split/window AC servicing, cooling issue, gas filling, water leakage, and installation support.',
  },
  {
    id: 'family-doctor',
    title: 'General Doctor Consultation',
    category: 'Other Services',
    service: 'Doctor',
    city: 'Bhubaneswar',
    area: 'Nayapalli',
    phone: '+91 98765 41025',
    price: 400,
    rating: 4.8,
    reviews: 177,
    provider: 'Dr. Priya Mishra',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80',
    description: 'Fever, cold, BP, diabetes follow-up, basic consultation, and nearby clinic appointment slots.',
  },
  {
    id: 'auto-mechanic',
    title: 'Bike & Car Mechanic',
    category: 'Home Services',
    service: 'Mechanic',
    city: 'Bhubaneswar',
    area: 'Rasulgarh',
    phone: '+91 98765 41026',
    price: 399,
    rating: 4.5,
    reviews: 83,
    provider: 'Mohan Auto Care',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=900&q=80',
    description: 'Puncture, battery jump, engine check, brake service, doorstep bike and car mechanic support.',
  },
  {
    id: 'clean-home-pro',
    title: 'Spark Home Deep Cleaning',
    category: 'Home Services',
    service: 'House Cleaning',
    city: 'Mumbai',
    area: 'Andheri West',
    phone: '+91 98765 41027',
    price: 899,
    rating: 4.8,
    reviews: 214,
    provider: 'CleanNest Services',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80',
    description: 'Full-room cleaning, bathroom sanitization, kitchen degreasing, and sofa vacuuming with verified staff.',
  },
  {
    id: 'home-cook',
    title: 'Daily Home Cook',
    category: 'Home Services',
    service: 'Cook',
    city: 'Bhubaneswar',
    area: 'Old Town',
    phone: '+91 98765 41028',
    price: 600,
    rating: 4.7,
    reviews: 119,
    provider: 'Anita Das',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=80',
    description: 'Breakfast, lunch, dinner, Odia meals, North Indian meals, and monthly home cooking plans.',
  },
  {
    id: 'trusted-maid',
    title: 'Verified Maid Service',
    category: 'Home Services',
    service: 'Maid',
    city: 'Bhubaneswar',
    area: 'Chandrasekharpur',
    phone: '+91 98765 41029',
    price: 1500,
    rating: 4.6,
    reviews: 76,
    provider: 'Sushree Nayak',
    image: 'https://images.unsplash.com/photo-1581578017426-04fbc2bb4d35?auto=format&fit=crop&w=900&q=80',
    description: 'Daily sweeping, mopping, dish washing, dusting, and verified household help for nearby homes.',
  },
  {
    id: 'fresh-laundry',
    title: 'Wash & Iron Laundry',
    category: 'Home Services',
    service: 'Laundry',
    city: 'Bhubaneswar',
    area: 'Infocity',
    phone: '+91 98765 41030',
    price: 99,
    rating: 4.5,
    reviews: 68,
    provider: 'FreshFold Laundry',
    image: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=900&q=80',
    description: 'Pickup and delivery for wash, fold, iron, dry cleaning, bedsheets, curtains, and office wear.',
  },
  {
    id: 'urban-pg',
    title: 'UrbanStay PG for Students',
    category: 'Accommodation',
    service: 'PG',
    city: 'Bengaluru',
    area: 'BTM Layout',
    phone: '+91 98765 41031',
    price: 6500,
    rating: 4.6,
    reviews: 88,
    provider: 'UrbanStay Living',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80',
    description: 'Furnished PG with meals, Wi-Fi, laundry, security, and easy access to metro and colleges.',
  },
  {
    id: 'safe-hostel',
    title: 'Secure Student Hostel',
    category: 'Accommodation',
    service: 'Hostel',
    city: 'Pune',
    area: 'Kothrud',
    phone: '+91 98765 41036',
    price: 5200,
    rating: 4.5,
    reviews: 74,
    provider: 'StudyStay Hostel',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=900&q=80',
    description: 'Separate boys and girls hostel rooms with meals, CCTV, study area, Wi-Fi, and monthly rent plans.',
  },
  {
    id: 'family-flat-rent',
    title: '2BHK Flat for Rent',
    category: 'Accommodation',
    service: 'Flat Rent',
    city: 'Delhi',
    area: 'Saket',
    phone: '+91 98765 41037',
    price: 18500,
    rating: 4.6,
    reviews: 53,
    provider: 'NorthKey Rentals',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80',
    description: 'Semi-furnished family flat with modular kitchen, parking, lift, security, and quick owner visit.',
  },
  {
    id: 'single-room-rent',
    title: 'Single Room Near College',
    category: 'Accommodation',
    service: 'Room Rent',
    city: 'Bhubaneswar',
    area: 'Vani Vihar',
    phone: '+91 98765 41038',
    price: 4200,
    rating: 4.4,
    reviews: 61,
    provider: 'RoomMate Homes',
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=900&q=80',
    description: 'Single and shared rooms for students and working professionals with bed, table, fan, and water.',
  },
  {
    id: 'quick-food-delivery',
    title: 'Quick Food Delivery',
    category: 'Food',
    service: 'Food Delivery',
    city: 'Mumbai',
    area: 'Powai',
    phone: '+91 98765 41039',
    price: 49,
    rating: 4.6,
    reviews: 208,
    provider: 'MealDash Express',
    image: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=900&q=80',
    description: 'Fast delivery from local kitchens, snacks, meals, desserts, beverages, and late evening orders.',
  },
  {
    id: 'nearby-restaurant',
    title: 'Family Restaurant Booking',
    category: 'Food',
    service: 'Nearby Restaurants',
    city: 'Hyderabad',
    area: 'Madhapur',
    phone: '+91 98765 41040',
    price: 350,
    rating: 4.7,
    reviews: 156,
    provider: 'SpiceCourt Restaurant',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80',
    description: 'Nearby restaurant table booking, party meals, family dinner, takeaway, and corporate lunch orders.',
  },
  {
    id: 'daily-tiffin',
    title: 'Daily Fresh Tiffin',
    category: 'Food',
    service: 'Tiffin Service',
    city: 'Pune',
    area: 'Hinjewadi',
    phone: '+91 98765 41032',
    price: 120,
    rating: 4.7,
    reviews: 173,
    provider: 'GharKaKhana',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80',
    description: 'Home-style vegetarian and non-vegetarian lunch plans with same-day pause and weekly billing.',
  },
  {
    id: 'ride-easy',
    title: 'RideEasy Bike Rental',
    category: 'Vehicle Rental',
    service: 'Bike Rental',
    city: 'Delhi',
    area: 'Lajpat Nagar',
    phone: '+91 98765 41033',
    price: 499,
    rating: 4.5,
    reviews: 131,
    provider: 'RideEasy Mobility',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80',
    description: 'Scooters and bikes for daily or weekly rental with helmets, insurance, and doorstep pickup.',
  },
  {
    id: 'city-car-rental',
    title: 'Self Drive Car Rental',
    category: 'Vehicle Rental',
    service: 'Car Rental',
    city: 'Bengaluru',
    area: 'Indiranagar',
    phone: '+91 98765 41041',
    price: 1799,
    rating: 4.6,
    reviews: 94,
    provider: 'DriveMore Cars',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80',
    description: 'Hatchback, sedan, and SUV rentals with self-drive and chauffeur options for daily or weekend use.',
  },
  {
    id: 'airport-taxi',
    title: 'Local & Airport Taxi',
    category: 'Vehicle Rental',
    service: 'Taxi Booking',
    city: 'Bhubaneswar',
    area: 'Airport Square',
    phone: '+91 98765 41042',
    price: 299,
    rating: 4.8,
    reviews: 121,
    provider: 'SwiftCab Bhubaneswar',
    image: 'https://images.unsplash.com/photo-1511527844068-006b95d162c2?auto=format&fit=crop&w=900&q=80',
    description: 'Local taxi, airport drop, railway pickup, outstation rides, hourly rentals, and verified drivers.',
  },
  {
    id: 'city-tourist-places',
    title: 'Nearby Tourist Places Guide',
    category: 'Travel',
    service: 'Tourist Places',
    city: 'Bhubaneswar',
    area: 'Old Town',
    phone: '+91 98765 41043',
    price: 799,
    rating: 4.7,
    reviews: 82,
    provider: 'Heritage Walks',
    image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=900&q=80',
    description: 'Lingaraj Temple, Dhauli, Khandagiri, Udayagiri, local guide support, cab planning, and day routes.',
  },
  {
    id: 'comfort-hotels',
    title: 'Budget Hotel Booking',
    category: 'Travel',
    service: 'Hotels',
    city: 'Delhi',
    area: 'Karol Bagh',
    phone: '+91 98765 41044',
    price: 1499,
    rating: 4.4,
    reviews: 103,
    provider: 'ComfortStay Hotels',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80',
    description: 'Budget and premium hotel rooms with breakfast, early check-in, family rooms, and local transport help.',
  },
  {
    id: 'weekend-hills',
    title: 'Weekend Hill Travel Package',
    category: 'Travel',
    service: 'Travel Packages',
    city: 'Bhubaneswar',
    area: 'Master Canteen',
    phone: '+91 98765 41034',
    price: 3499,
    rating: 4.9,
    reviews: 65,
    provider: 'TrailMate Tours',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    description: 'Two-day package with hotel, cab, breakfast, guided sightseeing, and flexible group slots.',
  },
  {
    id: 'math-tutor',
    title: 'Home Tutor for Maths',
    category: 'Other Services',
    service: 'Tutor',
    city: 'Bhubaneswar',
    area: 'Baramunda',
    phone: '+91 98765 41045',
    price: 500,
    rating: 4.8,
    reviews: 89,
    provider: 'Rahul Patnaik',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80',
    description: 'Class 6 to 12 maths and science tuition, weekly tests, doubt clearing, and board exam preparation.',
  },
  {
    id: 'beauty-salon-home',
    title: 'Beauty Salon at Home',
    category: 'Other Services',
    service: 'Beauty Salon',
    city: 'Mumbai',
    area: 'Bandra',
    phone: '+91 98765 41046',
    price: 799,
    rating: 4.7,
    reviews: 132,
    provider: 'GlowUp Salon',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80',
    description: 'Haircut, facial, cleanup, waxing, threading, party makeup, and bridal trial appointments.',
  },
  {
    id: 'fit-coach',
    title: 'Personal Gym Trainer',
    category: 'Other Services',
    service: 'Gym Trainer',
    city: 'Hyderabad',
    area: 'Gachibowli',
    phone: '+91 98765 41035',
    price: 699,
    rating: 4.7,
    reviews: 97,
    provider: 'FitForm Studio',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80',
    description: 'Certified trainer for weight loss, strength plans, posture correction, and home workout programs.',
  },
];

function App() {
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('All Cities');
  const [category, setCategory] = useState('All Categories');
  const [favorites, setFavorites] = useState([]);
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadServices() {
      setIsLoading(true);
      setLoadError('');

      try {
        const response = await api.get('/services', {
          signal: controller.signal,
          params: {
            q: debouncedQuery || undefined,
            city: city === 'All Cities' ? undefined : city,
            category: category === 'All Categories' ? undefined : category,
          },
        });
        setListings(response.data.map(normalizeService));
      } catch (error) {
        if (!axios.isCancel(error)) {
          const message = error.response
            ? 'Server ne services load karte waqt error diya. Terminal logs check karein.'
            : 'Backend API connect nahi ho paayi. npm run dev se frontend aur backend dono start karein.';
          setLoadError(message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadServices();

    return () => controller.abort();
  }, [category, city, debouncedQuery]);

  const toggleFavorite = (id) => {
    setFavorites((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Header />
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <Marketplace
                  query={query}
                  setQuery={setQuery}
                  city={city}
                  setCity={setCity}
                  category={category}
                  setCategory={setCategory}
                  listings={listings}
                  isLoading={isLoading}
                  loadError={loadError}
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                />
              }
            />
            <Route path="/services/:id" element={<ServiceDetails favorites={favorites} toggleFavorite={toggleFavorite} />} />
            <Route path="/provider" element={<ProviderDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/auth" element={<AuthPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

function Header() {
  return (
    <header className="topbar">
      <NavLink to="/" className="brand" aria-label="ServiceHub home">
        <span className="brand-mark">S</span>
        <span>ServiceHub</span>
      </NavLink>
      <nav className="nav-links" aria-label="Primary navigation">
        <NavLink to="/">Services</NavLink>
        <NavLink to="/provider">Provider</NavLink>
        <NavLink to="/admin">Admin</NavLink>
        <NavLink to="/auth">Login</NavLink>
      </nav>
      <button className="icon-button" aria-label="Open menu" type="button">
        <Menu size={20} />
      </button>
    </header>
  );
}

function Marketplace(props) {
  const {
    query,
    setQuery,
    city,
    setCity,
    category,
    setCategory,
    listings,
    isLoading,
    loadError,
    favorites,
    toggleFavorite,
  } = props;

  const hasFilters = query || city !== 'All Cities' || category !== 'All Categories';

  const resetSearch = () => {
    setQuery('');
    setCity('All Cities');
    setCategory('All Categories');
  };

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Book verified local services</p>
          <h1>ServiceHub</h1>
          <p>
            Search home services, rooms, tiffins, rentals, travel, and trusted professionals from one place.
          </p>
        </div>
        <form className="search-panel" onSubmit={(event) => event.preventDefault()}>
          <label className="search-box">
            <Search size={20} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search electrician, AC repair, PG, food, city..."
              aria-label="Search services"
            />
            {query ? (
              <button className="clear-search" type="button" onClick={() => setQuery('')} aria-label="Clear search">
                <X size={18} />
              </button>
            ) : null}
          </label>
          <select value={city} onChange={(event) => setCity(event.target.value)} aria-label="Filter by city">
            {cityList.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter by category">
            <option>All Categories</option>
            {categories.map((item) => (
              <option key={item.name}>{item.name}</option>
            ))}
          </select>
          <button className="search-submit" type="submit">
            <Search size={18} />
            Search
          </button>
        </form>
        <div className="quick-searches" aria-label="Quick searches">
          {quickSearches.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setQuery(item);
                setCategory('All Categories');
              }}
            >
              {item}
            </button>
          ))}
          {hasFilters ? (
            <button className="reset-filter" type="button" onClick={resetSearch}>
              Clear all
            </button>
          ) : null}
        </div>
      </section>

      <section className="category-strip" aria-label="Service categories">
        {categories.map((item) => {
          const Icon = item.icon;
          return (
            <button
              className={category === item.name ? 'category-pill active' : 'category-pill'}
              key={item.name}
              onClick={() => {
                setQuery('');
                setCategory(category === item.name ? 'All Categories' : item.name);
              }}
              type="button"
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </section>

      <section className="content-grid">
        <aside className="service-menu">
          <h2>Popular Services</h2>
          {categories.map((group) => (
            <div key={group.name} className="menu-group">
              <h3>{group.name}</h3>
              <div>
                {group.services.map((service) => (
                  <button
                    key={service}
                    type="button"
                    onClick={() => {
                      setQuery(service);
                      setCategory(group.name);
                    }}
                  >
                    {service}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </aside>

        <section className="listings" aria-label="Available services">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Available now</p>
              <h2>{listings.length} matching services</h2>
            </div>
            <NavLink to="/provider" className="text-action">List your service</NavLink>
          </div>
          {isLoading ? (
            <div className="empty-state">
              <Search size={26} />
              <h3>Loading services from database</h3>
              <p>MongoDB se latest listings aa rahi hain.</p>
            </div>
          ) : loadError ? (
            <div className="empty-state">
              <Search size={26} />
              <h3>Database connection issue</h3>
              <p>{loadError}</p>
            </div>
          ) : listings.length > 0 ? (
            <div className="card-grid">
              {listings.map((item) => (
                <ServiceCard
                  key={item.id}
                  item={item}
                  isFavorite={favorites.includes(item.id)}
                  toggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Search size={26} />
              <h3>No matching service found</h3>
              <p>Try another area, city, service name, or provider phone number.</p>
            </div>
          )}
        </section>
      </section>
    </>
  );
}

function ServiceCard({ item, isFavorite, toggleFavorite }) {
  return (
    <article className="service-card">
      <img src={item.image} alt="" />
      <div className="card-body">
        <div className="card-topline">
          <span>{item.service}</span>
          <button
            className={isFavorite ? 'favorite active' : 'favorite'}
            onClick={() => toggleFavorite(item.id)}
            aria-label={isFavorite ? 'Remove favorite' : 'Save favorite'}
            type="button"
          >
            <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        <div className="meta-row">
          <span><MapPin size={16} />{item.area}, {item.city}</span>
          <span><Star size={16} fill="currentColor" />{item.rating} ({item.reviews})</span>
        </div>
        <div className="contact-row">
          <span>{item.provider}</span>
          <a href={`tel:${item.phone.replaceAll(' ', '')}`}><Phone size={16} />{item.phone}</a>
        </div>
        <div className="card-actions">
          <strong>₹{item.price.toLocaleString('en-IN')}</strong>
          <NavLink to={`/services/${item.id}`}>View & Book</NavLink>
        </div>
      </div>
    </article>
  );
}

function ServiceDetails({ favorites, toggleFavorite }) {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadService() {
      setLoadError('');

      try {
        const response = await api.get(`/services/${id}`, { signal: controller.signal });
        setItem(normalizeService(response.data));
      } catch (error) {
        if (!axios.isCancel(error)) {
          setLoadError('Service details database se load nahi ho paayi.');
        }
      }
    }

    loadService();

    return () => controller.abort();
  }, [id]);

  if (loadError) {
    return (
      <section className="dashboard">
        <div className="empty-state">
          <Search size={26} />
          <h3>Service not available</h3>
          <p>{loadError}</p>
        </div>
      </section>
    );
  }

  if (!item) {
    return (
      <section className="dashboard">
        <div className="empty-state">
          <Search size={26} />
          <h3>Loading service details</h3>
          <p>MongoDB se selected listing aa rahi hai.</p>
        </div>
      </section>
    );
  }

  const isFavorite = favorites.includes(item.id);

  return (
    <section className="details-layout">
      <img src={item.image} alt="" className="details-image" />
      <div className="details-panel">
        <span className="badge">{item.category}</span>
        <h1>{item.title}</h1>
        <p>{item.description}</p>
        <div className="details-stats">
          <span><MapPin size={18} />{item.city}</span>
          <span><MapPin size={18} />{item.area}</span>
          <span><Phone size={18} />{item.phone}</span>
          <span><Star size={18} fill="currentColor" />{item.rating} rating</span>
          <span><ShieldCheck size={18} />Verified provider</span>
        </div>
        <div className="provider-box">
          <span>Provider</span>
          <strong>{item.provider}</strong>
          <a href={`tel:${item.phone.replaceAll(' ', '')}`}><Phone size={18} />Call now</a>
        </div>
        <div className="booking-box">
          <div>
            <span>Starting price</span>
            <strong>₹{item.price.toLocaleString('en-IN')}</strong>
          </div>
          <button type="button"><CalendarCheck size={18} />Book Service</button>
          <button className="secondary" type="button" onClick={() => toggleFavorite(item.id)}>
            <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
            {isFavorite ? 'Saved' : 'Save'}
          </button>
        </div>
        <div className="review-box">
          <h2>Reviews</h2>
          <p>Customers like the punctual staff, clear pricing, and simple booking updates.</p>
          <div className="rating-input" aria-label="Rate this service">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button" aria-label={`${star} stars`}>
                <Star size={22} fill="currentColor" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProviderDashboard() {
  return (
    <section className="dashboard">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Provider Side</p>
          <h1>Manage services and bookings</h1>
        </div>
        <button type="button"><UserPlus size={18} />Register Provider</button>
      </div>
      <div className="dashboard-grid">
        <Panel title="Add Service" icon={Store}>
          <input placeholder="Service title" />
          <select>
            {categories.map((item) => <option key={item.name}>{item.name}</option>)}
          </select>
          <select>
            {categories.flatMap((item) => item.services).map((service) => <option key={service}>{service}</option>)}
          </select>
          <input placeholder="City" />
          <input placeholder="Nearby area / locality" />
          <input placeholder="Provider / contact name" />
          <input placeholder="Contact number" />
          <input placeholder="Price" type="number" />
          <input placeholder="Service details" />
          <button type="button">Publish Listing</button>
        </Panel>
        <Panel title="Upload Images" icon={CheckCircle2}>
          <div className="upload-box">Drop service photos here</div>
          <button type="button">Upload</button>
        </Panel>
        <Panel title="Bookings" icon={CalendarCheck}>
          {['House cleaning', 'Bike rental', 'Tiffin weekly plan'].map((item, index) => (
            <div className="booking-row" key={item}>
              <span>{item}</span>
              <strong>{index === 0 ? 'New' : 'Confirmed'}</strong>
            </div>
          ))}
        </Panel>
      </div>
    </section>
  );
}

function AdminDashboard() {
  return (
    <section className="dashboard">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Admin Side</p>
          <h1>Approve providers and monitor quality</h1>
        </div>
      </div>
      <div className="stat-grid">
        <Stat label="Users" value="18,420" />
        <Stat label="Providers Pending" value="42" />
        <Stat label="Bookings" value="3,108" />
        <Stat label="Fake Listings Removed" value="117" />
      </div>
      <div className="dashboard-grid">
        <Panel title="Analytics" icon={BarChart3}>
          <div className="bars">
            <span style={{ height: '64%' }} />
            <span style={{ height: '42%' }} />
            <span style={{ height: '88%' }} />
            <span style={{ height: '70%' }} />
            <span style={{ height: '52%' }} />
          </div>
        </Panel>
        <Panel title="Provider Approvals" icon={ShieldCheck}>
          {['CleanNest Services', 'UrbanStay Living', 'FitForm Studio'].map((name) => (
            <div className="booking-row" key={name}>
              <span>{name}</span>
              <button type="button">Approve</button>
            </div>
          ))}
        </Panel>
      </div>
    </section>
  );
}

function AuthPage() {
  return (
    <section className="auth-layout">
      <div>
        <p className="eyebrow">Register or login</p>
        <h1>Join ServiceHub</h1>
        <p>Users can book services, save favorites, and write reviews. Providers can publish listings and manage bookings.</p>
      </div>
      <form className="auth-card">
        <input placeholder="Full name" />
        <input placeholder="Email" type="email" />
        <input placeholder="Password" type="password" />
        <select>
          <option>User</option>
          <option>Service Provider</option>
          <option>Admin</option>
        </select>
        <button type="button">Create Account</button>
      </form>
    </section>
  );
}

function Panel({ title, icon: Icon, children }) {
  return (
    <article className="panel">
      <h2><Icon size={20} />{title}</h2>
      {children}
    </article>
  );
}

function Stat({ label, value }) {
  return (
    <article className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

createRoot(document.getElementById('root')).render(<App />);
