"use client";
import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (event) => {
      if (!event.target.closest(".mobile-menu")) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuOpen]);

  return (
    <nav className="bg-gradient-to-r from-purple-500 to-blue-400 shadow-lg fixed w-full top-0 z-50 h-16">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center space-x-2 hover:scale-105 transition-transform max-w-[70%]">
          <span className="text-3xl">📚</span>
          <Link
            href="/"
            className="text-xl md:text-2xl font-bold text-white flex items-center gap-1 whitespace-nowrap"
          >
            <span className="animate-bounce">🌈</span>
            <span className="hidden sm:inline">Word</span>Adventure
            <span className="animate-bounce">🎒</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="nav-link">
            🏡 Home
          </Link>
          <Link href="/quizzes" className="nav-link">
            🧩 Quizzes
          </Link>
          <Link href="/progress" className="nav-link">
            🏆 Progress
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(true)}
          className="md:hidden text-2xl text-white p-2 hover:bg-white/20 rounded-full"
        >
          <FaBars />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
          <div className="mobile-menu absolute top-16 right-0 h-[calc(100vh-4rem)] w-full max-w-sm bg-gradient-to-b from-purple-400 to-blue-300 shadow-xl p-6">
            <div className="flex justify-between items-center mb-8">
              <span className="text-2xl font-bold text-white">Menu 🎮</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-2xl text-white p-2 hover:bg-white/20 rounded-full"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4">
              <MobileLink href="/" onClick={() => setMenuOpen(false)}>
                🏡 Home
              </MobileLink>
              <MobileLink href="/quizzes" onClick={() => setMenuOpen(false)}>
                🧩 Quizzes
              </MobileLink>
              <MobileLink href="/progress" onClick={() => setMenuOpen(false)}>
                🏆 Progress
              </MobileLink>
            </div>

            <div className="absolute bottom-6 left-0 right-0 text-center">
              <span className="text-4xl animate-bounce">🐻</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

// Reusable mobile link component
const MobileLink = ({ href, onClick, children }) => (
  <Link
    href={href}
    onClick={onClick}
    className="block text-white p-3 text-lg hover:bg-white/20 rounded-lg transition-colors"
  >
    {children}
  </Link>
);
