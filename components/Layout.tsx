import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User as UserIcon, LogOut, LayoutDashboard, Compass, ShoppingBag, Plane } from 'lucide-react';
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

  const isActive = (path: string) => location.pathname === path ? "text-brand-600 font-bold bg-brand-50 rounded-lg px-3 py-1" : "text-slate-600 hover:text-brand-600 font-medium px-3 py-1 transition-colors";

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-brand-600 text-white p-2 rounded-xl shadow-lg shadow-brand-600/20 mr-2">
                <Plane className="h-6 w-6" fill="currentColor" />
            </div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              Tourify<span className="text-brand-600">.</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className={isActive('/')}>Home</Link>
            <Link to="/destinations" className={isActive('/destinations')}>Destinations</Link>
            
            {user ? (
              <div className="flex items-center space-x-4 ml-4">
                {user.role === UserRole.ADMIN ? (
                  <Link to="/admin" className={isActive('/admin')}>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                       <LayoutDashboard size={16}/> Admin
                    </Button>
                  </Link>
                ) : (
                  <Link to="/bookings" className={isActive('/bookings')}>
                    <span className="flex items-center gap-2"><ShoppingBag size={18}/> My Trips</span>
                  </Link>
                )}
                <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                    <div className="flex flex-col items-end hidden lg:flex">
                        <span className="text-sm font-bold text-slate-900">{user.name}</span>
                        <span className="text-xs text-slate-500 capitalize">{user.role.toLowerCase()}</span>
                    </div>
                    {user.avatar ? (
                        <img src={user.avatar} alt="Profile" className="h-10 w-10 rounded-full border-2 border-white shadow-md cursor-pointer hover:ring-2 hover:ring-brand-500 transition-all"/>
                    ) : (
                        <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 border-2 border-white shadow-md">
                            <UserIcon size={20}/>
                        </div>
                    )}
                    <button onClick={onLogout} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all" title="Logout">
                        <LogOut size={20}/>
                    </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-slate-200">
                <Link to="/login">
                  <Button variant="ghost" size="md">Log In</Button>
                </Link>
                <Link to="/register">
                  <Button size="md" className="shadow-brand-500/20">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 animate-fade-in">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-600 rounded-xl">Home</Link>
            <Link to="/destinations" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-600 rounded-xl">Destinations</Link>
            {user ? (
              <>
                {user.role === UserRole.ADMIN ? (
                   <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-base font-medium text-brand-600 bg-brand-50 rounded-xl">Admin Dashboard</Link>
                ) : (
                   <Link to="/bookings" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-base font-medium text-brand-600 bg-brand-50 rounded-xl">My Trips</Link>
                )}
                <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="w-full text-left px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-xl">Log Out</button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-center">Log In</Button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full justify-center">Sign Up</Button>
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
  <footer className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <div className="flex items-center text-white">
            <div className="bg-brand-600 p-1.5 rounded-lg mr-2">
                <Plane className="h-5 w-5" />
            </div>
            <span className="text-2xl font-bold">Tourify</span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Your gateway to the world's most breathtaking destinations. Plan, book, and explore with confidence.
          </p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6">Company</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="hover:text-brand-400 transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-brand-400 transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-brand-400 transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-brand-400 transition-colors">Press</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6">Support</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="hover:text-brand-400 transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-brand-400 transition-colors">Safety Information</a></li>
            <li><a href="#" className="hover:text-brand-400 transition-colors">Cancellation Options</a></li>
            <li><a href="#" className="hover:text-brand-400 transition-colors">Contact Us</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6">Stay Updated</h4>
          <p className="text-xs text-slate-500 mb-4">Get the latest travel deals and news.</p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Email address" 
              className="bg-slate-800 border-slate-700 text-white text-sm rounded-lg px-4 py-2 w-full focus:ring-1 focus:ring-brand-500 focus:outline-none"
            />
            <button className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 font-medium transition-colors">Join</button>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 mt-16 pt-8 text-center text-sm text-slate-500 flex flex-col md:flex-row justify-between items-center">
        <p>© {new Date().getFullYear()} Tourify Inc. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Sitemap</a>
        </div>
      </div>
    </div>
  </footer>
);

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Navbar user={user} onLogout={onLogout} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};