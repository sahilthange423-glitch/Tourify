import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Search, MapPin, Clock, Star, Sparkles, Send, ArrowRight, Calendar, CheckCircle, CreditCard, Wallet, Plane } from 'lucide-react';
import { getDestinations, getPackages, createBooking } from '../services/store';
import { generateItinerary, askTravelAssistant } from '../services/gemini';
import { Destination, TourPackage, User } from '../types';
import { Button, Input, Modal, LoadingSpinner } from '../components/Shared';

// --- Components ---

const DestinationCard: React.FC<{ destination: Destination }> = ({ destination }) => (
  <Link to={`/destinations/${destination.id}`} className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-brand-900/10 transition-all duration-300 border border-slate-100">
    <div className="relative h-64 overflow-hidden">
      <img 
        src={destination.imageUrl} 
        alt={destination.name} 
        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-90" />
      <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
        <span className="text-white text-xs font-bold uppercase tracking-wider">{destination.country}</span>
      </div>
      <div className="absolute bottom-4 left-4 text-white p-2">
        <h3 className="text-2xl font-bold mb-1 group-hover:text-brand-200 transition-colors">{destination.name}</h3>
        <div className="flex items-center text-slate-300 text-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <span>View Details</span> <ArrowRight size={14} className="ml-1" />
        </div>
      </div>
    </div>
    <div className="p-5">
      <p className="text-slate-600 line-clamp-2 text-sm leading-relaxed">{destination.description}</p>
    </div>
  </Link>
);

const PackageCard: React.FC<{ pkg: TourPackage }> = ({ pkg }) => (
    <Link to={`/packages/${pkg.id}`} className="group block bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-brand-900/5 transition-all duration-300 transform hover:-translate-y-1">
        <div className="relative h-52">
            <img src={pkg.imageUrl} alt={pkg.title} className="w-full h-full object-cover" />
            <div className="absolute top-3 left-3 bg-brand-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm">
                BEST SELLER
            </div>
            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg flex items-center text-sm font-bold shadow-sm text-slate-800">
                <Star size={14} className="text-amber-400 mr-1 fill-amber-400"/> {pkg.rating}
            </div>
        </div>
        <div className="p-5">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">{pkg.title}</h3>
            </div>
            <div className="flex items-center text-slate-500 text-sm mb-4 bg-slate-50 inline-block px-2 py-1 rounded-md">
                <Clock size={14} className="mr-1.5"/> {pkg.durationDays} Days / {pkg.durationDays - 1} Nights
            </div>
            <div className="flex justify-between items-end border-t border-slate-100 pt-4">
                <div>
                     <p className="text-xs text-slate-500 mb-0.5">Starting from</p>
                     <span className="text-2xl font-bold text-brand-600">${pkg.price}</span>
                </div>
                <div className="bg-brand-50 text-brand-600 p-2 rounded-full group-hover:bg-brand-600 group-hover:text-white transition-colors">
                    <ArrowRight size={18} />
                </div>
            </div>
        </div>
    </Link>
);

// --- Pages ---

