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
        <div
          className={`bg-white text-black rounded-xl shadow p-4 w-full max-w-xl text-center transition-all duration-200 cursor-pointer border border-transparent ${revealed ? "" : "hover:border-purple-200 hover:shadow-md"}`}
          onClick={() => setRevealed(!revealed)}
        >
          {/* Word Title */}
          <div className="text-xl font-extrabold mb-1 text-purple-700">
            {word.text}
          </div>

          {/* Reveal after click */}
          {revealed && (
            <div className="animate-fade-in">
              {/* Meaning */}
              <div className="text-base mb-4 text-gray-700">{word.meaning}</div>

              {/* Synonyms */}
              {word.synonyms && word.synonyms.length > 0 && (
                <div className="mb-4">
                  <div className="text-base font-semibold mb-1 text-purple-600">Synonyms:</div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {word.synonyms.map((synonym, idx) => (
                      <span
                        key={idx}
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
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Game;
