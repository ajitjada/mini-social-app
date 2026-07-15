import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData.email, formData.password);
            toast.success('Logged in successfully');
            navigate('/profile');
        } catch (error) {
            console.error('Login failed', error);
            if (error.response?.status === 400 || error.response?.status === 401) {
                toast.error("Invalid email or password.");
            } else {
                toast.error(error.response?.data?.message || 'Login failed');
            }
        }
    };

    return (
        <div className="text-white w-full flex items-center justify-center min-h-[80vh] p-4 sm:p-10">
            <div className="w-full max-w-md flex flex-col items-center border bg-zinc-800 border-zinc-600 p-8 rounded-md">
                <h1 className="text-3xl font-semibold mb-6 text-center">Welcome Back</h1>
                <form onSubmit={handleSubmit} className="flex flex-col w-full gap-3">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-sm font-medium ml-1">Email</label>
                        <input id="email" className="w-full px-5 py-2 border border-zinc-500 rounded-xl bg-zinc-900" type="email" placeholder="Email" name="email" value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="password" className="text-sm font-medium ml-1">Password</label>
                        <input id="password" className="w-full px-5 py-2 border border-zinc-500 rounded-xl bg-zinc-900" type="password" placeholder="Password" name="password" value={formData.password} onChange={handleChange} />
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <input type="checkbox" id="remember" className="w-4 h-4 rounded border-zinc-500 bg-zinc-900 accent-blue-500 cursor-pointer" />
                        <label htmlFor="remember" className="text-sm text-zinc-300 cursor-pointer">Remember me</label>
                    </div>
                    <button className="w-full px-5 py-2 mt-2 bg-blue-500 text-white font-medium rounded-md transition-all duration-300 hover:scale-105 active:scale-95 hover:brightness-110 hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:brightness-100 disabled:hover:shadow-none disabled:active:scale-100 cursor-pointer">Login</button>
                    <p className="flex justify-center gap-2 mt-4 text-sm text-zinc-300">
                        Don't have an account? <Link className="text-blue-500 underline hover:text-blue-400" to="/register">Sign up</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
