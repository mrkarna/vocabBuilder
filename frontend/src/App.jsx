import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddWord from "./pages/AddWord";
import Game from "./pages/Game";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="pt-20"> {/* To push content below the navbar */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddWord />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
