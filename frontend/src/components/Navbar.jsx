import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const { pathname } = useLocation();

  const linkClass = (path) =>
    `font-medium text-sm transition-all duration-200 ${
      pathname === path
        ? "text-white border-b-2 border-fuchsia-400 pb-0.5"
        : "text-white/80 hover:text-white"
    }`;

  return (
    <nav className="bg-[#260e5c] py-4 px-8 flex justify-between items-center fixed w-full top-0 z-50">
      <Link to="/" className="text-xl font-black flex items-center gap-2">
        <span className="text-2xl">📚</span>
        <span className="bg-gradient-to-r from-pink-300 via-fuchsia-200 to-violet-300 bg-clip-text text-transparent">VocabBuilder</span>
      </Link>

      <div className="flex gap-6">
        <Link to="/add" className={linkClass("/add")}>
          ➕ Add Word
        </Link>
        <Link to="/game" className={linkClass("/game")}>
          🎯 Play Game
        </Link>
        <Link to="/words" className={linkClass("/words")}>
          📖 All Words
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
