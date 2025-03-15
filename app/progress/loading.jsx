import { FaSpinner } from "react-icons/fa";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <FaSpinner className="animate-spin text-gray-700 h-32 w-32 mb-4" />
      <p className="text-lg text-gray-700">Loading, please wait...</p>
    </div>
  );
};

export default Loading;
