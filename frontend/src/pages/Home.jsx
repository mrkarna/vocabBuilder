import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white p-6">
      {/* Title with animation */}
      <h1 className="text-6xl font-extrabold mb-4 animate-pulse">
        📚 Vocab Builder
      </h1>

      {/* Subtitle */}
      <p className="text-xl mb-12 text-white/80">
        Boost your vocabulary skills in a fun way!
      </p>

      {/* Buttons */}
      <div className="flex gap-8">
        {/* Add Word Button */}
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-xl text-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
          onClick={() => navigate("/add")}
        >
          ➕ Add Word
        </button>

        {/* Play Game Button */}
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-bold px-10 py-4 rounded-xl text-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
          onClick={() => navigate("/game")}
        >
          🎯 Play Vocab Game
        </button>

        {/* All Words Button */}
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-10 py-4 rounded-xl text-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
          onClick={() => navigate("/words")}
        >
          📖 All Words
        </button>
      </div>
    </div>
  );
}

export default Home;
