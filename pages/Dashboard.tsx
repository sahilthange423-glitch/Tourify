import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getUserBookings, getAllBookingsAdmin, getDestinations, addDestination, saveDestinations } from '../services/store';
import { User, BookingWithDetails, Destination } from '../types';
import { Button, Input, Modal, LoadingSpinner } from '../components/Shared';
import { Calendar, MapPin, DollarSign, Plus, Trash } from 'lucide-react';

export const UserDashboard: React.FC<{ user: User }> = ({ user }) => {
    const [bookings, setBookings] = useState<BookingWithDetails[]>([]);

    useEffect(() => {
        setBookings(getUserBookings(user.id));
    }, [user.id]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">My Trips</h1>
            {bookings.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                    <MapPin className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                    <h3 className="text-lg font-medium text-slate-900">No bookings yet</h3>
                    <p className="text-slate-500 mb-6">Start exploring to plan your next adventure.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {bookings.map(b => (
                        <div key={b.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col md:flex-row items-center gap-6">
                            <img src={b.package.imageUrl} alt={b.package.title} className="w-full md:w-48 h-32 object-cover rounded-lg" />
                            <div className="flex-grow space-y-2">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xl font-bold text-slate-900">{b.package.title}</h3>
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 uppercase tracking-wide">
                                        {b.status}
                                    </span>
                                </div>
                                <p className="text-slate-600 flex items-center gap-2">
                                    <MapPin size={16} /> {b.destination.name}, {b.destination.country}
                                </p>
                                <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                                    <span className="flex items-center gap-1"><Calendar size={14}/> Travel: {new Date(b.travelDate).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1">Guests: {b.peopleCount}</span>
                                    <span className="flex items-center gap-1 font-semibold text-slate-900">Total: ${b.totalPrice}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export const AdminDashboard: React.FC = () => {
    const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    // Form State
    const [newDest, setNewDest] = useState({ name: '', country: '', description: '', imageUrl: '' });

    useEffect(() => {
        setBookings(getAllBookingsAdmin());
        setDestinations(getDestinations());
    }, []);

    const handleAddDestination = (e: React.FormEvent) => {
        e.preventDefault();
        addDestination(newDest);
        setDestinations(getDestinations());
        setIsAddModalOpen(false);
        setNewDest({ name: '', country: '', description: '', imageUrl: '' });
    };

    const handleDeleteDestination = (id: string) => {
        if(window.confirm("Are you sure?")) {
            const updated = destinations.filter(d => d.id !== id);
            saveDestinations(updated);
            setDestinations(updated);
        }
    };

    // Chart Data Preparation
    const bookingsByDest = bookings.reduce((acc, curr) => {
        const dest = curr.destination.name;
        acc[dest] = (acc[dest] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    
    const chartData = Object.keys(bookingsByDest).map(key => ({
        name: key,
        bookings: bookingsByDest[key]
    }));

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
                <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
                    <Plus size={18} /> Add Destination
                </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="text-slate-500 text-sm font-medium mb-1">Total Bookings</div>
                    <div className="text-3xl font-bold text-slate-900">{bookings.length}</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="text-slate-500 text-sm font-medium mb-1">Total Revenue</div>
                    <div className="text-3xl font-bold text-brand-600">${bookings.reduce((sum, b) => sum + b.totalPrice, 0).toLocaleString()}</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="text-slate-500 text-sm font-medium mb-1">Active Destinations</div>
                    <div className="text-3xl font-bold text-slate-900">{destinations.length}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-96">
                    <h3 className="text-lg font-bold mb-6">Popular Destinations</h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip />
                            <Bar dataKey="bookings" fill="#0d9488" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Recent Bookings */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-96 overflow-y-auto">
                    <h3 className="text-lg font-bold mb-4">Recent Bookings</h3>
                    <div className="space-y-4">
                        {bookings.slice(0, 5).map(b => (
                            <div key={b.id} className="flex justify-between items-center pb-4 border-b border-slate-50 last:border-0">
                                <div>
                                    <div className="font-medium text-slate-900">{b.package.title}</div>
                                    <div className="text-xs text-slate-500">{b.userId} • {new Date(b.bookingDate).toLocaleDateString()}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-medium text-brand-600">${b.totalPrice}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Manage Destinations */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                     <h3 className="text-lg font-bold">Manage Destinations</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-900 font-medium">
                            <tr>
                                <th className="px-6 py-3">Destination</th>
                                <th className="px-6 py-3">Country</th>
                                <th className="px-6 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {destinations.map(d => (
                                <tr key={d.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <img src={d.imageUrl} className="w-10 h-10 rounded object-cover" alt="" />
                                        <span className="font-medium text-slate-900">{d.name}</span>
                                    </td>
                                    <td className="px-6 py-4">{d.country}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleDeleteDestination(d.id)} className="text-red-500 hover:text-red-700">
                                            <Trash size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Destination Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Destination">
                <form onSubmit={handleAddDestination} className="space-y-4">
                    <Input 
                        label="Destination Name" 
                        required 
                        value={newDest.name} 
                        onChange={e => setNewDest({...newDest, name: e.target.value})}
                    />
                    <Input 
                        label="Country" 
                        required 
                        value={newDest.country} 
                        onChange={e => setNewDest({...newDest, country: e.target.value})}
                    />
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea 
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                            rows={3}
                            required
                            value={newDest.description} 
                            onChange={e => setNewDest({...newDest, description: e.target.value})}
                        />
                    </div>
                    <Input 
                        label="Image URL (Unsplash/Picsum)" 
                        required 
                        placeholder="https://..."
                        value={newDest.imageUrl} 
                        onChange={e => setNewDest({...newDest, imageUrl: e.target.value})}
                    />
                    <Button type="submit" className="w-full">Save Destination</Button>
                </form>
            </Modal>
        </div>
    );
};
