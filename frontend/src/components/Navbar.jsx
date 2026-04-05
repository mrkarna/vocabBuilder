import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const { pathname } = useLocation();

  const linkClass = (path) =>
    `font-medium transition ${
      pathname === path
        ? "text-purple-600 border-b-2 border-purple-600 pb-0.5"
        : "text-gray-700 hover:text-purple-600"
    }`;

  return (
    <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center fixed w-full top-0 z-50">
      <Link to="/" className="text-2xl font-bold text-purple-600">
        📚 VocabBuilder
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
        <Link to="/edit" className={linkClass("/edit")}>
          ✏️ Edit
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
