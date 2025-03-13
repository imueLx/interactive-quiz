export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-purple-900 to-pink-900 text-white mt-16 pb-10 pt-8">
      <div className="container mx-auto px-6 text-center">
        <div className="mb-6 flex justify-center space-x-6">
          {["⭐", "🎉", "🌈", "🚀"].map((emoji, i) => (
            <span key={i} className="text-2xl animate-bounce">
              {emoji}
            </span>
          ))}
        </div>
        <p className="text-sm opacity-80">
          &copy; {new Date().getFullYear()} QuizFun. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
