import { useState } from "react";

function AddWord() {
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [synonyms, setSynonyms] = useState("");
  const [example, setExample] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      text: word,
      meaning,
      synonyms: synonyms.split(",").map(s => s.trim()),
      example,
    };

    await fetch("http://localhost:8080/v1/vocab", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    alert("✅ Word added successfully!");
    setWord("");
    setMeaning("");
    setSynonyms("");
    setExample("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-pink-500 via-red-400 to-red-500 p-6 text-white">
      <h1 className="text-5xl font-extrabold mb-8">➕ Add New Word</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 w-full max-w-3xl bg-white rounded-2xl p-8 shadow-lg"
      >
        {/* Word Field */}
        <input
          type="text"
          className="p-3 border rounded-lg text-black"
          placeholder="Enter Word"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          required
        />

        {/* Meaning Field */}
        <textarea
          className="p-3 border rounded-lg text-black h-32 resize-none"
          placeholder="Enter Meaning"
          value={meaning}
          onChange={(e) => setMeaning(e.target.value)}
          required
        />

        {/* Synonyms Field */}
        <input
          type="text"
          className="p-3 border rounded-lg text-black"
          placeholder="Enter Synonyms (comma separated)"
          value={synonyms}
          onChange={(e) => setSynonyms(e.target.value)}
        />

        {/* Example Sentence */}
        <textarea
          className="p-3 border rounded-lg text-black h-24 resize-none"
          placeholder="Enter Example Sentence"
          value={example}
          onChange={(e) => setExample(e.target.value)}
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg text-lg transition transform hover:scale-105"
        >
          Add Word
        </button>
      </form>
    </div>
  );
}

export default AddWord;
