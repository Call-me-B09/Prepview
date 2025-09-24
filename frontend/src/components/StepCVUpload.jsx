import { UploadCloud, ArrowRight } from "lucide-react";

export default function StepCVUpload({ cvFile, setCvFile, setStep }) {
  return (
    <div className="flex flex-col gap-6 items-center">
      <p className="text-gray-300 text-lg flex items-center gap-2">
        <UploadCloud size={20} /> Upload Your CV (Optional)
      </p>
      <input type="file" accept=".pdf,.docx" onChange={(e) => setCvFile(e.target.files[0])} className="hidden" id="cvInput" />
      <label
        htmlFor="cvInput"
        className={`w-full max-w-md rounded-xl border-2 border-dashed ${cvFile ? "border-blue-400" : "border-gray-600"} cursor-pointer hover:border-blue-500 transition-all p-8 text-center bg-gradient-to-br from-gray-800/40 to-black/40`}
      >
        {cvFile ? (
          <p className="text-blue-400 font-medium">{cvFile.name}</p>
        ) : (
          <>
            <p className="text-gray-400 mb-2">Drag and drop your CV here or click to browse</p>
            <p className="text-gray-500 text-sm">Supported: PDF, DOCX</p>
            <p className="mt-2 text-blue-500 underline cursor-pointer">Select File</p>
          </>
        )}
      </label>
      <button
        onClick={() => setStep(2)}
        className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium bg-blue-600 hover:bg-blue-700"
      >
        Continue <ArrowRight size={16} />
      </button>
    </div>
  );
}
