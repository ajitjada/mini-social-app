import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const ProfileUpload = () => {
    const [file, setFile] = useState(null);
    const navigate = useNavigate();
    const { checkAuth } = useAuth(); // or updateUser

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.error("Please select an image to upload");
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
            await api.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            await checkAuth(); // Refresh user data to get the new profile picture
            toast.success("Profile picture updated successfully");
            navigate('/profile');
        } catch (error) {
            console.error('Upload failed', error);
            toast.error(error.response?.data?.message || 'Failed to upload profile picture');
        }
    };

    return (
        <div className="text-white w-full p-10">
            <h1 className="text-4xl font-semibold mt-5 mb-5">Upload Profile Pic</h1>
            <form onSubmit={handleSubmit} className="flex gap-3 flex-wrap">
                <input type="file" name="image" onChange={(e) => setFile(e.target.files[0])} />
                <button className="px-5 py-2 bg-blue-500 text-white font-medium rounded-md transition-all duration-300 hover:scale-105 active:scale-95 hover:brightness-110 hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:brightness-100 disabled:hover:shadow-none disabled:active:scale-100 cursor-pointer">Upload</button>
            </form>
        </div>
    );
};

export default ProfileUpload;
