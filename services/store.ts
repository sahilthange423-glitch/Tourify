import { Destination, TourPackage, User, Booking, UserRole, BookingWithDetails } from '../types';

// Initial Seed Data
const SEED_DESTINATIONS: Destination[] = [
  {
    id: 'd1',
    name: 'Paris',
    country: 'France',
    description: 'The City of Light, known for its cafe culture, Eiffel Tower, and the Louvre.',
    imageUrl: 'https://picsum.photos/id/1036/800/600',
  },
  {
    id: 'd2',
    name: 'Kyoto',
    country: 'Japan',
    description: 'Famous for its classical Buddhist temples, as well as gardens, imperial palaces, Shinto shrines and traditional wooden houses.',
    imageUrl: 'https://picsum.photos/id/1018/800/600',
  },
  {
    id: 'd3',
    name: 'Santorini',
    country: 'Greece',
    description: 'A head-turner of an island, famous for its whitewashed houses and stunning sunsets.',
    imageUrl: 'https://picsum.photos/id/1050/800/600',
  },
  {
    id: 'd4',
    name: 'Bali',
    country: 'Indonesia',
    description: 'An Indonesian island known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs.',
    imageUrl: 'https://picsum.photos/id/1047/800/600',
  }
];

const SEED_PACKAGES: TourPackage[] = [
  {
    id: 'p1',
    destinationId: 'd1',
    title: 'Parisian Romance',
    description: 'Experience the romance of Paris with a dinner cruise on the Seine and a private tour of the Louvre.',
    durationDays: 5,
    price: 1500,
    rating: 4.8,
    highlights: ['Eiffel Tower Summit', 'Seine River Cruise', 'Louvre Museum', 'Montmartre Walk'],
    imageUrl: 'https://picsum.photos/id/1036/800/600',
  },
  {
    id: 'p2',
    destinationId: 'd2',
    title: 'Kyoto Cultural Dive',
    description: 'Immerse yourself in ancient Japanese culture, tea ceremonies, and temple visits.',
    durationDays: 7,
    price: 2100,
    rating: 4.9,
    highlights: ['Kinkaku-ji', 'Fushimi Inari', 'Tea Ceremony', 'Arashiyama Bamboo Grove'],
    imageUrl: 'https://picsum.photos/id/1018/800/600',
  },
  {
    id: 'p3',
    destinationId: 'd3',
    title: 'Greek Island Hopping',
    description: 'Explore the gems of the Aegean sea with luxury ferry rides and sunset dinners.',
    durationDays: 6,
    price: 1800,
    rating: 4.7,
    highlights: ['Oia Sunset', 'Volcano Tour', 'Wine Tasting', 'Red Beach'],
    imageUrl: 'https://picsum.photos/id/1050/800/600',
  }
];

const STORAGE_KEYS = {
  DESTINATIONS: 'tourify_destinations',
  PACKAGES: 'tourify_packages',
  BOOKINGS: 'tourify_bookings',
  USERS: 'tourify_users', // In a real app, never store users in local storage like this
  CURRENT_USER: 'tourify_current_user'
};

// --- Helper Functions ---
const getFromStorage = <T>(key: string, seed: T): T => {
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(stored);
};

const saveToStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// --- Data Access Layer ---

export const getDestinations = (): Destination[] => getFromStorage(STORAGE_KEYS.DESTINATIONS, SEED_DESTINATIONS);
export const saveDestinations = (data: Destination[]) => saveToStorage(STORAGE_KEYS.DESTINATIONS, data);

export const getPackages = (): TourPackage[] => getFromStorage(STORAGE_KEYS.PACKAGES, SEED_PACKAGES);
export const savePackages = (data: TourPackage[]) => saveToStorage(STORAGE_KEYS.PACKAGES, data);

export const getBookings = (): Booking[] => getFromStorage(STORAGE_KEYS.BOOKINGS, []);
export const saveBookings = (data: Booking[]) => saveToStorage(STORAGE_KEYS.BOOKINGS, data);

// --- Auth Simulation ---

export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return stored ? JSON.parse(stored) : null;
};

export const login = async (email: string, role: UserRole = UserRole.USER): Promise<User> => {
  // Simulate API delay
  await new Promise(r => setTimeout(r, 500));
  
  const user: User = {
    id: email.split('@')[0] + '-' + Date.now(),
    name: email.split('@')[0],
    email,
    role,
    avatar: `https://ui-avatars.com/api/?name=${email}&background=0d9488&color=fff`
  };
  
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  return user;
};

export const logout = () => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

// --- Business Logic ---

export const createBooking = (userId: string, packageId: string, travelDate: string, people: number): Booking => {
  const bookings = getBookings();
  const pkg = getPackages().find(p => p.id === packageId);
  if (!pkg) throw new Error("Package not found");

  const newBooking: Booking = {
    id: 'b' + Date.now(),
    userId,
    packageId,
    bookingDate: new Date().toISOString(),
    travelDate,
    peopleCount: people,
    totalPrice: pkg.price * people,
    status: 'confirmed'
  };

  bookings.push(newBooking);
  saveBookings(bookings);
  return newBooking;
};

export const getUserBookings = (userId: string): BookingWithDetails[] => {
  const allBookings = getBookings();
  const packages = getPackages();
  const destinations = getDestinations();

  return allBookings
    .filter(b => b.userId === userId)
    .map(b => {
      const pkg = packages.find(p => p.id === b.packageId)!;
      const dest = destinations.find(d => d.id === pkg.destinationId)!;
      return { ...b, package: pkg, destination: dest };
    });
};

export const getAllBookingsAdmin = (): BookingWithDetails[] => {
    const allBookings = getBookings();
    const packages = getPackages();
    const destinations = getDestinations();
  
    return allBookings.map(b => {
        const pkg = packages.find(p => p.id === b.packageId) || packages[0]; // fallback to prevent crash if pkg deleted
        const dest = destinations.find(d => d.id === pkg.destinationId) || destinations[0];
        return { ...b, package: pkg, destination: dest };
      });
}

export const addDestination = (dest: Omit<Destination, 'id'>) => {
    const dests = getDestinations();
    const newDest = { ...dest, id: 'd' + Date.now() };
    dests.push(newDest);
    saveDestinations(dests);
    return newDest;
}
