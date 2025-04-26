import { useState } from "react";

function Game() {
  const [word, setWord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const fetchRandomWord = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:8080/v1/vocab");
    const data = await res.json();
    setWord(data);
    setLoading(false);
    setRevealed(false); // reset reveal for new word
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white p-6">
      <h1 className="text-4xl font-bold mb-8">🎯 Guess the Meaning</h1>

      <button
        onClick={fetchRandomWord}
        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl mb-10 text-xl font-semibold transition transform hover:scale-105"
      >
        {loading ? "Loading..." : "Get Random Word"}
      </button>

      {word && (
        <div className="bg-white text-black rounded-2xl shadow-lg p-8 w-full max-w-xl text-center transition-all duration-500">
          {/* Word Title (click to reveal) */}
          <h2
            className="text-3xl font-bold mb-6 text-indigo-700 cursor-pointer hover:scale-110 transition-transform"
            onClick={() => setRevealed(true)}
          >
            {word.text}
          </h2>

          {/* Reveal after click */}
          {revealed && (
            <div className="animate-fade-in">
              {/* Meaning */}
              <p className="text-gray-700 mb-6">{word.meaning}</p>

              {/* Synonyms */}
              {word.synonyms && word.synonyms.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2 text-purple-600">Synonyms:</h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    {word.synonyms.map((synonym, idx) => (
                      <span
                        key={idx}
                        className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium
                                   transition-transform transform hover:scale-110 hover:bg-purple-200 cursor-pointer"
                      >
                        {synonym}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Example */}
              {word.example && (
                <div className="text-gray-600 italic text-sm">
                  " {word.example} "
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Game;
