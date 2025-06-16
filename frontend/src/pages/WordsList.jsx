import React, { useEffect, useState } from "react";

function WordsList() {
  const [words, setWords] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/v1/vocab/all")
      .then((res) => res.json())
      .then((data) => setWords(data.words || []));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6 mt-10">📚 All Words</h2>
      <div className="w-full max-w-xl">
        {words.map((word, idx) => (
          <div key={idx} className="mb-4">
            <button
              className="w-full text-left bg-white rounded-lg shadow px-6 py-4 font-semibold text-lg hover:bg-gray-100 transition text-purple-700"
              onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
            >
              {word.text}
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
        {words.length === 0 && <div className="text-center text-gray-200">No words found.</div>}
      </div>
    </div>
  );
}

export default WordsList; 