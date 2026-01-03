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
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Compact Centered Card */}
            <div className="relative w-full max-w-sm bg-white/95 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl border border-white/50">

                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-gray-900 mb-2 drop-shadow-sm">
                        VideoHub
                    </h1>
                    <p className="text-sm text-slate-600 font-medium">Sign in to your account</p>
                </div>

                {/* error */}
                {error && (
                    <div style={{
                        backgroundColor: '#fef2f2',
                        color: '#dc2626',
                        padding: '1rem',
                        borderRadius: '0.75rem',
                        marginBottom: '1.5rem',
                        fontSize: '0.875rem'
                    }}>
                        <span style={{ fontWeight: '500' }}>{error}</span>
                    </div>
                )}



                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email Input */}
                    <div>
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            disabled={loading}
                            className="w-full px-4 py-3.5 bg-white/70 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400/30 focus:border-blue-400 text-base placeholder-slate-500 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 disabled:opacity-60 backdrop-blur-sm"
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
                            placeholder="••••••••"
                            required
                            disabled={loading}
                            className="w-full px-4 py-3.5 bg-white/70 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400/30 focus:border-blue-400 text-base placeholder-slate-500 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 disabled:opacity-60 backdrop-blur-sm"
                        />
                    </div>

                    {/* Sign In Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl hover:from-blue-700 hover:to-purple-700 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 overflow-hidden"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Signing in...</span>
                            </div>
                        ) : (
                            <>
                                <span>Sign In</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent -skew-x-12 -translate-x-32 group-hover:translate-x-0 transition-transform duration-700" />
                            </>
                        )}
                    </button>
                </form>

                {/* Register Link */}
                <div className="text-center mt-6 pt-6 border-t border-slate-200">
                    <p className="text-xs text-slate-600">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="font-bold text-blue-600 hover:text-purple-600 transition-colors duration-200"
                        >
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
