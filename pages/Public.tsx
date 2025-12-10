import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Search, MapPin, Clock, Star, Sparkles, Send, ArrowRight, Calendar, CheckCircle, CreditCard, Wallet } from 'lucide-react';
import { getDestinations, getPackages, createBooking } from '../services/store';
import { generateItinerary, askTravelAssistant } from '../services/gemini';
import { Destination, TourPackage, User } from '../types';
import { Button, Input, Modal, LoadingSpinner } from '../components/Shared';

// --- Components ---

const DestinationCard: React.FC<{ destination: Destination }> = ({ destination }) => (
  <Link to={`/destinations/${destination.id}`} className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
    <div className="relative h-64 overflow-hidden">
      <img 
        src={destination.imageUrl} 
        alt={destination.name} 
        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />
      <div className="absolute bottom-4 left-4 text-white">
        <p className="text-sm font-medium opacity-90">{destination.country}</p>
        <h3 className="text-2xl font-bold">{destination.name}</h3>
      </div>
    </div>
    <div className="p-5">
      <p className="text-slate-600 line-clamp-2">{destination.description}</p>
      <div className="mt-4 flex items-center text-brand-600 font-medium group-hover:translate-x-1 transition-transform">
        Explore packages <ArrowRight size={16} className="ml-1" />
      </div>
    </div>
  </Link>
);

const PackageCard: React.FC<{ pkg: TourPackage }> = ({ pkg }) => (
    <Link to={`/packages/${pkg.id}`} className="block bg-white border border-slate-100 rounded-xl overflow-hidden hover:shadow-lg transition-all">
        <div className="relative h-48">
            <img src={pkg.imageUrl} alt={pkg.title} className="w-full h-full object-cover" />
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md flex items-center text-sm font-semibold shadow-sm">
                <Star size={14} className="text-amber-400 mr-1 fill-amber-400"/> {pkg.rating}
            </div>
        </div>
        <div className="p-4">
            <h3 className="text-lg font-bold text-slate-900 mb-1">{pkg.title}</h3>
            <div className="flex items-center text-slate-500 text-sm mb-3">
                <Clock size={14} className="mr-1"/> {pkg.durationDays} Days
            </div>
            <div className="flex justify-between items-center mt-4">
                <span className="text-2xl font-bold text-brand-700">${pkg.price}</span>
                <span className="text-sm font-medium text-slate-500">per person</span>
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
    <div>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=3506&q=80" 
            alt="Travel Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-brand-500/20 text-brand-100 backdrop-blur-md border border-brand-400/30 text-sm font-medium mb-6 animate-fade-in-up">
            Discover the extraordinary
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight shadow-sm">
            Explore the World with <span className="text-brand-400">Tourify</span>
          </h1>
          <p className="text-xl text-slate-200 mb-10 max-w-2xl mx-auto">
            Curated tours, seamless booking, and AI-powered planning to make your next adventure unforgettable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Button size="lg" className="rounded-full px-8" onClick={() => navigate('/destinations')}>
                Find Destination
             </Button>
             <Button variant="outline" size="lg" className="rounded-full px-8 bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white" onClick={() => {
                const element = document.getElementById('features');
                element?.scrollIntoView({ behavior: 'smooth' });
             }}>
                How it works
             </Button>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
            <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Trending Destinations</h2>
                <p className="text-slate-600">Most popular places recommended by travelers.</p>
            </div>
            <Link to="/destinations" className="hidden md:flex items-center text-brand-600 font-medium hover:text-brand-700">
                View all <ArrowRight size={18} className="ml-1"/>
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
         <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-500 rounded-full blur-[100px] opacity-20"></div>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div>
                    <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center mb-6">
                        <Sparkles className="text-white h-8 w-8" />
                    </div>
                    <h2 className="text-4xl font-bold mb-6">AI-Powered Travel Assistant</h2>
                    <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                        Not sure where to go? Ask our intelligent assistant for hidden gems, custom itineraries, and local secrets. Tourify brings the power of Gemini AI to your travel planning.
                    </p>
                    <ul className="space-y-4 mb-8">
                        {['Instant Itinerary Generation', 'Local Food Recommendations', 'Hidden Gems Discovery'].map((item, i) => (
                            <li key={i} className="flex items-center">
                                <CheckCircle className="text-brand-500 mr-3" size={20} />
                                <span className="text-slate-200">{item}</span>
                            </li>
                        ))}
                    </ul>
                    <Button onClick={() => navigate('/destinations')} variant="primary" size="lg">Try it out</Button>
                </div>
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-2xl relative">
                    {/* Fake Chat UI */}
                    <div className="space-y-4">
                        <div className="flex items-start">
                            <div className="bg-slate-700 rounded-lg p-3 rounded-tl-none max-w-[80%]">
                                <p className="text-sm text-slate-300">Plan a 3-day trip to Kyoto focusing on nature.</p>
                            </div>
                        </div>
                        <div className="flex items-start justify-end">
                             <div className="bg-brand-600 rounded-lg p-3 rounded-tr-none max-w-[90%] text-white">
                                <p className="text-sm">Here is a suggested itinerary for Kyoto...</p>
                                <div className="mt-2 text-xs bg-brand-700/50 p-2 rounded">
                                    <div className="font-semibold mb-1">Day 1: Arashiyama</div>
                                    <ul className="list-disc list-inside opacity-80">
                                        <li>Bamboo Grove morning walk</li>
                                        <li>Tenryu-ji Temple garden</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-bold text-slate-900">All Destinations</h1>
            <p className="text-slate-600 mt-1">Explore our carefully curated list of amazing places.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search destinations..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(d => (
          <DestinationCard key={d.id} destination={d} />
        ))}
        {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-500">
                No destinations found matching "{searchTerm}".
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
    
    useEffect(() => {
        const allDests = getDestinations();
        const d = allDests.find(dest => dest.id === id);
        setDestination(d || null);
        
        if (d) {
            const allPkgs = getPackages();
            setPackages(allPkgs.filter(p => p.destinationId === d.id));
        }
    }, [id]);

    if (!destination) return <div className="text-center py-20">Destination not found.</div>;

    return (
        <div>
             <div className="relative h-[50vh]">
                <img src={destination.imageUrl} alt={destination.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="text-center text-white">
                        <h1 className="text-5xl font-bold mb-4">{destination.name}</h1>
                        <p className="text-xl opacity-90">{destination.country}</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-12">
                        <section>
                            <h2 className="text-2xl font-bold mb-4">About {destination.name}</h2>
                            <p className="text-slate-600 leading-relaxed text-lg">{destination.description}</p>
                        </section>
                        
                        <section>
                            <h2 className="text-2xl font-bold mb-6">Available Tour Packages</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {packages.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)}
                                {packages.length === 0 && <p className="text-slate-500">No packages available yet.</p>}
                            </div>
                        </section>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 sticky top-24">
                            <div className="flex items-center gap-2 mb-4 text-brand-600">
                                <Sparkles size={20} />
                                <h3 className="font-bold text-lg">AI Travel Assistant</h3>
                            </div>
                            <p className="text-sm text-slate-500 mb-4">
                                Curious about {destination.name}? Ask our AI for tips, weather, or local secrets.
                            </p>
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
        <div className="space-y-4">
            <div className="space-y-2">
                <textarea 
                    className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none resize-none h-24"
                    placeholder={`Ask about ${destination}...`}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <Button onClick={handleAsk} disabled={loading} className="w-full flex items-center justify-center gap-2">
                    {loading ? <LoadingSpinner /> : <><Send size={16} /> Ask AI</>}
                </Button>
            </div>
            {response && (
                <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-700 animate-fade-in border border-slate-100">
                    <p className="whitespace-pre-line">{response}</p>
                </div>
            )}
        </div>
    );
};

