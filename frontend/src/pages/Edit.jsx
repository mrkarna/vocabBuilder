import React, { useEffect, useState } from "react";

function Edit() {
  const [words, setWords] = useState([]);
  const [sortBy, setSortBy] = useState("time");
  const [editingWord, setEditingWord] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [editForm, setEditForm] = useState({
    text: "",
    meaning: "",
    synonyms: "",
    example: ""
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = () => {
    fetch("http://localhost:8080/v1/vocab/all")
      .then((res) => res.json())
      .then((data) => setWords(data.words || []))
      .catch((err) => console.error("Error fetching words:", err));
  };

  const sortedWords = [...words].sort((a, b) => {
    if (sortBy === "alpha") {
      return a.text.localeCompare(b.text);
    } else {
      return (b.created_at || "").localeCompare(a.created_at || "");
    }
  });

  const handleEdit = (word) => {
    setEditingWord(word);
    setEditForm({
      text: word.text,
      meaning: word.meaning,
      synonyms: word.synonyms ? word.synonyms.join(", ") : "",
      example: word.example || ""
    });
  };

  const handleSave = async () => {
    if (!editingWord) return;

    const synonymsArray = editForm.synonyms
      .split(",")
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const updatedWord = {
      old_text: editingWord.text,
      word: {
        text: editForm.text,
        meaning: editForm.meaning,
        synonyms: synonymsArray,
        example: editForm.example
      }
    };

    console.log("Sending update request:", updatedWord);
    console.log("URL:", `http://localhost:8080/v1/vocab/${encodeURIComponent(editingWord.text)}`);

    try {
      const response = await fetch(`http://localhost:8080/v1/vocab/${encodeURIComponent(editingWord.text)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedWord),
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (response.ok) {
        const responseData = await response.json();
        console.log("Response data:", responseData);
        setMessage("Word updated successfully!");
        setEditingWord(null);
        setEditForm({ text: "", meaning: "", synonyms: "", example: "" });
        fetchWords(); // Refresh the list
        setTimeout(() => setMessage(""), 3000);
      } else {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        setMessage("Failed to update word. Please try again.");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error updating word:", error);
      setMessage("Error updating word. Please try again.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleDelete = async (word) => {
    if (!window.confirm(`Are you sure you want to delete "${word.text}"?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/v1/vocab/${encodeURIComponent(word.text)}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessage("Word deleted successfully!");
        fetchWords(); // Refresh the list
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Failed to delete word. Please try again.");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error deleting word:", error);
      setMessage("Error deleting word. Please try again.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleCancel = () => {
    setEditingWord(null);
    setEditForm({ text: "", meaning: "", synonyms: "", example: "" });
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white flex flex-row items-start">
      {/* Sidebar */}
      <div className="w-60 sticky top-20 self-start pt-6 pl-8 pr-4">
        <div className="bg-white bg-opacity-20 rounded-xl p-4 shadow mb-8">
          <div className="font-bold text-lg mb-2 text-white">Sort By</div>
          <button
            className={`block w-full text-left px-3 py-2 rounded mb-2 transition font-medium ${sortBy === "time" ? "bg-white text-purple-700" : "hover:bg-white/30 text-white"}`}
            onClick={() => setSortBy("time")}
          >
            🕒 Time Added
          </button>
          <button
            className={`block w-full text-left px-3 py-2 rounded transition font-medium ${sortBy === "alpha" ? "bg-white text-purple-700" : "hover:bg-white/30 text-white"}`}
            onClick={() => setSortBy("alpha")}
          >
            🔤 Alphabetical
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-6 mt-10">✏️ Edit Words</h2>
        
        {message && (
          <div className={`mb-4 px-4 py-2 rounded-lg text-white font-medium ${
            message.includes("successfully") ? "bg-green-500" : "bg-red-500"
          }`}>
            {message}
          </div>
        )}

        <div className="w-full max-w-4xl flex flex-col gap-8">
          {sortedWords.map((word, idx) => {
            const isEditing = editingWord && editingWord.text === word.text;
            const expanded = expandedIndex === idx;
            const bgColors = [
              "bg-gradient-to-r from-pink-100 via-purple-100 to-white",
              "bg-gradient-to-r from-purple-100 via-pink-100 to-white"
            ];
            const cardBg = bgColors[idx % 2];
            const accentColors = ["bg-pink-400", "bg-purple-400"];
            const accentBar = accentColors[idx % 2];

            return (
              <div
                key={idx}
                className={`${cardBg} rounded-xl shadow-lg p-4 text-black w-full transition-all duration-200 cursor-pointer border border-transparent ${expanded ? "ring-2 ring-purple-300" : "hover:border-purple-200 hover:shadow-xl"}`}
                onClick={() => !isEditing && setExpandedIndex(expanded ? null : idx)}
                style={{ minHeight: 56 }}
              >
                {isEditing ? (
                  // Edit Form
                  <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-purple-700 mb-1">Word</label>
                        <input
                          type="text"
                          value={editForm.text}
                          onChange={(e) => setEditForm({...editForm, text: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-purple-700 mb-1">Meaning</label>
                        <input
                          type="text"
                          value={editForm.meaning}
                          onChange={(e) => setEditForm({...editForm, meaning: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-purple-700 mb-1">Synonyms (comma-separated)</label>
                      <input
                        type="text"
                        value={editForm.synonyms}
                        onChange={(e) => setEditForm({...editForm, synonyms: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="happy, joyful, cheerful"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-purple-700 mb-1">Example</label>
                      <textarea
                        value={editForm.example}
                        onChange={(e) => setEditForm({...editForm, example: e.target.value})}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter example sentence..."
                      />
                    </div>
                    
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
                      >
                        💾 Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-medium"
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Display Mode
                  <div>
                    {/* Word Title */}
                    <div className="text-xl font-extrabold mb-1 text-purple-700 pl-4">
                      {word.text}
                    </div>
                    
                    {expanded && (
                      <div className="animate-fade-in pl-4">
                        {/* Meaning */}
                        <div className="text-base mb-4 text-gray-700">{word.meaning}</div>

                        {/* Synonyms */}
                        {word.synonyms && word.synonyms.filter(s => s && s.trim()).length > 0 && (
                          <div className="mb-4">
                            <div className="text-base font-semibold mb-1 text-purple-600">Synonyms:</div>
                            <div className="flex flex-wrap gap-2">
                              {word.synonyms.filter(s => s && s.trim()).map((synonym, sidx) => (
                                <span
                                  key={sidx}
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

                        {/* Time Added */}
                        {word.created_at && (
                          <div className="text-xs text-gray-400 font-normal mt-2 text-right">
                            Added: {new Date(word.created_at).toLocaleString()}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(word);
                            }}
                            className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(word);
                            }}
                            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {sortedWords.length === 0 && <div className="text-center text-gray-200">No words found.</div>}
        </div>
      </div>
    </div>
  );
}

export default Edit; 