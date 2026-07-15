import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

const Feed = () => {
    const { user: currentUser } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await api.get('/posts');
                setPosts(res.data.posts);
            } catch (err) {
                console.error("Failed to fetch posts", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const handleLike = async (postId) => {
        try {
            const res = await api.get(`/like/${postId}`);
            const updatedPost = res.data.post;
            setPosts(posts.map(p => p._id === postId ? updatedPost : p));
        } catch (error) {
            console.error('Failed to like/unlike', error);
        }
    };

    if (loading) return <div className="text-white p-10">Loading...</div>;

    return (
        <div className="text-white w-full p-10">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-4xl font-semibold">Global Feed</h1>
                <Link to="/profile" className="inline-block px-5 py-2 bg-blue-500 text-white font-medium rounded-md transition-all duration-300 hover:scale-105 active:scale-95 hover:brightness-110 hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:brightness-100 disabled:hover:shadow-none disabled:active:scale-100 cursor-pointer">My Profile</Link>
            </div>
            
            <h4 className="text-zinc-400 mt-5">Recent Posts from Everyone</h4>
            {posts.length === 0 ? (
                <p className="text-zinc-500 mt-2">No posts yet.</p>
            ) : (
                posts.map((post) => (
                    <div key={post._id} className="border bg-zinc-800 border-zinc-600 mt-3 p-4 rounded-md">
                        <div className="flex items-center gap-3 mb-3">
                            <Link to={`/profile/${post.user._id}`}>
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-700">
                                    <img 
                                        className="w-full h-full object-cover" 
                                        src={`http://localhost:3000/images/uploads/${post.user?.profilepic || 'default.png'}`} 
                                        alt="" 
                                    />
                                </div>
                            </Link>
                            <div>
                                <Link to={`/profile/${post.user._id}`}>
                                    <h3 className="text-blue-400 font-semibold">@{post.user?.username || 'unknown'}</h3>
                                </Link>
                                <p className="text-xs mt-0.5 text-zinc-500">
                                    {new Date(post.date?.date || post.date).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <p className="text-sm">{post.content}</p>
                        <p className="text-sm mt-3">{post.likes?.length || 0} likes</p>
                        <div className="flex gap-6 mt-4">
                            <button className="inline-block transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-red-400 hover:text-red-300" onClick={() => handleLike(post._id)}>
                                {post.likes && currentUser && post.likes.indexOf(currentUser._id) === -1 ? "Like" : "Unlike"}
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Feed;
