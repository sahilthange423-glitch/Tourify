import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User as UserIcon, LogOut, LayoutDashboard, Map, ShoppingBag } from 'lucide-react';
import { User, UserRole } from '../types';
import { Button } from './Shared';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

export const Navbar: React.FC<{ user: User | null; onLogout: () => void }> = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path ? "text-brand-600 font-semibold" : "text-slate-600 hover:text-brand-600";

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <Map className="h-8 w-8 text-brand-600" />
            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-brand-700 to-brand-500 bg-clip-text text-transparent">
              Tourify
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={isActive('/')}>Home</Link>
            <Link to="/destinations" className={isActive('/destinations')}>Destinations</Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === UserRole.ADMIN ? (
                  <Link to="/admin" className={isActive('/admin')}>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                       <LayoutDashboard size={16}/> Admin
                    </Button>
                  </Link>
                ) : (
                  <Link to="/bookings" className={isActive('/bookings')}>
                    <span className="flex items-center gap-1"><ShoppingBag size={18}/> My Trips</span>
                  </Link>
                )}
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-medium text-slate-800">{user.name}</span>
                        <span className="text-xs text-slate-500 capitalize">{user.role.toLowerCase()}</span>
                    </div>
                    {user.avatar ? (
                        <img src={user.avatar} alt="Profile" className="h-8 w-8 rounded-full border border-slate-200"/>
                    ) : (
                        <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700">
                            <UserIcon size={18}/>
                        </div>
                    )}
                    <button onClick={onLogout} className="text-slate-400 hover:text-red-500 transition-colors">
                        <LogOut size={20}/>
                    </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="outline" size="sm">Log In</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-600 hover:text-slate-900 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-md">Home</Link>
            <Link to="/destinations" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-md">Destinations</Link>
            {user ? (
              <>
                {user.role === UserRole.ADMIN ? (
                   <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-brand-600 hover:bg-brand-50 rounded-md">Admin Dashboard</Link>
                ) : (
                   <Link to="/bookings" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-brand-600 hover:bg-brand-50 rounded-md">My Trips</Link>
                )}
                <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md">Log Out</button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 mt-4 px-3">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Log In</Button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export const Footer = () => (
  <footer className="bg-slate-900 text-slate-300 py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center text-white mb-4">
            <Map className="h-6 w-6 text-brand-500" />
            <span className="ml-2 text-xl font-bold">Tourify</span>
          </div>
          <p className="text-sm text-slate-400">
            Making your dream vacations a reality with curated tours and AI-powered planning.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-brand-400">About Us</a></li>
            <li><a href="#" className="hover:text-brand-400">Careers</a></li>
            <li><a href="#" className="hover:text-brand-400">Blog</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-brand-400">Help Center</a></li>
            <li><a href="#" className="hover:text-brand-400">Safety Information</a></li>
            <li><a href="#" className="hover:text-brand-400">Cancellation Options</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Subscribe</h4>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Your email" 
              className="bg-slate-800 border-none text-white text-sm rounded px-3 py-2 w-full focus:ring-1 focus:ring-brand-500"
            />
            <button className="bg-brand-600 text-white px-3 py-2 rounded hover:bg-brand-700">OK</button>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Tourify Inc. All rights reserved.
      </div>
    </div>
  </footer>
);

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} onLogout={onLogout} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};
