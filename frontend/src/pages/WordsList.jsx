import React, { useEffect, useState } from "react";

function WordsList() {
  const [words, setWords] = useState([]);
  const [sortBy, setSortBy] = useState("time"); // "time" or "alpha"
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/v1/vocab/all")
      .then((res) => res.json())
      .then((data) => setWords(data.words || []));
  }, []);

  // Sorting logic
  const sortedWords = [...words].sort((a, b) => {
    if (sortBy === "alpha") {
      return a.text.localeCompare(b.text);
    } else {
      // Default: sort by created_at descending (newest first)
      return (b.created_at || "").localeCompare(a.created_at || "");
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white flex flex-row items-start">
      {/* Sidebar */}
      <div className="w-60 pt-20 pl-8 pr-4">
        <div className="bg-white bg-opacity-20 rounded-xl p-4 shadow mb-8">
          <div className="font-bold text-lg mb-2 text-white">Sort By</div>
          <button
            className={`block w-full text-left px-3 py-2 rounded mb-2 transition font-medium ${sortBy === "time" ? "bg-white text-purple-700" : "hover:bg-white/30 text-white"}`}
            onClick={() => setSortBy("time")}
          >
            🕒 Time Added
          </button>
          <button
            className={`block w-full text-left px-3 py-2 rounded transition font-medium ${sortBy === "alpha" ? "bg-white text-purple-700" : "hover:bg-white/30 text-white"}`}
            onClick={() => setSortBy("alpha")}
          >
            🔤 Alphabetical
          </button>
        </div>
      </div>
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-6 mt-10">📚 All Words</h2>
        <div className="w-full max-w-xl flex flex-col gap-8">
          {sortedWords.map((word, idx) => {
            const expanded = expandedIndex === idx;
            // Alternate backgrounds
            const bgColors = [
              "bg-gradient-to-r from-pink-100 via-purple-100 to-white",
              "bg-gradient-to-r from-purple-100 via-pink-100 to-white"
            ];
            const cardBg = bgColors[idx % 2];
            const accentColors = ["bg-pink-400", "bg-purple-400"];
            const accentBar = accentColors[idx % 2];
            return (
              <div
                key={idx}
                className={`${cardBg} rounded-xl shadow-lg p-4 text-black w-full transition-all duration-200 cursor-pointer border border-transparent ${expanded ? "ring-2 ring-purple-300" : "hover:border-purple-200 hover:shadow-xl"}`}
                onClick={() => setExpandedIndex(expanded ? null : idx)}
                style={{ minHeight: 56 }}
              >
                {/* Word Title */}
                <div className="text-xl font-extrabold mb-1 text-purple-700 pl-4">
                  {word.text}
                </div>
                {expanded && (
                  <div className="animate-fade-in pl-4">
                    {/* Meaning */}
                    <div className="text-base mb-4 text-gray-700">{word.meaning}</div>

                    {/* Synonyms */}
                    {word.synonyms && word.synonyms.filter(s => s && s.trim()).length > 0 && (
                      <div className="mb-4">
                        <div className="text-base font-semibold mb-1 text-purple-600">Synonyms:</div>
                        <div className="flex flex-wrap gap-2">
                          {word.synonyms.filter(s => s && s.trim()).map((synonym, sidx) => (
                            <span
                              key={sidx}
                              className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-medium"
                            >
                              {synonym}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Example */}
                    {word.example && (
                      <div className="text-gray-600 italic text-sm mt-1">
                        {word.example.split('\n').map((line, i) => (
                          <span key={i}>
                            &quot; {line} &quot;<br />
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Time Added */}
                    {word.created_at && (
                      <div className="text-xs text-gray-400 font-normal mt-2 text-right">
                        Added: {new Date(word.created_at).toLocaleString()}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {sortedWords.length === 0 && <div className="text-center text-gray-200">No words found.</div>}
        </div>
      </div>
    </div>
  );
}

export default WordsList; 