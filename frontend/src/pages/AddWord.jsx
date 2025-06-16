import { useState } from "react";

function AddWord() {
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [synonyms, setSynonyms] = useState("");
  const [example, setExample] = useState("");
  const [banner, setBanner] = useState({ type: null, message: "" });
  const [bannerTimeout, setBannerTimeout] = useState(null);

  const showBanner = (type, message) => {
    setBanner({ type, message });
    if (bannerTimeout) clearTimeout(bannerTimeout);
    const timeout = setTimeout(() => setBanner({ type: null, message: "" }), 3500);
    setBannerTimeout(timeout);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      text: word,
      meaning,
      synonyms: synonyms.split(",").map(s => s.trim()),
      example,
    };

    const res = await fetch("http://localhost:8080/v1/vocab", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      const errorMsg = (data && (data.error || data.message || JSON.stringify(data))) || "";
      if (errorMsg.toLowerCase().includes("already exists")) {
        showBanner("error", "❌ This word is already added!");
        return;
      }
      showBanner("error", "❌ Failed to add word. Please try again.");
      return;
    }

    showBanner("success", "✅ Word added successfully!");
    setWord("");
    setMeaning("");
    setSynonyms("");
    setExample("");
  };

  // Clear banner when user starts typing a new word
  const handleWordChange = (e) => {
    setWord(e.target.value);
    if (banner.type) setBanner({ type: null, message: "" });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-pink-500 via-red-400 to-red-500 p-6 text-white">
      <h1 className="text-5xl font-extrabold mb-8">➕ Add New Word</h1>

      {/* Inline Banner */}
      {banner.type && (
        <div
          className={`mb-6 px-6 py-3 rounded-lg shadow-lg text-lg font-semibold transition-all duration-300
            ${banner.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
        >
          {banner.message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 w-full max-w-3xl bg-gradient-to-br from-purple-50 via-pink-50 to-white rounded-3xl p-10 shadow-2xl border border-purple-100"
      >
        {/* Word Field */}
        <input
          type="text"
          className="p-3 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all duration-200 hover:border-purple-200"
          placeholder="Enter Word"
          value={word}
          onChange={handleWordChange}
          required
        />

        {/* Meaning Field */}
        <textarea
          className="p-3 border rounded-lg text-black h-32 resize-none focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all duration-200 hover:border-purple-200"
          placeholder="Enter Meaning"
          value={meaning}
          onChange={(e) => setMeaning(e.target.value)}
          required
        />

        {/* Synonyms Field */}
        <input
          type="text"
          className="p-3 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all duration-200 hover:border-purple-200"
          placeholder="Enter Synonyms (comma separated)"
          value={synonyms}
          onChange={(e) => setSynonyms(e.target.value)}
        />

        {/* Example Sentence */}
        <textarea
          className="p-3 border rounded-lg text-black h-24 resize-none focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all duration-200 hover:border-purple-200"
          placeholder="Enter Example Sentence"
          value={example}
          onChange={(e) => setExample(e.target.value)}
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 text-white font-semibold px-8 py-3 rounded-xl text-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
        >
          Add Word
        </button>
      </form>
    </div>
  );
}

export default AddWord;
