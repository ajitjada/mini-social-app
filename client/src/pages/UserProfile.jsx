import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

const UserProfile = () => {
    const { userId } = useParams();
    const { user: currentUser } = useAuth();
    const [profileUser, setProfileUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get(`/user/${userId}`);
                setProfileUser(res.data.user);
                if (res.data.user.post) {
                    setPosts([...res.data.user.post].reverse());
                }
            } catch (err) {
                console.error("Failed to fetch user", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [userId]);

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
    if (!profileUser) return <div className="text-white p-10">User not found.</div>;

    return (
        <div className="text-white w-full p-10">
            <div className="flex justify-between items-center">
                <div>
                    <div className="overflow-hidden rounded-full w-20 h-20">
                        <img src={`http://localhost:3000/images/uploads/${profileUser.profilepic || 'default.png'}`} alt="" />
                    </div>
                </div>
                <div className="flex gap-3">
                    <Link className="bg-blue-500 h-9 rounded px-5 flex items-center" to="/feed">Go to Feed</Link>
                </div>
            </div>
            <h1 className="text-4xl font-semibold mt-5 mb-5">{profileUser.username}'s Profile</h1>
            
            <h4 className="text-zinc-400 mt-5">{profileUser.username}'s Posts</h4>
            {posts.length === 0 ? (
                <p className="text-zinc-500 mt-2">No posts yet.</p>
            ) : (
                posts.map((post) => (
                    <div key={post._id} className="border bg-zinc-800 border-zinc-600 mt-3 p-4 rounded-md">
                        <div className="flex items-center gap-3 mb-3">
                            <Link to={`/profile/${profileUser._id}`}>
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-700">
                                    <img 
                                        className="w-full h-full object-cover" 
                                        src={`http://localhost:3000/images/uploads/${profileUser.profilepic || 'default.png'}`} 
                                        alt="" 
                                    />
                                </div>
                            </Link>
                            <div>
                                <Link to={`/profile/${profileUser._id}`}>
                                    <h3 className="text-blue-400 font-semibold">@{profileUser.username}</h3>
                                </Link>
                                <p className="text-xs text-zinc-500">
                                    {new Date(post.date?.date || post.date).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <p className="text-sm">{post.content}</p>
                        <p className="text-sm mt-3">{post.likes?.length || 0} likes</p>
                        <div className="flex gap-7 mt-2">
                            <a className="text-red-400 cursor-pointer" onClick={() => handleLike(post._id)}>
                                {post.likes && currentUser && post.likes.indexOf(currentUser._id) === -1 ? "Like" : "Unlike"}
                            </a>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default UserProfile;
