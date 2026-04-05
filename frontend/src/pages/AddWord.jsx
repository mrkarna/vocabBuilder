import { useState } from "react";

function AddWord() {
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [synonyms, setSynonyms] = useState("");
  const [example, setExample] = useState("");
  const [banner, setBanner] = useState({ type: null, message: "" });
  const [bannerTimeout, setBannerTimeout] = useState(null);
  const [loading, setLoading] = useState(false);

  const showBanner = (type, message) => {
    setBanner({ type, message });
    if (bannerTimeout) clearTimeout(bannerTimeout);
    const timeout = setTimeout(() => setBanner({ type: null, message: "" }), 3500);
    setBannerTimeout(timeout);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      const errorMsg = (data && (data.error || data.message || JSON.stringify(data))) || "";
      if (errorMsg.toLowerCase().includes("already exists")) {
        showBanner("error", "This word is already in your collection.");
        return;
      }
      showBanner("error", "Failed to add word. Please try again.");
      return;
    }

    showBanner("success", `"${word}" added to your collection!`);
    setWord("");
    setMeaning("");
    setSynonyms("");
    setExample("");
  };

  const handleWordChange = (e) => {
    setWord(e.target.value);
    if (banner.type) setBanner({ type: null, message: "" });
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500/60 focus:bg-white/8 transition-all duration-200 resize-none";

  return (
    <div className="relative min-h-[calc(100vh-5rem)] bg-[#260e5c] text-white overflow-hidden flex items-center justify-center p-6">

      {/* Animated background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="animate-blob delay-0    absolute -top-32 -left-32  w-[500px] h-[500px] rounded-full bg-violet-500 opacity-40 blur-[80px]" />
        <div className="animate-blob delay-2000 absolute top-1/3 right-0   w-[400px] h-[400px] rounded-full bg-fuchsia-500 opacity-35 blur-[80px]" />
        <div className="animate-blob delay-4000 absolute bottom-0 left-1/3 w-[450px] h-[450px] rounded-full bg-pink-500 opacity-35 blur-[80px]" />
        <div className="animate-blob delay-6000 absolute bottom-10 right-1/4 w-[350px] h-[350px] rounded-full bg-indigo-400 opacity-30 blur-[80px]" />
      </div>

      <div className="relative z-10 w-full max-w-xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black tracking-tight mb-1">
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              Add New Word
            </span>
          </h1>
          <p className="text-white/30 text-sm">Expand your vocabulary, one word at a time</p>
        </div>

        {/* Banner */}
        {banner.type && (
          <div className={`mb-5 px-4 py-3 rounded-xl text-sm font-medium border animate-fade-in
            ${banner.type === "success"
              ? "bg-green-500/15 border-green-500/25 text-green-300"
              : "bg-red-500/15 border-red-500/25 text-red-300"}`}>
            {banner.type === "success" ? "✓ " : "✕ "}{banner.message}
          </div>
        )}

        {/* Form card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Word */}
            <div>
              <label className="text-[10px] uppercase tracking-[0.15em] text-white/30 block mb-1.5">Word *</label>
              <input
                type="text"
                className={inputClass}
                placeholder="e.g. serendipity"
                value={word}
                onChange={handleWordChange}
                required
              />
            </div>

            {/* Meaning */}
            <div>
              <label className="text-[10px] uppercase tracking-[0.15em] text-white/30 block mb-1.5">Meaning *</label>
              <textarea
                className={`${inputClass} h-24`}
                placeholder="What does it mean?"
                value={meaning}
                onChange={(e) => setMeaning(e.target.value)}
                required
              />
            </div>

            {/* Synonyms */}
            <div>
              <label className="text-[10px] uppercase tracking-[0.15em] text-white/30 block mb-1.5">Synonyms <span className="normal-case text-white/15">(comma separated)</span></label>
              <input
                type="text"
                className={inputClass}
                placeholder="e.g. luck, chance, fate"
                value={synonyms}
                onChange={(e) => setSynonyms(e.target.value)}
              />
            </div>

            {/* Example */}
            <div>
              <label className="text-[10px] uppercase tracking-[0.15em] text-white/30 block mb-1.5">Example Sentence</label>
              <textarea
                className={`${inputClass} h-20`}
                placeholder="Use it in a sentence..."
                value={example}
                onChange={(e) => setExample(e.target.value)}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400 text-white shadow-lg shadow-violet-500/25 transition-all duration-200 hover:shadow-violet-500/40 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              {loading ? "Adding..." : "+ Add Word"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddWord;
