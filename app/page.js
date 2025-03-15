import Image from "next/image";
import Link from "next/link";
import { FaRocket } from "react-icons/fa";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 md:px-6 py-8 md:py-12 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-blue-600 mb-4 md:mb-6 leading-tight">
            <span className="inline-block">📚 English</span>
            <span className="inline-block">Adventure Time! 🌟</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-700 mb-6 md:mb-8 flex flex-wrap justify-center gap-2">
            <span>Learn grammar magic</span>
            <span className="hidden md:inline">🧙♂️</span>
            <span>spelling secrets</span>
            <span className="hidden md:inline">🔍</span>
            <span>reading superpowers! 💪</span>
          </p>

          <Link href="/quiz">
            <button className="cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl text-lg md:text-xl shadow-lg hover:scale-105 transition-all flex items-center gap-2 mx-auto">
              <FaRocket className="text-xl md:text-2xl animate-pulse" />
              <span className="hidden md:inline">Start Learning</span>{" "}
              Adventure!
            </button>
          </Link>

          <div className="mt-8 md:mt-12 relative">
            <div className="aspect-video relative rounded-2xl md:rounded-3xl shadow-xl border-4 md:border-8 border-white overflow-hidden mx-auto">
              <Image
                src="/learning-fun.jpg"
                alt="Happy kids learning"
                fill
                priority
                className="object-cover hover:scale-105 transition-transform"
              />
            </div>
            <div className="absolute -bottom-4 md:-bottom-6 left-1/2 -translate-x-1/2 flex gap-2 md:gap-4">
              {["🐻", "🐰", "🦉"].map((e, i) => (
                <span key={i} className="text-2xl md:text-4xl animate-float">
                  {e}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <PWAInstallPrompt />

      {/* Learning Paths */}
      <section className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <h2 className="text-2xl md:text-4xl font-bold text-center text-blue-800 mb-8 md:mb-12">
          Explore Learning Worlds 🌍
        </h2>
        <div className="grid md:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
          {[
            {
              title: "Grammar Galaxy",
              emoji: "📘",
              color: "bg-blue-200",
              description: "Master word rules!",
            },
            {
              title: "Writing Wonderland",
              emoji: "✏️",
              color: "bg-green-200",
              description: "Create amazing stories!",
            },
            {
              title: "Reading Rainbow",
              emoji: "🌈",
              color: "bg-purple-200",
              description: "Discover new worlds!",
            },
          ].map((topic, index) => (
            <div
              key={index}
              className={`${topic.color} p-4 md:p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer`}
            >
              <div className="bg-white w-fit p-3 md:p-4 rounded-full mx-auto mb-3 md:mb-4 -mt-6 md:-mt-8">
                <span className="text-2xl md:text-4xl">{topic.emoji}</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-1 md:mb-2">
                {topic.title}
              </h3>
              <p className="text-sm md:text-base text-gray-600">
                {topic.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Progress & Achievements */}
      <section className="bg-gradient-to-r from-blue-100 to-pink-100 py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-blue-800 mb-6 md:mb-8">
            Collect Stars & Trophies! ⭐🏆
          </h2>

          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-white p-1 rounded-full shadow-inner">
              <div
                className="bg-gradient-to-r from-yellow-400 to-orange-400 h-8 rounded-full transition-all"
                style={{ width: "75%" }}
              >
                <div className="flex justify-end pr-4">
                  <span className="text-white font-bold">75%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {[
              "Grammar Guru",
              "Word Wizard",
              "Story Master",
              "Quick Learner",
              "Reading Star",
            ].map((title, i) => (
              <div
                key={i}
                className="bg-white p-2 md:p-4 rounded-xl shadow-md hover:scale-105 transition-transform"
              >
                <div className="text-2xl md:text-4xl mb-1 md:mb-2">
                  {i < 3 ? "🏅" : "🎖️"}
                </div>
                <p className="text-sm md:text-base font-bold text-gray-700">
                  {title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