export const PackageDetails: React.FC<{ user: User | null }> = ({ user }) => {
    const { id } = useParams<{ id: string }>();
    const [pkg, setPkg] = useState<TourPackage | null>(null);
    const [dest, setDest] = useState<Destination | null>(null);
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
        const allPkgs = getPackages();
        const p = allPkgs.find(p => p.id === id);
        if (p) {
            setPkg(p);
            const allDests = getDestinations();
            const d = allDests.find(d => d.id === p.destinationId);
            setDest(d || null);
        }
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

    if (!pkg || !dest) return <div className="text-center py-20"><LoadingSpinner /></div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8">
                    <img src={pkg.imageUrl} alt={pkg.title} className="w-full h-80 object-cover rounded-2xl shadow-md" />
                    
                    <div>
                        <div className="flex items-center gap-2 text-brand-600 font-medium mb-2">
                            <MapPin size={18} /> {dest.name}, {dest.country}
                        </div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-4">{pkg.title}</h1>
                        <div className="flex gap-4 text-slate-600 mb-6">
                            <span className="flex items-center gap-1"><Clock size={18}/> {pkg.durationDays} Days</span>
                            <span className="flex items-center gap-1"><Star size={18} className="text-amber-400 fill-amber-400"/> {pkg.rating} Rating</span>
                        </div>
                        <p className="text-lg text-slate-600 leading-relaxed">{pkg.description}</p>
                    </div>

                    <div className="border-t border-slate-200 pt-8">
                        <h3 className="text-xl font-bold mb-4">Package Highlights</h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {pkg.highlights.map((h, i) => (
                                <li key={i} className="flex items-start">
                                    <CheckCircle size={20} className="text-brand-500 mr-2 shrink-0 mt-0.5" />
                                    <span className="text-slate-700">{h}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-brand-50 rounded-xl p-6 border border-brand-100">
                         <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-brand-900 flex items-center gap-2">
                                <Sparkles size={20}/> AI Itinerary Generator
                            </h3>
                            <Button onClick={handleGenerateItinerary} size="sm" disabled={generatingItinerary}>
                                {generatingItinerary ? "Generating..." : "Generate Plan"}
                            </Button>
                         </div>
                         <p className="text-sm text-brand-700 mb-4">
                            Get a customized day-by-day plan for this trip powered by Gemini AI.
                         </p>
                         {itinerary && (
                             <div className="bg-white p-4 rounded-lg text-slate-700 text-sm whitespace-pre-line border border-brand-200 max-h-96 overflow-y-auto">
                                 {itinerary}
                             </div>
                         )}
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 sticky top-24">
                        <div className="mb-6">
                            <span className="text-3xl font-bold text-slate-900">${pkg.price}</span>
                            <span className="text-slate-500 ml-2">/ person</span>
                        </div>
                        
                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-sm text-slate-600 border-b border-slate-100 pb-2">
                                <span>Duration</span>
                                <span className="font-medium">{pkg.durationDays} Days</span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-600 border-b border-slate-100 pb-2">
                                <span>Destination</span>
                                <span className="font-medium">{dest.name}</span>
                            </div>
                        </div>

                        <Button onClick={() => { setIsBookingModalOpen(true); setBookingStep('details'); }} className="w-full" size="lg">
                            Book Now
                        </Button>
                        <p className="text-center text-xs text-slate-400 mt-4">No payment required today. Free cancellation.</p>
                    </div>
                </div>
            </div>

            <Modal isOpen={isBookingModalOpen} onClose={() => { setIsBookingModalOpen(false); setBookingStep('details'); }} title={bookingStep === 'details' ? `Book ${pkg.title}` : 'Select Payment Method'}>
                {bookingSuccess ? (
                    <div className="text-center py-8">
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="text-green-600 h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Booking Confirmed!</h3>
                        <p className="text-slate-600 mt-2">Redirecting to your trips...</p>
                    </div>
                ) : (
                    bookingStep === 'details' ? (
                        <form onSubmit={handleNextStep} className="space-y-4">
                            <Input 
                                label="Travel Date" 
                                type="date" 
                                required 
                                value={travelDate}
                                onChange={(e) => setTravelDate(e.target.value)}
                            />
                            <Input 
                                label="Number of Guests" 
                                type="number" 
                                min="1" 
                                max="20"
                                required
                                value={guests}
                                onChange={(e) => setGuests(parseInt(e.target.value))}
                            />
                            <div className="bg-slate-50 p-4 rounded-lg flex justify-between items-center font-medium">
                                <span>Total Price:</span>
                                <span className="text-xl text-brand-600">${pkg.price * guests}</span>
                            </div>
                            <Button type="submit" className="w-full">
                                Continue to Payment
                            </Button>
                        </form>
                    ) : (
                         <form onSubmit={handleBook} className="space-y-6">
                            {/* Order Summary */}
                            <div className="bg-slate-50 p-4 rounded-lg space-y-2 text-sm text-slate-600 border border-slate-100">
                                <div className="flex justify-between">
                                    <span>Travel Date:</span>
                                    <span className="font-medium text-slate-900">{travelDate}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Guests:</span>
                                    <span className="font-medium text-slate-900">{guests} People</span>
                                </div>
                                <div className="flex justify-between text-base font-bold pt-2 border-t border-slate-200 mt-2">
                                    <span>Total to Pay:</span>
                                    <span className="text-brand-600">${pkg.price * guests}</span>
                                </div>
                            </div>

                            {/* Payment Selection */}
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-slate-700">Choose Payment Method</label>
                                
                                <div 
                                    onClick={() => setPaymentMethod('card')}
                                    className={`cursor-pointer border rounded-lg p-4 flex items-center gap-4 transition-all ${paymentMethod === 'card' ? 'border-brand-500 ring-1 ring-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-200'}`}
                                >
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${paymentMethod === 'card' ? 'border-brand-500' : 'border-slate-300'}`}>
                                        {paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-brand-500"/>}
                                    </div>
                                    <CreditCard className="text-slate-600" size={24}/>
                                    <div>
                                        <div className="font-medium text-slate-900">Credit / Debit Card</div>
                                        <div className="text-xs text-slate-500">Secure payment via Stripe</div>
                                    </div>
                                </div>

                                <div 
                                    onClick={() => setPaymentMethod('paypal')}
                                    className={`cursor-pointer border rounded-lg p-4 flex items-center gap-4 transition-all ${paymentMethod === 'paypal' ? 'border-brand-500 ring-1 ring-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-200'}`}
                                >
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${paymentMethod === 'paypal' ? 'border-brand-500' : 'border-slate-300'}`}>
                                        {paymentMethod === 'paypal' && <div className="w-2.5 h-2.5 rounded-full bg-brand-500"/>}
                                    </div>
                                    <Wallet className="text-slate-600" size={24}/>
                                    <div>
                                        <div className="font-medium text-slate-900">PayPal</div>
                                        <div className="text-xs text-slate-500">Fast and secure checkout</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button type="button" variant="outline" onClick={() => setBookingStep('details')} className="flex-1">
                                    Back
                                </Button>
                                <Button type="submit" className="flex-[2]" disabled={isSubmitting}>
                                    {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                                </Button>
                            </div>
                        </form>
                    )
                )}
            </Modal>
        </div>
    );
};