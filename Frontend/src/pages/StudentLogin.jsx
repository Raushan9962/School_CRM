import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const StudentLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Connects to the backend we built earlier
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      if (res.data.success) {
        // Store JWT token and user info in localStorage
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        const rawRole = res.data.user?.role || res.data.user?.roleName || '';
        const role = rawRole.toLowerCase().replace(/\s+/g, '');
        // Route based on role
        if (role === 'superadmin') {
          navigate('/SuperAdmin');
        } else if (role === 'schooladmin') {
          navigate('/SchoolAdminDashboard');
        } else if (role === 'principal') {
          navigate('/PrincipalDashboard');
        } else {
          navigate('/'); // fallback or student dashboard
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf5eb] flex flex-col justify-center items-center px-4">
      <Link to="/" className="text-orange-500 font-bold text-3xl sm:text-4xl tracking-widest drop-shadow-md mb-8">
        VidyaSetu
      </Link>
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-bold text-center text-blue-900 mb-6">Portal Login</h2>
        
        {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm text-center">{error}</div>}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-orange-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-orange-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-orange-500 text-white font-bold py-2 rounded hover:bg-orange-600 transition-colors mt-2"
          >
            Login
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account? <Link to="#" className="text-orange-500 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default StudentLogin;
