import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiFetch from '../services/api';

const StudentLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect them back to their dashboard so they don't see the login page if they click back
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        const rawRole = user?.role || user?.roleName || '';
        const role = rawRole.toLowerCase().replace(/\s+/g, '');
        
        if (role === 'superadmin') navigate('/SuperAdmin', { replace: true });
        else if (role === 'schooladmin') navigate('/SchoolAdminDashboard', { replace: true });
        else if (role === 'principal') navigate('/PrincipalDashboard', { replace: true });
        else if (role === 'student') navigate('/StudentDashboard', { replace: true });
        else if (role === 'teacher') navigate('/TeacherDashboard', { replace: true });
        else if (role === 'accountant') navigate('/AccountantDashboard', { replace: true });
        else if (role === 'transport') navigate('/TransportDashboard', { replace: true });
        else if (role === 'librarian') navigate('/LibrarianDashboard', { replace: true });
        else if (role === 'receptionist') navigate('/ReceptionistDashboard', { replace: true });
        else if (role === 'labassistant') navigate('/LabAssistantDashboard', { replace: true });
        else if (role === 'parent') navigate('/ParentDashboard', { replace: true });
      } catch(e) {}
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      // Connects to the backend we built earlier
      const response = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.success) {
        // Store JWT token and user info in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        const rawRole = data.user?.role || data.user?.roleName || '';
        const role = rawRole.toLowerCase().replace(/\s+/g, '');
        // Route based on role
        if (role === 'superadmin') {
          navigate('/SuperAdmin', { replace: true });
        } else if (role === 'schooladmin') {
          navigate('/SchoolAdminDashboard', { replace: true });
        } else if (role === 'principal') {
          navigate('/PrincipalDashboard', { replace: true });
        } else if (role === 'student') {
          navigate('/StudentDashboard', { replace: true });
        } else if (role === 'teacher') {
          navigate('/TeacherDashboard', { replace: true });
        } else if (role === 'accountant') {
          navigate('/AccountantDashboard', { replace: true });
        } else if (role === 'transport') {
          navigate('/TransportDashboard', { replace: true });
        } else if (role === 'librarian') {
          navigate('/LibrarianDashboard', { replace: true });
        } else if (role === 'receptionist') {
          navigate('/ReceptionistDashboard', { replace: true });
        } else if (role === 'labassistant') {
          navigate('/LabAssistantDashboard', { replace: true });
        } else if (role === 'parent') {
          navigate('/ParentDashboard', { replace: true });
        } else {
          navigate('/', { replace: true }); // fallback
        }
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf5eb] flex flex-col justify-center items-center px-4">
      <Link to="/" className="text-orange-500 font-bold text-3xl sm:text-4xl tracking-widest drop-shadow-md mb-8">
        VidyaSetu
      </Link>
      <div className="bg-white p-5 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
        <h2 className="text-xl font-bold text-center text-blue-900 mb-4">Portal Login</h2>
        
        {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm text-center">{error}</div>}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email or Admission Number</label>
            <input 
              type="text" 
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
            disabled={isLoading} 
            className={`w-full bg-orange-500 text-white font-bold py-2 rounded transition-colors mt-2 ${isLoading ? 'opacity-70 cursor-wait' : 'hover:bg-orange-600 cursor-pointer'}`}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default StudentLogin;
