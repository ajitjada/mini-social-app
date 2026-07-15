import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, Home, User, PenSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            toast.success('Logged out successfully');
            navigate('/login');
        } catch (error) {
            toast.error('Failed to log out');
        }
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="text-xl font-bold text-blue-600 flex items-center gap-2">
                        <PenSquare className="w-6 h-6" />
                        MiniSocial
                    </Link>
                    
                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <Link to="/" className="flex items-center gap-1 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-gray-600 hover:text-blue-600">
                                    <Home className="w-5 h-5" />
                                    <span className="hidden sm:inline font-medium">Feed</span>
                                </Link>
                                <Link to="/profile" className="flex items-center gap-1 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-gray-600 hover:text-blue-600">
                                    <User className="w-5 h-5" />
                                    <span className="hidden sm:inline font-medium">Profile</span>
                                </Link>
                                <button 
                                    onClick={handleLogout}
                                    className="flex items-center gap-1 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-gray-600 hover:text-red-600"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className="hidden sm:inline font-medium">Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-gray-600 hover:text-blue-600 font-medium">Login</Link>
                                <Link to="/register" className="px-5 py-2 bg-blue-500 text-white font-medium rounded-md transition-all duration-300 hover:scale-105 active:scale-95 hover:brightness-110 hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:brightness-100 disabled:hover:shadow-none disabled:active:scale-100 cursor-pointer">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
