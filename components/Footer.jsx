import Link from "next/link";
import {
  FaBookOpen,
  FaUserGraduate,
  FaTrophy,
  FaEnvelope,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-purple-400 to-blue-300 text-white  pb-12 pt-8">
      <div className="container mx-auto px-6 text-center">
        {/* Floating Icons */}
        <div className="mb-8 flex justify-center space-x-6">
          {["📚", "🎓", "🏅", "✉️"].map((emoji, i) => (
            <span
              key={i}
              className="text-3xl animate-float"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              {emoji}
            </span>
          ))}
        </div>

        {/* Interactive Links */}
        <div className="flex flex-wrap justify-center gap-6 mb-6 text-lg">
          <Link
            href="/"
            className="hover:text-yellow-300 transition transform hover:scale-110"
          >
            🏡 Home
          </Link>
          <Link
            href="/quizzes"
            className="hover:text-yellow-300 transition transform hover:scale-110"
          >
            🧩 Quizzes
          </Link>
          <Link
            href="/progress"
            className="hover:text-yellow-300 transition transform hover:scale-110"
          >
            🏆 Progress
          </Link>
          <Link
            href="/contact"
            className="hover:text-yellow-300 transition transform hover:scale-110"
          >
            📧 Contact
          </Link>
        </div>

        {/* Encouraging Message */}
        <div className="my-6 text-xl font-semibold flex items-center justify-center gap-2">
          <span className="animate-spin">🌍</span>
          Keep Learning, Keep Growing!
          <span className="animate-pulse">🌱</span>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-sm opacity-80 border-t border-white/20 pt-4">
          <p>© {new Date().getFullYear()} Word Adventure</p>
          <p className="mt-2">Made with ❤️ by Learning Wizards</p>
        </div>
      </div>
    </footer>
  );
}
