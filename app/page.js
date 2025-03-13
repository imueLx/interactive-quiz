import Image from "next/image";
import {
  FaRocket,
  FaGamepad,
  FaPalette,
  FaMusic,
  FaStar,
  FaRegLaughBeam,
} from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-50 to-yellow-50">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 text-center md:text-left">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8">
          <div className="md:w-1/2">
            <h1 className="text-5xl md:text-6xl font-extrabold text-purple-800 mb-6">
              Learn Through Play!
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              Dive into a world of colorful quizzes, exciting challenges, and
              awesome rewards! 🎉
            </p>
            <button className="bg-purple-600 text-white px-8 py-4 rounded-full text-lg shadow-md hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2">
              Start Adventure!
              <FaRegLaughBeam className="animate-bounce" />
            </button>
          </div>
          <div className="md:w-1/2 relative">
            <Image
              src="/kids-mobile.jpg"
              alt="Happy Kids"
              width={600}
              height={600}
              className="rounded-2xl shadow-lg w-full hover:rotate-2 transition-transform"
            />
          </div>
        </div>
      </section>

      {/* Subject Cards */}
      <section className="container mx-auto px-6 py-16 text-center">
        <h2 className="text-4xl font-bold text-purple-900 mb-10">
          Explore Learning Worlds 🌍
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { icon: FaGamepad, title: "Math Games", color: "bg-blue-500" },
            { icon: FaPalette, title: "Art & Colors", color: "bg-pink-500" },
            { icon: FaMusic, title: "Music Fun", color: "bg-yellow-500" },
            { icon: FaRocket, title: "Science Lab", color: "bg-green-500" },
          ].map((subject, index) => (
            <div
              key={index}
              className={`${subject.color} p-8 rounded-3xl shadow-lg text-white cursor-pointer transition-all hover:shadow-xl hover:scale-105`}
            >
              <subject.icon className="text-6xl mx-auto mb-4" />
              <h3 className="text-2xl font-semibold">{subject.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Progress Section */}
      <section className="bg-gray-100 py-16 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-purple-900 mb-8">
            Collect Stars & Unlock Rewards! ⭐
          </h2>
          <div className="max-w-2xl mx-auto bg-gray-200 rounded-full h-8 mb-6 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all"
              style={{ width: "65%" }}
            ></div>
          </div>
          <div className="flex justify-center gap-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-yellow-400 p-4 rounded-full shadow-md cursor-pointer hover:scale-110 transition-transform text-2xl"
              >
                🏆
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
