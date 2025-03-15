import React from "react";
import { FaEnvelope, FaPhone } from "react-icons/fa";

const ContactPage = () => {
  return (
    <div className="container mx-auto p-6 bg-yellow-100 rounded-lg shadow-md text-center">
      <h1 className="text-4xl font-bold mb-4 text-purple-600">
        Contact Your Teacher
      </h1>
      <p className="text-lg mb-6 text-gray-700">
        If you have any questions, feel free to reach out to your teacher:
      </p>
      <div className="flex flex-col items-center">
        <p className="text-xl mb-4 text-gray-800 flex items-center">
          <FaEnvelope className="mr-2 text-red-500" />
          <a href="mailto:teacher@example.com" className="hover:underline">
            teacher@example.com
          </a>
        </p>
        <p className="text-xl text-gray-800 flex items-center">
          <FaPhone className="mr-2 text-green-500" />
          <a href="tel:+1234567890" className="hover:underline">
            (123) 456-7890
          </a>
        </p>
      </div>
      <div className="mt-6">
        <img
          src="https://example.com/fun-teacher.png"
          alt="Fun Teacher"
          className="mx-auto w-1/2 rounded-full border-4 border-purple-300"
        />
      </div>
    </div>
  );
};

export default ContactPage;
