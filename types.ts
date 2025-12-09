export enum UserRole {
  GUEST = 'GUEST',
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  imageUrl: string;
}

export interface TourPackage {
  id: string;
  destinationId: string;
  title: string;
  description: string;
  durationDays: number;
  price: number;
  rating: number;
  highlights: string[];
  imageUrl: string;
}

export interface Booking {
  id: string;
  userId: string;
  packageId: string;
  bookingDate: string; // ISO Date
  travelDate: string; // ISO Date
  peopleCount: number;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export interface BookingWithDetails extends Booking {
  package: TourPackage;
  destination: Destination;
}

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
};
