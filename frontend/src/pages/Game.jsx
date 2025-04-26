import { useState } from "react";

function Game() {
  const [word, setWord] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRandomWord = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:8080/v1/vocab");
    const data = await res.json();
    setWord(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white p-4">
      <h1 className="text-4xl font-bold mb-8">🎯 Guess the Meaning</h1>

      <button
        onClick={fetchRandomWord}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg mb-8 text-xl"
      >
        {loading ? "Loading..." : "Get Random Word"}
      </button>

      {word && (
        <div className="bg-white text-black rounded-lg shadow-lg p-6 text-center w-80">
          <p className="text-2xl font-bold mb-2">{word.text}</p>
          <p className="text-gray-700">{word.meaning}</p>
        </div>
      )}
    </div>
  );
}

export default Game;
