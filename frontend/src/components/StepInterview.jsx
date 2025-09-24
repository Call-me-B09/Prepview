import { Mic, StopCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function StepInterview({ 
  questions, 
  currentQuestionIndex, 
  toggleRecording, 
  isRecording, 
  setStep 
}) {
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="flex flex-col gap-8 items-center">
      {/* Question */}
      <h2 className="text-2xl text-white text-center font-medium">
        {currentQuestion.question}
      </h2>

      {/* Recording Visual */}
      <div className="relative w-52 h-52 rounded-full bg-gray-800 border-4 border-blue-500/30 shadow-[0_0_50px_#3b82f6] flex items-center justify-center">
        {isRecording ? (
          <>
            <motion.div
              className="absolute w-full h-full rounded-full bg-blue-500/20"
              animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0.2, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="w-20 h-20 rounded-full bg-blue-500 shadow-lg"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        ) : (
          <p className="text-gray-400 text-sm">Press start to begin</p>
        )}
      </div>

      {/* Record Button */}
      <button
        onClick={toggleRecording}
        className={`flex items-center gap-2 px-8 py-3 rounded-full text-lg shadow-lg ${
          isRecording ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
        } text-white`}
      >
        {isRecording ? <StopCircle size={20} /> : <Mic size={20} />}
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>

      {/* Cancel Button */}
      <button
        onClick={() => setStep(0)}
        className="text-sm text-gray-300 underline mt-2"
      >
        Cancel & Back to Menu
      </button>
    </div>
  );
}
