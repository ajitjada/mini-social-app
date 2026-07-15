import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Heart, MessageSquare, Send, Loader2 } from 'lucide-react';

const Home = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isPosting, setIsPosting] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await api.get('/posts');
            setPosts(res.data.posts);
        } catch (error) {
            toast.error('Failed to load posts');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        
        setIsPosting(true);
        try {
            const res = await api.post('/post', { content });
            setPosts([res.data.post, ...posts]);
            setContent('');
            toast.success('Post created');
        } catch (error) {
            toast.error('Failed to create post');
        } finally {
            setIsPosting(false);
        }
    };

    const handleLike = async (postId) => {
        try {
            const res = await api.get(`/like/${postId}`);
            setPosts(posts.map(post => post._id === postId ? res.data.post : post));
        } catch (error) {
            toast.error('Failed to like post');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Create Post</h2>
                <form onSubmit={handlePostSubmit}>
                    <textarea 
                        className="w-full p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                        rows="3"
                        placeholder="What's on your mind?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                    <div className="flex justify-end mt-3">
                        <button 
                            type="submit"
                            disabled={isPosting || !content.trim()}
                            className="flex items-center px-5 py-2 bg-blue-500 text-white font-medium rounded-md transition-all duration-300 hover:scale-105 active:scale-95 hover:brightness-110 hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:brightness-100 disabled:hover:shadow-none disabled:active:scale-100 cursor-pointer gap-2"
                        >
                            {isPosting ? 'Posting...' : <><Send className="w-4 h-4" /> Post</>}
                        </button>
                    </div>
                </form>
            </div>

            <div className="space-y-4">
                {posts.map(post => (
                    <div key={post._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                                <img 
                                    src={post.user?.profilepic ? `http://localhost:3000/images/uploads/${post.user.profilepic}` : 'https://via.placeholder.com/150'} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">{post.user?.name}</h3>
                                <p className="text-sm text-gray-500">@{post.user?.username}</p>
                            </div>
                        </div>
                        <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>
                        <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
                            <button 
                                onClick={() => handleLike(post._id)}
                                className={`flex items-center gap-1.5 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${post.likes.includes(user?._id) ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                            >
                                <Heart className={`w-5 h-5 ${post.likes.includes(user?._id) ? 'fill-current' : ''}`} />
                                <span className="font-medium">{post.likes.length}</span>
                            </button>
                            <button className="flex items-center gap-1.5 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-gray-500 hover:text-blue-500">
                                <MessageSquare className="w-5 h-5" />
                                <span className="font-medium">Comment</span>
                            </button>
                        </div>
                    </div>
                ))}
                {posts.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                        No posts yet. Be the first to share something!
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
