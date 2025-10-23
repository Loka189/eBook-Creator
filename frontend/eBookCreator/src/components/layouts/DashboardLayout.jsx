import React from 'react'
import { useState, useEffect } from 'react';
import { Album } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';

const DashboardLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => { 
            if (isDropdownOpen && !event.target.closest('.dropdown')) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isDropdownOpen]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-violet-50 to-purple-50">
            {/* Header */}
            <header className="flex justify-between items-center p-6 bg-white/80 backdrop-blur-xl border-b border-violet-200 shadow-[0_4px_20px_rgba(139,92,246,0.1)] sticky top-0 z-50">
                <Link to="/" className="flex items-center space-x-2">
                    <div className="relative">
                        <div className="absolute inset-0 bg-violet-500 blur-lg opacity-30 animate-pulse rounded-full"></div>
                        <Album className="relative w-8 h-8 text-violet-600 drop-shadow-[0_0_6px_rgba(139,92,246,0.4)]" />
                    </div>
                    <span className="text-xl font-bold text-gray-900 select-none">AI eBook Creator</span>
                </Link>

                <div className="dropdown">
                    <ProfileDropdown 
                        isOpen={isDropdownOpen}
                        onToggle={(e) => {
                            e.stopPropagation();
                            setIsDropdownOpen(!isDropdownOpen);
                        }}
                        avatar={user?.avatar || ''}
                        companyName={user?.name || ''}
                        email={user?.email || ''}
                        onLogout={logout}
                    />
                </div>
            </header>

            {/* Main Content */}
            <main className="p-6 max-w-7xl mx-auto">
                {children}
            </main>

            {/* Optional Footer */}
            <footer className="text-center text-sm text-gray-500 py-6">
                &copy; {new Date().getFullYear()} AI eBook Creator. All rights reserved.
            </footer>
        </div>
    )
}

export default DashboardLayout
