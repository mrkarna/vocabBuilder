import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[calc(100vh-5rem)] bg-[#260e5c] text-white overflow-hidden flex flex-col items-center justify-center p-6">

      {/* Animated background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="animate-blob delay-0    absolute -top-32 -left-32  w-[500px] h-[500px] rounded-full bg-violet-500 opacity-40 blur-[80px]" />
        <div className="animate-blob delay-2000 absolute top-1/3 right-0   w-[400px] h-[400px] rounded-full bg-fuchsia-500 opacity-35 blur-[80px]" />
        <div className="animate-blob delay-4000 absolute bottom-0 left-1/3 w-[450px] h-[450px] rounded-full bg-pink-500 opacity-35 blur-[80px]" />
        <div className="animate-blob delay-6000 absolute bottom-10 right-1/4 w-[350px] h-[350px] rounded-full bg-indigo-400 opacity-30 blur-[80px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Title */}
        <div className="text-6xl mb-3">📚</div>
        <h1 className="text-5xl font-black tracking-tight mb-2">
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
            Vocab Builder
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-white/40 text-lg mb-14">
          Boost your vocabulary skills in a fun way!
        </p>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/add")}
            className="group bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/25 text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-violet-500/10"
          >
            <span className="text-xl mr-2">➕</span> Add Word
          </button>

          <button
            onClick={() => navigate("/game")}
            className="group bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400 text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40"
          >
            <span className="text-xl mr-2">🎯</span> Play Vocab Game
          </button>

          <button
            onClick={() => navigate("/words")}
            className="group bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/25 text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-fuchsia-500/10"
          >
            <span className="text-xl mr-2">📖</span> All Words
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
