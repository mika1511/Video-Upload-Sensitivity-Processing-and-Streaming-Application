import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config'; 

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
             const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
            login(response.data.token, response.data.user);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400">
            <div className="relative w-full max-w-sm bg-white p-8 rounded-3xl shadow-2xl">

                {/* Logo & Title */}
                <div className="text-center mb-8">
    
                    <h1 className="text-4xl font-black text-gray-900 mb-2">
                        VideoHub
                    </h1>
                    <p className="text-sm text-slate-600 font-medium">Sign in to your account</p>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl mb-6">
                        <span className="text-sm font-semibold text-red-800">{error}</span>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email Input */}
                    <div>
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            disabled={loading}
                            className="w-full px-4 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-400 focus:border-purple-400 text-base placeholder-slate-400 shadow-sm"
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                            disabled={loading}
                            className="w-full px-4 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-400 focus:border-purple-400 text-base placeholder-slate-400 shadow-sm"
                        />
                    </div>

                    {/* Sign In Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 mt-6"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Signing in...</span>
                            </div>
                        ) : (
                            <span>Sign In</span>
                        )}
                    </button>
                </form>

                {/* Register Link */}
                <div className="text-center mt-6 pt-6 border-t border-slate-200">
                    <p className="text-xs text-slate-600">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="font-bold text-indigo-600 hover:text-purple-600 transition-colors duration-200"
                        >
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}