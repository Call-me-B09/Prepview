import { ArrowRight, History } from "lucide-react";

export default function StepMenu({ setStep }) {
  return (
    <div className="flex flex-col gap-6 items-center">
      <p className="text-gray-300 text-lg">What would you like to do?</p>
      <div className="w-full flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => setStep(1)}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow"
        >
          Start New Session <ArrowRight size={18} />
        </button>
        <button
          onClick={() => setStep("history")}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium shadow"
        >
          <History size={18} /> View Previous Sessions
        </button>
      </div>
    </div>
  );
}