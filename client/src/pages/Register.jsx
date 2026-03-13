import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    hostel: '',
    roomNumber: ''
  });
  const { register, user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register({ ...formData, role: 'student' });
    if (result.success) {
      toast.success('Registration successful');
    } else {
      toast.error(result.message);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen py-12 flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full bg-card rounded-2xl shadow-xl overflow-hidden p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 text-secondary mb-4">
            <UserPlus size={32} />
          </div>
          <h2 className="text-3xl font-bold text-text-main">Create Account</h2>
          <p className="text-text-muted mt-2">Join the Hostel Management System</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">Full Name</label>
            <input 
              type="text" name="name" required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
              placeholder="John Doe"
              value={formData.name} onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">Email Address</label>
            <input 
              type="email" name="email" required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
              placeholder="you@example.com"
              value={formData.email} onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-main mb-1">Hostel</label>
              <input 
                type="text" name="hostel" required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                placeholder="Block A"
                value={formData.hostel} onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-main mb-1">Room No.</label>
              <input 
                type="text" name="roomNumber" required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                placeholder="101"
                value={formData.roomNumber} onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">Password</label>
            <input 
              type="password" name="password" required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
              placeholder="••••••••"
              value={formData.password} onChange={handleChange}
            />
          </div>
          <button 
            type="submit" 
            className="w-full mt-2 bg-secondary hover:bg-emerald-600 text-white font-medium py-3 rounded-lg transition-colors shadow-lg shadow-secondary/30"
          >
            Create Account
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-text-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-secondary hover:text-emerald-700 font-medium transition-colors">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
