import { useState } from "react";

function Game() {
  const [word, setWord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [count, setCount] = useState(0);

  const fetchRandomWord = async () => {
    setLoading(true);
    setRevealed(false);
    setWord(null);
    try {
      const res = await fetch("http://localhost:8080/v1/vocab");
      const data = await res.json();
      setWord(data);
      setCount(c => c + 1);
    } catch (err) {
      console.error("Failed to fetch word:", err);
    } finally {
      setLoading(false);
    }
  };

  const synonyms = word?.synonyms?.filter(s => s && s.trim()) ?? [];

  return (
    <div className="relative min-h-[calc(100vh-5rem)] bg-[#260e5c] text-white overflow-hidden flex flex-col items-center justify-center p-6">

      {/* Animated background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="animate-blob delay-0    absolute -top-32 -left-32  w-[500px] h-[500px] rounded-full bg-violet-500 opacity-40 blur-[80px]" />
        <div className="animate-blob delay-2000 absolute top-1/3 right-0   w-[400px] h-[400px] rounded-full bg-fuchsia-500 opacity-35 blur-[80px]" />
        <div className="animate-blob delay-4000 absolute bottom-0 left-1/3 w-[450px] h-[450px] rounded-full bg-pink-500 opacity-35 blur-[80px]" />
        <div className="animate-blob delay-6000 absolute bottom-10 right-1/4 w-[350px] h-[350px] rounded-full bg-indigo-400 opacity-30 blur-[80px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg flex flex-col items-center">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black tracking-tight mb-1">
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              Guess the Meaning
            </span>
            <span className="ml-3">🎯</span>
          </h1>
          <p className="text-white/30 text-sm">
            {count === 0 ? "Draw a word to get started" : `${count} word${count > 1 ? "s" : ""} drawn this session`}
          </p>
        </div>

        {/* Word card */}
        {word ? (
          <div
            onClick={() => !revealed && setRevealed(true)}
            className={`w-full bg-white/5 backdrop-blur-xl border rounded-2xl transition-all duration-300 overflow-hidden shadow-2xl shadow-black/30
              ${revealed ? "border-white/20 cursor-default" : "border-white/10 hover:border-violet-500/50 hover:bg-white/8 cursor-pointer"}`}
          >
            {/* Word */}
            <div className="px-6 pt-6 pb-4">
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/25 mb-2">Word</div>
              <div className="text-3xl font-black text-white">{word.text}</div>
            </div>

            {/* Divider */}
            <div className="h-px mx-6 bg-gradient-to-r from-violet-500/40 via-fuchsia-500/40 to-transparent" />

            {/* Reveal area */}
            <div className="px-6 py-5">
              {!revealed ? (
                <div className="flex flex-col items-center gap-2 py-4 text-white/25">
                  <div className="text-2xl">👁</div>
                  <div className="text-sm">Click to reveal meaning</div>
                </div>
              ) : (
                <div className="animate-fade-in space-y-4">
                  {/* Meaning */}
                  <div>
                    <div className="text-[9px] uppercase tracking-[0.2em] text-white/25 mb-1.5">Meaning</div>
                    <p className="text-white/80 text-sm leading-relaxed">{word.meaning}</p>
                  </div>

                  {/* Synonyms */}
                  {synonyms.length > 0 && (
                    <div>
                      <div className="text-[9px] uppercase tracking-[0.2em] text-white/25 mb-2">Synonyms</div>
                      <div className="flex flex-wrap gap-1.5">
                        {synonyms.map((s, i) => (
                          <span key={i} className="bg-white/8 border border-white/10 text-white/65 px-3 py-0.5 rounded-full text-xs font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Example */}
                  {word.example && (
                    <div className="bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3">
                      <div className="text-[9px] uppercase tracking-[0.2em] text-white/20 mb-1.5">Example</div>
                      <p className="text-white/40 italic text-xs leading-relaxed">"{word.example.split("\n")[0]}"</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Empty state */
          <div className="w-full bg-white/[0.03] border border-white/8 border-dashed rounded-2xl flex flex-col items-center justify-center py-16 text-white/20">
            <div className="text-4xl mb-3">🎴</div>
            <div className="text-sm">Your word will appear here</div>
          </div>
        )}

        {/* Button */}
        <button
          onClick={fetchRandomWord}
          disabled={loading}
          className="mt-6 w-full py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400 text-white shadow-lg shadow-violet-500/25 transition-all duration-200 hover:shadow-violet-500/40 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
        >
          {loading ? "Drawing..." : revealed ? "✦ Next Word" : "✦ Draw a Word"}
        </button>

      </div>
    </div>
  );
}

export default Game;
