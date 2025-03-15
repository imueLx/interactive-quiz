import React from "react";
import { FaEnvelope, FaPhone, FaSmile } from "react-icons/fa";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 border-2 border-purple-100">
        <div className="text-center mb-6">
          <FaSmile className="text-4xl text-purple-500 mx-auto mb-4 animate-bounce" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Let's Chat! 💬
          </h1>
          <p className="text-gray-600">
            No question is too small - I'm happy to help!
          </p>
        </div>

        <div className="space-y-5">
          <div className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <div className="flex items-center space-x-3">
              <FaEnvelope className="text-2xl text-purple-600" />
              <a
                href="mailto:teacher@example.com"
                className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
              >
                Shoot me an email
              </a>
            </div>
            <p className="text-sm text-gray-500 mt-1 ml-9">
              teacher@example.com
            </p>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <div className="flex items-center space-x-3">
              <FaPhone className="text-2xl text-blue-600" />
              <a
                href="tel:+1234567890"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Give me a call
              </a>
            </div>
            <p className="text-sm text-gray-500 mt-1 ml-9">(123) 456-7890</p>
          </div>
        </div>

        <p className="mt-6 text-center text-gray-500 text-sm flex items-center justify-center">
          <span className="mr-2">📌</span>
          Don't worry, I'm here to help!
        </p>
      </div>
    </div>
  );
};

export default ContactPage;
