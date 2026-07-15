import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { checkAuth } = useAuth();
    const [content, setContent] = useState('');
    
    // In the original EJS, /edit/:id route wasn't in index.js, wait!
    // Let's assume we can either fetch it or just redirect. We need the existing post content.
    // EJS had it in req.post, but here we can just fetch all posts and find it, or assume empty initially if no direct API.
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await api.get('/profile');
                if (res.data.user && res.data.user.post) {
                    const found = res.data.user.post.find(p => p._id === id);
                    if (found) setContent(found.content);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchPosts();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/update/${id}`, { content });
            await checkAuth(); // Refresh the user's posts
            toast.success("Post updated successfully.");
            navigate('/profile');
        } catch (error) {
            console.error('Update failed', error);
            toast.error(error.response?.data?.message || 'Failed to update post');
        }
    };

    return (
        <div className="bg-zinc-900 h-screen text-white w-full p-10">
            <div className="flex justify-end">
                <Link className="px-5 py-2 bg-red-500 text-white font-medium rounded-md transition-all duration-300 hover:scale-105 active:scale-95 hover:brightness-110 hover:shadow-lg hover:shadow-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:brightness-100 disabled:hover:shadow-none disabled:active:scale-100 cursor-pointer" to="/profile">Cancel</Link>
            </div>
            <h3>Edit your post</h3>
            <div>
                <form onSubmit={handleUpdate}>
                    <textarea 
                        className="w-1/2 p-3 rounded-md mt-5 resize-none block border border-zinc-600 outline-none" 
                        name="content" 
                        placeholder="Write about new post" 
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                    <button className="px-5 py-2 bg-yellow-500 text-black font-medium rounded-md transition-all duration-300 hover:scale-105 active:scale-95 hover:brightness-110 hover:shadow-lg hover:shadow-yellow-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:brightness-100 disabled:hover:shadow-none disabled:active:scale-100 cursor-pointer mt-3">Update Post</button>
                </form>
            </div>
        </div>
    );
};

export default EditPost;
