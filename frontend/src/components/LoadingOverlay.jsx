import { motion } from "framer-motion";

export default function LoadingOverlay() {
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-center items-center bg-black/70 text-white">
      <motion.div
        className="w-16 h-16 border-4 border-t-blue-500 border-gray-600 rounded-full mb-4"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
      <p className="text-lg">Please wait...</p>
    </div>
  );
}
