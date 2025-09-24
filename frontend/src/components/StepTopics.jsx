import { ArrowRight } from "lucide-react";

export default function StepTopics({ topic, setTopic, topics, setTopics, handleStartInterview }) {
  const quickTopics = ["Frontend", "Backend", "DevOps", "Data Science"];

  return (
    <div className="flex flex-col gap-6">
      <p className="text-gray-300 text-lg">Select Interview Topics</p>
      <div className="w-full p-3 rounded bg-gray-800 text-gray-100 flex flex-wrap items-center gap-2 focus-within:ring-2 focus-within:ring-blue-500">
        {topics.map((t, i) => (
          <span key={i} className="flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-blue-500/20 backdrop-blur-md border border-blue-400/30 shadow-sm text-blue-200">
            {t}
            <button onClick={() => setTopics((prev) => prev.filter((_, idx) => idx !== i))} className="ml-1 text-blue-300 hover:text-white transition">×</button>
          </span>
        ))}
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => {
            if ((e.key === " " || e.key === "Enter") && topic.trim() !== "") {
              e.preventDefault();
              if (!topics.includes(topic.trim())) setTopics((prev) => [...prev, topic.trim()]);
              setTopic("");
            }
          }}
          placeholder={topics.length === 0 ? "Type a topic and press Space or Enter" : ""}
          className="flex-1 bg-transparent outline-none text-gray-100 placeholder-gray-500"
        />
      </div>
      <div className="flex flex-wrap gap-3">
        {quickTopics.map((t) => (
          <button
            key={t}
            onClick={() => { if (!topics.includes(t)) setTopics((prev) => [...prev, t]); }}
            className={`px-4 py-2 rounded-full text-sm ${topics.includes(t) ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
          >
            {t}
          </button>
        ))}
      </div>
      <button
        disabled={topics.length === 0}
        onClick={handleStartInterview}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition ${topics.length > 0 ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-700 cursor-not-allowed"}`}
      >
        Start Interview <ArrowRight size={16} />
      </button>
    </div>
  );
}
