import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/store';
import { UserRole } from '../types';
import { Button, Input } from '../components/Shared';
import { Map, AlertCircle } from 'lucide-react';

export const Login: React.FC<{ onLogin: (user: any) => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Hardcoded admin check for demo purposes
    const role = email.includes('admin') ? UserRole.ADMIN : UserRole.USER;
    const user = await login(email, role);
    onLogin(user);
    setLoading(false);
    navigate(role === UserRole.ADMIN ? '/admin' : '/');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
        <div className="text-center">
          <Map className="mx-auto h-12 w-12 text-brand-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-600">
            Sign in to access your trips and rewards
          </p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
             <AlertCircle className="text-blue-600 shrink-0 mt-0.5" size={18}/>
             <div className="text-sm text-blue-800">
                 <p className="font-semibold">Demo Credentials:</p>
                 <p>User: user@tourify.com</p>
                 <p>Admin: admin@tourify.com</p>
             </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <Input 
              label="Email address"
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
            <Input 
              label="Password"
              type="password" 
              required 
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export const Register: React.FC<{ onLogin: (user: any) => void }> = ({ onLogin }) => {
    // Reusing login logic for simplicity in this demo
    return <Login onLogin={onLogin} />;
};
