'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Analytics', href: '/analytics' },
    { name: 'Training', href: '/training' },
    { name: 'About', href: '/about' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 dark:bg-black/70 border-b border-zinc-200/50 dark:border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <span className="text-white font-bold text-lg">J</span>
              </div>
              <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                Javelin AI
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-50 transition-all duration-200"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200"
              aria-label="Login"
            >
              Login
            </button>
            <button
              className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
              aria-label="Get Started"
            >
              Get Started
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle menu"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 space-y-2 border-t border-zinc-200 dark:border-zinc-800 mt-4">
              <button
                className="w-full px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200"
                aria-label="Login"
              >
                Login
              </button>
              <button
                className="w-full px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                aria-label="Get Started"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
