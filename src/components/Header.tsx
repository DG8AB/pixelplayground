"use client";

import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import LoginModal from './LoginModal';

const Header = () => {
  const { user, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md p-4 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
          🎨 Pixel Playground
        </Link>
        <nav className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-gray-700 dark:text-gray-300 hidden sm:inline">Welcome, {user.username}!</span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
            >
              Login
            </button>
          )}
          <ThemeToggle />
        </nav>
      </div>
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </header>
  );
};

export default Header;
