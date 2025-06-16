import React, { useEffect, useState } from "react";

function WordsList() {
  const [words, setWords] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [sortBy, setSortBy] = useState("time"); // "time" or "alpha"

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
        <div className="w-full max-w-xl">
          {sortedWords.map((word, idx) => (
            <div key={idx} className="mb-4">
              <button
                className="w-full text-left bg-white rounded-lg shadow px-6 py-4 font-semibold text-lg hover:bg-gray-100 transition text-purple-700"
                onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
              >
                {word.text}
                {word.created_at && (
                  <span className="block text-xs text-gray-400 font-normal mt-1">
                    Added: {new Date(word.created_at).toLocaleString()}
                  </span>
                )}
              </button>
              {expandedIndex === idx && (
                <div className="bg-gray-50 border rounded-b-lg px-6 py-4 text-gray-800">
                  <div className="mb-2"><span className="font-bold">Meaning:</span> {word.meaning}</div>
                  <div className="mb-2"><span className="font-bold">Example:</span> {word.example}</div>
                  <div><span className="font-bold">Synonyms:</span> {word.synonyms && word.synonyms.length > 0 ? word.synonyms.join(", ") : "-"}</div>
                </div>
              )}
            </div>
          ))}
          {sortedWords.length === 0 && <div className="text-center text-gray-200">No words found.</div>}
        </div>
      </div>
    </div>
  );
}

export default WordsList; 