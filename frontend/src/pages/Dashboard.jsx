import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';
import { API_URL } from '../config';

export default function Dashboard() {
    const { user, videos, setVideos, logout } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io(API_URL);

        newSocket.on('connect', () => console.log('✅ SOCKET CONNECTED'));

        newSocket.on('progress', (data) => {
            console.log('🔥 LIVE UPDATE:', data);
            setVideos(prevVideos => {
                const updatedVideos = prevVideos.map(video =>
                    video._id === data.videoId
                        ? { ...video, progress: data.progress, status: data.status }
                        : video
                );

                if (!updatedVideos.find(v => v._id === data.videoId)) {
                    updatedVideos.push({
                        _id: data.videoId,
                        progress: data.progress,
                        status: data.status,
                        title: 'Processing...',
                        createdAt: new Date()
                    });
                }

                return updatedVideos;
            });
        });

        fetchVideos();
        setSocket(newSocket);

        return () => newSocket.disconnect();
    }, [setVideos]);

    const fetchVideos = async () => {
        try {
            setLoading(true);
             const response = await axios.get(`${API_URL}/api/videos`);
            setVideos(response.data);
        } catch (err) {
            console.error('Failed to fetch videos');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="text-xl font-semibold text-gray-700">Loading your videos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
           

            <header className="bg-white/90 backdrop-blur-lg shadow-lg border-b border-white/60 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex items-center space-x-4">
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-gray-900 to-slate-800 bg-clip-text text-transparent">
                                    VideoHub
                                </h1>
                                <p className="text-sm text-gray-600 font-medium mt-1">Welcome back, {user?.email}</p>
                            </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 justify-end">
                            <Link
                                to="/upload"
                                className="group bg-gradient-to-r from-emerald-500 to-blue-600 px-6 py-3 rounded-xl font-bold text-white text-lg shadow-xl hover:shadow-2xl hover:from-emerald-600 hover:to-blue-700 transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2 whitespace-nowrap"
                            >
                                <span>📤 Upload</span>
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                            
                            <button
                                onClick={fetchVideos}
                                disabled={loading}
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-3 rounded-xl font-semibold text-white text-base hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
                            >
                                <span>🔄</span>
                                <span>Refresh</span>
                            </button>
                            
                            <button
                                onClick={handleLogout}
                                className="bg-gradient-to-r from-slate-400 to-slate-500 px-5 py-3 rounded-xl font-semibold text-white text-base hover:from-slate-500 hover:to-slate-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2"
                            >
                                <span>🚪</span>
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

           
            <main className="max-w-6xl mx-auto px-6 pb-16 pt-4">
                {videos.length === 0 ? (
                    <div className="text-center py-32">
                        <div className="w-28 h-28 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center shadow-2xl">
                            <span className="text-5xl opacity-40">🎥</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
                            No videos yet
                        </h2>
                        <p className="text-xl text-gray-600 mb-10 max-w-lg mx-auto leading-relaxed">
                            Upload your first video and watch live processing updates in real-time!
                        </p>
                        <Link
                            to="/upload"
                            className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-emerald-500 to-blue-600 text-white text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl hover:from-emerald-600 hover:to-blue-700 transform hover:-translate-y-2 transition-all duration-300"
                        >
                            🚀 Start Uploading
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h2 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-gray-900 to-slate-800 bg-clip-text text-transparent">
                                    Your Videos ({videos.length})
                                </h2>
                                <p className="text-lg text-gray-600 mt-2 font-medium">Live processing updates</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {videos.map((video) => (
                                <div
                                    key={video._id}
                                    className="group bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl border border-white/50 overflow-hidden h-full transform hover:-translate-y-2 transition-all duration-500"
                                >
                                   
                                    <div className={`px-6 pt-6 pb-1 ${
                                        video.status === 'safe'
                                            ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white'
                                            : video.status === 'flagged'
                                            ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white'
                                            : 'bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900'
                                    }`}>
                                        <div className="flex items-center justify-center space-x-2 font-bold text-lg">
                                            {video.status === 'safe' && '✅ Safe'}
                                            {video.status === 'flagged' && '⚠️ Flagged'}
                                            {video.status === 'processing' && '⏳ Processing'}
                                        </div>
                                    </div>

                                    <div className="p-8 pb-10">
                                        
                                        <h3 className="text-xl font-bold text-gray-900 mb-6 leading-tight line-clamp-2">
                                            {video.title || 'Processing...'}
                                        </h3>

                                       
                                        <div className="mb-8">
                                            {video.status === 'safe' && video.progress === 100 ? (
                                                <div className="w-full h-48 rounded-2xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-300">
                                                    <video
                                                        controls
                                                        className="w-full h-full object-cover"
                                                        src={`/api/videos/${video._id}/stream`}
                                                    >
                                                        Your browser does not support video.
                                                    </video>
                                                </div>
                                            ) : (
                                                <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-xl">
                                                    <span className="text-4xl opacity-40">🎥</span>
                                                </div>
                                            )}
                                        </div>


                                        {/* Progress % + Date - CENTERED */}
                                        <div className="flex flex-col items-center space-y-2 text-center">
                                            <span className="text-2xl font-black text-gray-900">
                                                {video.progress || 0}%
                                            </span>
                                            <span className="text-sm text-gray-600 px-3 py-1 bg-gray-100 rounded-full font-medium">
                                                {video.createdAt ? new Date(video.createdAt).toLocaleDateString() : 'Just now'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