export const Home = () => {
  const [featuredDestinations, setFeaturedDestinations] = useState<Destination[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setFeaturedDestinations(getDestinations().slice(0, 3));
  }, []);

  return (
    <div className="bg-slate-50">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=3540&q=80" 
            alt="Travel Hero" 
            className="w-full h-full object-cover scale-105 animate-pulse-slow" 
            style={{ animationDuration: '20s' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/30 to-slate-900/70" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/10 text-white backdrop-blur-md border border-white/20 text-sm font-semibold mb-8 animate-fade-in-up">
            <Sparkles size={16} className="text-amber-300" /> Discover your next adventure
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight shadow-sm drop-shadow-xl animate-fade-in-up delay-100">
            Explore the World <br/> with <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-white">Tourify</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-100 mb-12 max-w-2xl mx-auto font-light leading-relaxed animate-fade-in-up delay-200">
            Unforgettable journeys, curated by experts and powered by AI. Where will you go next?
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center animate-fade-in-up delay-300">
             <Button size="lg" className="rounded-full px-10 py-4 text-lg shadow-brand-500/50 hover:shadow-brand-500/70" onClick={() => navigate('/destinations')}>
                Start Exploring
             </Button>
             <Button variant="outline" size="lg" className="rounded-full px-10 py-4 text-lg bg-white/5 text-white border-white/30 hover:bg-white/10 hover:border-white" onClick={() => {
                const element = document.getElementById('features');
                element?.scrollIntoView({ behavior: 'smooth' });
             }}>
                How it works
             </Button>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/50">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
                <div className="w-1 h-2 bg-white/70 rounded-full"></div>
            </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
                <span className="text-brand-600 font-bold uppercase tracking-wider text-sm">Popular Choice</span>
                <h2 className="text-4xl font-bold text-slate-900 mt-2">Trending Destinations</h2>
            </div>
            <Link to="/destinations" className="group flex items-center text-slate-600 font-semibold hover:text-brand-600 transition-colors">
                View all destinations 
                <div className="bg-slate-100 p-2 rounded-full ml-3 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                    <ArrowRight size={18} />
                </div>
            </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredDestinations.map(d => (
            <DestinationCard key={d.id} destination={d} />
          ))}
        </div>
      </section>

      {/* Features/AI Teaser */}
      <section id="features" className="bg-slate-900 text-white py-24 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-600 rounded-full blur-[150px] opacity-20 -mr-32 -mt-32"></div>
         <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600 rounded-full blur-[120px] opacity-20 -ml-20 -mb-20"></div>
         
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-sm font-medium mb-6">
                        <Sparkles size={14} /> AI Powered
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Your Intelligent <br/> <span className="text-brand-400">Travel Companion</span></h2>
                    <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                        Don't just visit—experience. Our Gemini-powered assistant helps you uncover hidden gems, plan minute-by-minute itineraries, and answer every travel question you have.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                        {['Smart Itineraries', 'Local Food Guide', 'Hidden Gems', 'Real-time Tips'].map((item, i) => (
                            <div key={i} className="flex items-center bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="p-2 bg-brand-500/20 rounded-lg mr-3 text-brand-400">
                                    <CheckCircle size={18} />
                                </div>
                                <span className="text-slate-200 font-medium">{item}</span>
                            </div>
                        ))}
                    </div>
                    <Button onClick={() => navigate('/destinations')} className="px-8 py-4 text-lg">Try AI Assistant</Button>
                </div>
                <div className="relative">
                    <div className="bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-700 shadow-2xl relative z-10">
                        <div className="flex items-center gap-4 mb-6 border-b border-slate-700 pb-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-400 to-purple-500 flex items-center justify-center">
                                <Sparkles className="text-white h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">Tourify Assistant</h3>
                                <p className="text-xs text-brand-300">Online • Powered by Gemini</p>
                            </div>
                        </div>
                        {/* Fake Chat UI */}
                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="bg-slate-700 rounded-2xl rounded-tl-none p-4 max-w-[85%] shadow-sm">
                                    <p className="text-sm text-slate-200">I want a romantic 3-day trip plan for Paris, please!</p>
                                </div>
                            </div>
                            <div className="flex items-start justify-end">
                                 <div className="bg-brand-600 rounded-2xl rounded-tr-none p-4 max-w-[90%] text-white shadow-lg">
                                    <p className="text-sm mb-3">Ooh la la! Here is a romantic plan for you ❤️</p>
                                    <div className="text-xs bg-white/10 p-3 rounded-xl border border-white/10 space-y-2">
                                        <div className="font-bold text-brand-100 border-b border-white/10 pb-1">Day 1: Montmartre & Sunset</div>
                                        <div className="flex gap-2 items-center"><div className="w-1 h-1 bg-white rounded-full"></div>Morning coffee at Café des Deux Moulins</div>
                                        <div className="flex gap-2 items-center"><div className="w-1 h-1 bg-white rounded-full"></div>Sunset steps at Sacré-Cœur</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                         <div className="mt-6 pt-4 border-t border-slate-700">
                            <div className="h-10 bg-slate-900/50 rounded-xl w-full"></div>
                        </div>
                    </div>
                    {/* Decorative elements behind chat */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500 rounded-full blur-[50px] opacity-20"></div>
                    <div className="absolute -bottom-5 -left-5 w-40 h-40 bg-brand-500 rounded-full blur-[60px] opacity-20"></div>
                </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export const DestinationsList = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setDestinations(getDestinations());
  }, []);

  const filtered = destinations.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-slate-50 min-h-screen">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 mb-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Find your Destination</h1>
                <p className="text-slate-500 mt-2">Where do you want to go? Search by country or city.</p>
            </div>
            <div className="relative w-full md:w-[400px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Search destinations..." 
                className="w-full pl-12 pr-4 py-3 border border-slate-200 bg-slate-50 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none focus:bg-white transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(d => (
          <DestinationCard key={d.id} destination={d} />
        ))}
        {filtered.length === 0 && (
            <div className="col-span-full text-center py-20">
                <div className="inline-block p-4 rounded-full bg-slate-100 mb-4">
                    <MapPin className="text-slate-400 h-8 w-8" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">No destinations found</h3>
                <p className="text-slate-500">Try adjusting your search terms.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export const DestinationDetails = () => {
    const { id } = useParams<{ id: string }>();
    const [destination, setDestination] = useState<Destination | null>(null);
    const [packages, setPackages] = useState<TourPackage[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        setLoading(true);
        const allDests = getDestinations();
        const d = allDests.find(dest => dest.id === id);
        setDestination(d || null);
        
        if (d) {
            const allPkgs = getPackages();
            setPackages(allPkgs.filter(p => p.destinationId === d.id));
        }
        setLoading(false);
    }, [id]);

    if (loading) return <div className="text-center py-20"><LoadingSpinner /></div>;
    if (!destination) return <div className="text-center py-20 text-slate-500">Destination not found.</div>;

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
             <div className="relative h-[60vh]">
                <img src={destination.imageUrl} alt={destination.name} className="w-full h-full object-cover fixed-bg" />
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center">
                    <div className="text-center text-white animate-fade-in-up">
                        <span className="inline-block py-1 px-4 rounded-full bg-white/20 backdrop-blur border border-white/30 text-sm font-bold mb-4 uppercase tracking-widest">
                            {destination.country}
                        </span>
                        <h1 className="text-6xl md:text-7xl font-bold mb-4 drop-shadow-2xl">{destination.name}</h1>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                            <h2 className="text-2xl font-bold mb-4 text-slate-900">About {destination.name}</h2>
                            <p className="text-slate-600 leading-relaxed text-lg">{destination.description}</p>
                        </div>
                        
                        <div>
                            <h2 className="text-2xl font-bold mb-6 text-slate-900 px-2">Available Tour Packages</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {packages.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)}
                                {packages.length === 0 && <p className="text-slate-500">No packages available yet.</p>}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xl border border-brand-100 p-6 sticky top-24 overflow-hidden">
                            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-brand-500/10 rounded-full blur-xl"></div>
                            
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-brand-100 p-2 rounded-lg text-brand-600">
                                    <Sparkles size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900">Travel Assistant</h3>
                                    <p className="text-xs text-brand-600 font-medium">Ask about {destination.name}</p>
                                </div>
                            </div>
                            <AIChatBox destination={destination.name} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AIChatBox: React.FC<{ destination: string }> = ({ destination }) => {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAsk = async () => {
        if (!query.trim()) return;
        setLoading(true);
        setResponse('');
        const answer = await askTravelAssistant(query, `The user is interested in ${destination}.`);
        setResponse(answer);
        setLoading(false);
    };

    return (
        <div className="space-y-4 relative z-10">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                <textarea 
                    className="w-full bg-transparent border-none text-sm focus:ring-0 focus:outline-none resize-none h-20 text-slate-700 placeholder:text-slate-400"
                    placeholder={`e.g., What is the best time to visit?`}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <div className="flex justify-between items-center mt-2 border-t border-slate-200 pt-2">
                    <span className="text-xs text-slate-400">Powered by Gemini</span>
                    <Button onClick={handleAsk} disabled={loading} size="sm" className="rounded-lg">
                        {loading ? <LoadingSpinner /> : <Send size={14} />}
                    </Button>
                </div>
            </div>
            {response && (
                <div className="bg-brand-50 rounded-xl p-4 text-sm text-slate-800 animate-fade-in border border-brand-100 shadow-sm">
                    <div className="flex gap-2 mb-2 text-brand-600 font-semibold text-xs uppercase tracking-wider">
                        <Sparkles size={12} /> AI Insight
                    </div>
                    <p className="whitespace-pre-line leading-relaxed">{response}</p>
                </div>
            )}
        </div>
    );
};

export const PackageDetails: React.FC<{ user: User | null }> = ({ user }) => {
    const { id } = useParams<{ id: string }>();
    const [pkg, setPkg] = useState<TourPackage | null>(null);
    const [dest, setDest] = useState<Destination | null>(null);
    const [loading, setLoading] = useState(true);

    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [guests, setGuests] = useState(1);
    const [travelDate, setTravelDate] = useState('');
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [itinerary, setItinerary] = useState('');
    const [generatingItinerary, setGeneratingItinerary] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Booking Step State
    const [bookingStep, setBookingStep] = useState<'details' | 'payment'>('details');
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
    
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        const allPkgs = getPackages();
        const p = allPkgs.find(p => p.id === id);
        if (p) {
            setPkg(p);
            const allDests = getDestinations();
            const d = allDests.find(d => d.id === p.destinationId);
            setDest(d || null);
        }
        setLoading(false);
    }, [id]);

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();
        setBookingStep('payment');
    };

    const handleBook = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }
        if (pkg && travelDate) {
            setIsSubmitting(true);
            try {
                // Submit to Formspree
                const response = await fetch("https://formspree.io/f/xwpgnjvk", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        email: user.email,
                        customer_name: user.name,
                        tour_package: pkg.title,
                        destination: dest?.name || 'Unknown',
                        travel_date: travelDate,
                        guests: guests,
                        total_price: pkg.price * guests,
                        payment_method: paymentMethod
                    })
                });

                if (response.ok) {
                    // Update local state
                    createBooking(user.id, pkg.id, travelDate, guests);
                    setBookingSuccess(true);
                    setTimeout(() => {
                        setIsBookingModalOpen(false);
                        setBookingSuccess(false);
                        setBookingStep('details');
                        navigate('/bookings');
                    }, 2000);
                } else {
                    const errorData = await response.json();
                    alert("Submission failed: " + (errorData.error || "Please try again."));
                }
            } catch (error) {
                console.error("Booking failed", error);
                alert("Booking failed. Please check your connection.");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleGenerateItinerary = async () => {
        if (!pkg || !dest) return;
        setGeneratingItinerary(true);
        const result = await generateItinerary(dest.name, pkg.durationDays);
        setItinerary(result);
        setGeneratingItinerary(false);
    };

    if (loading) return <div className="text-center py-20"><LoadingSpinner /></div>;
    if (!pkg || !dest) return <div className="text-center py-20 text-slate-500">Package not found.</div>;

    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-3xl p-2 shadow-xl border border-slate-100">
                             <img src={pkg.imageUrl} alt={pkg.title} className="w-full h-96 object-cover rounded-2xl" />
                        </div>
                        
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                            <div className="flex items-center gap-2 text-brand-600 font-bold mb-3 uppercase tracking-wider text-sm">
                                <MapPin size={16} /> {dest.name}, {dest.country}
                            </div>
                            <h1 className="text-4xl font-bold text-slate-900 mb-6">{pkg.title}</h1>
                            <div className="flex gap-6 text-slate-600 mb-8 pb-8 border-b border-slate-100">
                                <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl">
                                    <Clock size={20} className="text-brand-500"/> 
                                    <span className="font-medium">{pkg.durationDays} Days</span>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl">
                                    <Star size={20} className="text-amber-400 fill-amber-400"/> 
                                    <span className="font-medium">{pkg.rating} (124 Reviews)</span>
                                </div>
                            </div>
                            <div className="prose prose-slate max-w-none">
                                <h3 className="text-xl font-bold mb-4">Experience Overview</h3>
                                <p className="text-lg text-slate-600 leading-relaxed mb-8">{pkg.description}</p>
                            </div>

                            <div className="bg-slate-50 rounded-2xl p-8">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <CheckCircle className="text-brand-600" /> Package Highlights
                                </h3>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {pkg.highlights.map((h, i) => (
                                        <li key={i} className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                            <div className="w-2 h-2 rounded-full bg-brand-500"></div>
                                            <span className="text-slate-700 font-medium">{h}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-brand-50 to-white rounded-2xl p-8 border border-brand-100 relative overflow-hidden">
                             <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-brand-500/10 rounded-full blur-2xl"></div>
                             <div className="flex justify-between items-center mb-6 relative z-10">
                                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <Sparkles size={20} className="text-brand-600"/> 
                                    AI Itinerary Planner
                                </h3>
                                <Button onClick={handleGenerateItinerary} size="sm" disabled={generatingItinerary} className="shadow-none">
                                    {generatingItinerary ? "Generating Plan..." : "Generate Itinerary"}
                                </Button>
                             </div>
                             <p className="text-sm text-slate-600 mb-6 max-w-lg">
                                Want to see exactly what you'll be doing? Let our AI generate a detailed day-by-day schedule tailored to this package.
                             </p>
                             {itinerary && (
                                 <div className="bg-white p-6 rounded-xl text-slate-700 text-sm whitespace-pre-line border border-slate-200 shadow-sm max-h-96 overflow-y-auto animate-fade-in relative z-10">
                                     {itinerary}
                                 </div>
                             )}
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 sticky top-24">
                            <div className="mb-8">
                                <p className="text-slate-500 text-sm mb-1">Starting from</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-slate-900">${pkg.price}</span>
                                    <span className="text-slate-500">/ person</span>
                                </div>
                            </div>
                            
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-sm text-slate-600 border-b border-slate-50 pb-3">
                                    <span>Duration</span>
                                    <span className="font-bold text-slate-900">{pkg.durationDays} Days</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-600 border-b border-slate-50 pb-3">
                                    <span>Destination</span>
                                    <span className="font-bold text-slate-900">{dest.name}</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-600 pb-3">
                                    <span>Confirmation</span>
                                    <span className="font-bold text-green-600">Instant</span>
                                </div>
                            </div>

                            <Button onClick={() => { setIsBookingModalOpen(true); setBookingStep('details'); }} className="w-full py-4 text-lg shadow-brand-500/30" size="lg">
                                Book This Trip
                            </Button>
                            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
                                <CheckCircle size={14} /> Free cancellation up to 24h before
                            </div>
                        </div>
                    </div>
                </div>

                <Modal isOpen={isBookingModalOpen} onClose={() => { setIsBookingModalOpen(false); setBookingStep('details'); }} title={bookingStep === 'details' ? `Book ${pkg.title}` : 'Secure Checkout'}>
                    {bookingSuccess ? (
                        <div className="text-center py-10">
                            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-fade-in-up">
                                <CheckCircle className="text-green-600 h-10 w-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h3>
                            <p className="text-slate-600">Pack your bags! We are redirecting you to your itinerary...</p>
                        </div>
                    ) : (
                        bookingStep === 'details' ? (
                            <form onSubmit={handleNextStep} className="space-y-5">
                                <div className="bg-brand-50 p-4 rounded-xl border border-brand-100 mb-6">
                                    <p className="text-sm text-brand-800 font-medium text-center">Step 1 of 2: Trip Details</p>
                                </div>
                                <Input 
                                    label="When are you traveling?" 
                                    type="date" 
                                    required 
                                    value={travelDate}
                                    onChange={(e) => setTravelDate(e.target.value)}
                                />
                                <Input 
                                    label="How many guests?" 
                                    type="number" 
                                    min="1" 
                                    max="20"
                                    required
                                    value={guests}
                                    onChange={(e) => setGuests(parseInt(e.target.value))}
                                />
                                <div className="bg-slate-50 p-5 rounded-xl flex justify-between items-center font-bold border border-slate-100 mt-6">
                                    <span className="text-slate-600">Estimated Total:</span>
                                    <span className="text-2xl text-slate-900">${pkg.price * guests}</span>
                                </div>
                                <Button type="submit" className="w-full mt-4">
                                    Continue to Payment
                                </Button>
                            </form>
                        ) : (
                            <form onSubmit={handleBook} className="space-y-6">
                                {/* Order Summary */}
                                <div className="bg-slate-50 p-5 rounded-xl space-y-3 text-sm text-slate-600 border border-slate-200">
                                    <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-2 mb-2">Order Summary</h4>
                                    <div className="flex justify-between">
                                        <span>Date:</span>
                                        <span className="font-medium text-slate-900">{travelDate}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Guests:</span>
                                        <span className="font-medium text-slate-900">{guests} Adults</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold pt-3 border-t border-slate-200 mt-2">
                                        <span>Total:</span>
                                        <span className="text-brand-600">${pkg.price * guests}</span>
                                    </div>
                                </div>

                                {/* Payment Selection */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Select Payment Method</label>
                                    
                                    <div 
                                        onClick={() => setPaymentMethod('card')}
                                        className={`cursor-pointer border rounded-xl p-4 flex items-center gap-4 transition-all duration-200 ${paymentMethod === 'card' ? 'border-brand-500 ring-2 ring-brand-500/20 bg-brand-50' : 'border-slate-200 hover:border-brand-300 hover:bg-slate-50'}`}
                                    >
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${paymentMethod === 'card' ? 'border-brand-600' : 'border-slate-300'}`}>
                                            {paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-brand-600"/>}
                                        </div>
                                        <div className="bg-white p-2 rounded border border-slate-100">
                                             <CreditCard className="text-slate-700" size={20}/>
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 text-sm">Credit / Debit Card</div>
                                            <div className="text-xs text-slate-500">Instant processing</div>
                                        </div>
                                    </div>

                                    <div 
                                        onClick={() => setPaymentMethod('paypal')}
                                        className={`cursor-pointer border rounded-xl p-4 flex items-center gap-4 transition-all duration-200 ${paymentMethod === 'paypal' ? 'border-brand-500 ring-2 ring-brand-500/20 bg-brand-50' : 'border-slate-200 hover:border-brand-300 hover:bg-slate-50'}`}
                                    >
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${paymentMethod === 'paypal' ? 'border-brand-600' : 'border-slate-300'}`}>
                                            {paymentMethod === 'paypal' && <div className="w-2.5 h-2.5 rounded-full bg-brand-600"/>}
                                        </div>
                                        <div className="bg-white p-2 rounded border border-slate-100">
                                            <Wallet className="text-blue-600" size={20}/>
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 text-sm">PayPal</div>
                                            <div className="text-xs text-slate-500">Pay with your wallet</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button type="button" variant="outline" onClick={() => setBookingStep('details')} className="flex-1">
                                        Back
                                    </Button>
                                    <Button type="submit" className="flex-[2] shadow-xl shadow-brand-500/20" disabled={isSubmitting}>
                                        {isSubmitting ? 'Processing...' : 'Confirm & Pay'}
                                    </Button>
                                </div>
                            </form>
                        )
                    )}
                </Modal>
            </div>
        </div>
    );
};