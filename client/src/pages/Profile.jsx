import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Camera } from 'lucide-react';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [content, setContent] = useState('');
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        if (user && user.post) {
            setPosts([...user.post].reverse());
        }
    }, [user]);

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/post', { content });
            // Add the new post to the top of the local state
            setPosts([res.data.post, ...posts]);
            setContent('');
            // Optional: You could update the user context, but just updating local posts is enough for UI.
        } catch (error) {
            console.error('Failed to create post', error);
        }
    };

    const handleLike = async (postId) => {
        try {
            const res = await api.get(`/like/${postId}`);
            const updatedPost = res.data.post;
            setPosts(posts.map(p => p._id === postId ? updatedPost : p));
        } catch (error) {
            console.error('Failed to like/unlike', error);
        }
    };

    const handleDelete = async (postId) => {
        const confirm = window.confirm("Are you sure you want to delete this post?");
        if (!confirm) return;

        try {
            await api.delete(`/post/${postId}`);
            setPosts(posts.filter(p => p._id !== postId));
            toast.success("Post deleted successfully.");
        } catch (error) {
            console.error("Failed to delete post", error);
            toast.error(error.response?.data?.message || "Failed to delete post");
        }
    };

    if (!user) return null;

    return (
        <div className="text-white w-full p-10">
            <div className="flex justify-between items-center">
                <div>
                    <div className="overflow-hidden rounded-full w-20 h-20 mb-2">
                        <img src={`http://localhost:3000/images/uploads/${user.profilepic || 'default.png'}`} alt="" />
                    </div>
                    <Link to="/profile/upload" className="flex items-center justify-center gap-1.5 text-zinc-400 hover:text-white transition-colors text-sm">
                        <Camera className="w-4 h-4" />
                        <span>Change Profile</span>
                    </Link>
                </div>
                <div className="flex gap-3">
                    <Link className="inline-block px-5 py-2 bg-blue-500 text-white font-medium rounded-md transition-all duration-300 hover:scale-105 active:scale-95 hover:brightness-110 hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:brightness-100 disabled:hover:shadow-none disabled:active:scale-100 cursor-pointer" to="/feed">Go to Feed</Link>
                    <button className="inline-block px-5 py-2 bg-red-500 text-white font-medium rounded-md transition-all duration-300 hover:scale-105 active:scale-95 hover:brightness-110 hover:shadow-lg hover:shadow-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:brightness-100 disabled:hover:shadow-none disabled:active:scale-100 cursor-pointer" onClick={handleLogout}>Logout</button>
                </div>
            </div>
            <h1 className="text-4xl font-semibold mt-5 mb-5"> Hello, {user.username}</h1>
            <h3>You can create a new post</h3>
            <div>
                <form onSubmit={handleCreatePost}>
                    <textarea
                        className="w-1/2 p-3 rounded-md mt-5 resize-none block border border-zinc-600 outline-none"
                        name="content"
                        placeholder="Write about new post"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                    <button className="inline-block px-5 py-2 bg-blue-500 text-white font-medium rounded-md transition-all duration-300 hover:scale-105 active:scale-95 hover:brightness-110 hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:brightness-100 disabled:hover:shadow-none disabled:active:scale-100 cursor-pointer mt-3">Create New Post</button>
                </form>
            </div>
            <h4 className="text-zinc-300 mt-5">Your Posts.</h4>
            {posts.map((post) => (
                <div key={post._id} className="border bg-zinc-800 border-zinc-600 mt-3 p-4 rounded-md">
                    <div className="flex items-center gap-3 mb-3">
                        <Link to={`/profile/${user._id}`}>
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-700">
                                <img
                                    className="w-full h-full object-cover"
                                    src={`http://localhost:3000/images/uploads/${user.profilepic || 'default.png'}`}
                                    alt=""
                                />
                            </div>
                        </Link>
                        <div>
                            <Link to={`/profile/${user._id}`}>
                                <h3 className="text-blue-400 font-semibold">@{user.username}</h3>
                            </Link>
                            <p className="text-xs mt-0.5 text-zinc-500">
                                {new Date(post.date?.date || post.date).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <p className="text-sm">{post.content}</p>
                    <p className="text-sm mt-3">{post.likes?.length || 0} likes</p>
                    <div className="flex gap-6 mt-3">
                        <button className="inline-block transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-red-400 hover:text-red-300" onClick={() => handleLike(post._id)}>
                            {post.likes && post.likes.indexOf(user._id) === -1 ? "Like" : "Unlike"}
                        </button>
                        <Link className="inline-block transition-all ml-15 duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-zinc-400 hover:text-white" to={`/edit/${post._id}`}>Edit</Link>
                        <button className="inline-block transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-red-500 hover:text-red-400" onClick={() => handleDelete(post._id)}>Delete</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Profile;
