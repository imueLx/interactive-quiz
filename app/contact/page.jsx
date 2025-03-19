import React from "react";
import { FaEnvelope, FaPhone, FaSmile, FaStar } from "react-icons/fa";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-yellow-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border-4 border-purple-200">
        {/* Header Section */}
        <div className="text-center mb-8">
          <FaSmile className="text-6xl text-purple-500 mx-auto mb-4 animate-bounce" />
          <h1 className="text-4xl font-bold text-purple-800 mb-3">
            Let's Chat! 💬
          </h1>
          <p className="text-purple-600 text-lg">
            No question is too small—I'm here to help! 🌟
          </p>
        </div>

        {/* Contact Options */}
        <div className="space-y-6">
          {/* Email Option */}
          <div className="p-5 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors shadow-lg">
            <div className="flex items-center space-x-4">
              <div>
                <a
                  href="mailto:madelenefaller7@gmail.com
"
                  className="text-purple-700 hover:text-purple-600 text-xl font-semibold"
                >
                  📩 Shoot me an email
                </a>
                <p className="text-sm text-purple-500 mt-1">
                  madelenefaller7@gmail.com
                </p>
              </div>
            </div>
          </div>

          {/* Phone Option */}
          <div className="p-5 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors shadow-lg">
            <div className="flex items-center space-x-4">
              <div>
                <a
                  href="tel:+639777493723"
                  className="text-blue-700 hover:text-blue-600 text-xl font-semibold"
                >
                  📞 Give me a call
                </a>
                <p className="text-sm text-blue-500 mt-1">(+63) 977 7493 723</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="mt-8 text-center">
          <p className="text-purple-600 text-lg flex items-center justify-center">
            <span className="mr-2">📌</span>
            Don't worry, I'm here to help! 🎉
          </p>
          <div className="mt-4">
            <FaStar className="text-4xl text-yellow-400 animate-spin inline-block" />
            <p className="text-purple-600 text-lg mt-2">You're a star! ⭐</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
