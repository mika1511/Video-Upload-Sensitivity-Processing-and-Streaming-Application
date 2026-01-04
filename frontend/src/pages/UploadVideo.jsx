import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

export default function UploadVideo() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const { setVideos } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a video file');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title || 'Untitled Video');

    try {
       await axios.post(`${API_URL}/api/videos/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload Progress: ${percent}%`);
        }
      });
      
      const response = await axios.get(`${API_URL}/api/videos`);
      setVideos(response.data);
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
     
      <div className="bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/50 max-h-[90vh] overflow-y-auto">
        
       
        <div className="text-center mb-12">
        
          
          <div>
           <h1 className="text-4xl font-black text-gray-900 mb-3">Upload Video</h1>

          </div>
        </div>

        
        <div className="mb-8 text-center">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center gap-2 text-slate-700 hover:text-purple-600 font-semibold text-sm transition-all duration-200 hover:translate-x-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        {error && (
          <div className="bg-gradient-to-r from-rose-100 to-red-100 border-2 border-red-200 text-red-900 p-6 rounded-2xl mb-8 shadow-lg text-center">
            <div className="flex items-center justify-center gap-3">
              <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">{error}</span>
            </div>
          </div>
        )}

       
        <form onSubmit={handleSubmit} className="space-y-6">
         
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-3">Video Title (Optional)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-5 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-400/30 focus:border-purple-400 text-lg placeholder-slate-500 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 disabled:opacity-60 bg-white/70"
              placeholder="Enter video title..."
              disabled={uploading}
            />
          </div>

          
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-3">Video File</label>
            <div className="space-y-3">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full p-6 border-2 border-dashed border-slate-300 rounded-2xl text-slate-700 file:mr-6 file:py-3.5 file:px-6 file:rounded-xl file:border-0 file:text-lg file:font-bold file:bg-gradient-to-r file:from-purple-500 file:to-pink-600 file:text-white file:shadow-lg file:cursor-pointer hover:file:shadow-xl hover:file:from-purple-600 hover:file:to-pink-700 bg-white/70 hover:bg-purple-50/50 hover:border-purple-300 transition-all duration-200 cursor-pointer disabled:opacity-50"
                required
                disabled={uploading}
              />
              {file && (
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="truncate">
                      <p className="font-semibold text-slate-900 text-sm">{file.name}</p>
                      <p className="text-xs text-slate-600">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-purple-600 hover:text-purple-700 text-sm font-semibold transition-colors px-3 py-1 hover:bg-white rounded-lg"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

         
          <button
            type="submit"
            disabled={uploading || !file}
            className="group relative w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-6 px-8 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl hover:from-purple-700 hover:to-pink-700 transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 overflow-hidden"
          >
            {uploading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-7 h-7 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Uploading...</span>
              </div>
            ) : (
              <>
                <span>🚀 Upload Video</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent -skew-x-12 -translate-x-48 group-hover:translate-x-0 transition-transform duration-1000" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
