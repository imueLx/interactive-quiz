import { FaRocket, FaRegLaughBeam } from "react-icons/fa";

export default function Header() {
  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50 py-3">
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FaRocket className="text-3xl text-purple-600 animate-bounce" />
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            QuizFun
          </span>
        </div>

        <div className="flex space-x-4">
          <button className="px-4 py-2 text-purple-600 hover:bg-purple-200 rounded-full text-sm font-medium transition-all">
            Login
          </button>
          <button className="px-5 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium shadow-md hover:scale-105 transition-all">
            Join Free
          </button>
        </div>
      </div>
    </nav>
  );
}
