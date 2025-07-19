import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center fixed w-full top-0 z-50">
      <Link to="/" className="text-2xl font-bold text-purple-600">
        📚 VocabBuilder
      </Link>

      <div className="flex gap-6">
        <Link to="/add" className="text-gray-700 hover:text-purple-600 font-medium">
          ➕ Add Word
        </Link>
        <Link to="/game" className="text-gray-700 hover:text-purple-600 font-medium">
          🎯 Play Game
        </Link>
        <Link to="/words" className="text-gray-700 hover:text-purple-600 font-medium">
          📖 All Words
        </Link>
        <Link to="/edit" className="text-gray-700 hover:text-purple-600 font-medium">
          ✏️ Edit
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
