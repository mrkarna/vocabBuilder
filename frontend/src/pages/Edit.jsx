import React, { useEffect, useState } from "react";

const ACCENTS = [
  "from-violet-500 to-fuchsia-500",
  "from-fuchsia-500 to-pink-500",
  "from-pink-500 to-rose-500",
  "from-rose-500 to-orange-400",
  "from-blue-500 to-violet-500",
  "from-cyan-400 to-blue-500",
];

function Edit() {
  const [words, setWords] = useState([]);
  const [sortBy, setSortBy] = useState("time");
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [editingWord, setEditingWord] = useState(null);
  const [editForm, setEditForm] = useState({ text: "", meaning: "", synonyms: "", example: "" });
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => { fetchWords(); }, []);

  const fetchWords = () => {
    fetch("http://localhost:8080/v1/vocab/all")
      .then((res) => res.json())
      .then((data) => setWords(data.words || []))
      .catch((err) => console.error("Error fetching words:", err));
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const sortedWords = [...words].sort((a, b) =>
    sortBy === "alpha"
      ? a.text.localeCompare(b.text)
      : (b.created_at || "").localeCompare(a.created_at || "")
  );

  const openEdit = (e, word) => {
    e.stopPropagation();
    setEditingWord(word.text);
    setEditForm({
      text: word.text,
      meaning: word.meaning || "",
      synonyms: word.synonyms ? word.synonyms.filter(s => s.trim()).join(", ") : "",
      example: word.example || "",
    });
  };

  const handleSave = async (e) => {
    e.stopPropagation();
    try {
      const res = await fetch(`http://localhost:8080/v1/vocab/${encodeURIComponent(editingWord)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          old_text: editingWord,
          word: {
            text: editForm.text,
            meaning: editForm.meaning,
            synonyms: editForm.synonyms.split(",").map(s => s.trim()).filter(Boolean),
            example: editForm.example,
          },
        }),
      });
      if (res.ok) {
        showMessage("Word updated successfully!", "success");
        setEditingWord(null);
        fetchWords();
      } else {
        showMessage("Failed to update word.", "error");
      }
    } catch {
      showMessage("Error updating word.", "error");
    }
  };

  const handleDelete = async (e, word) => {
    e.stopPropagation();
    if (!window.confirm(`Delete "${word.text}"?`)) return;
    try {
      const res = await fetch(`http://localhost:8080/v1/vocab/${encodeURIComponent(word.text)}`, { method: "DELETE" });
      if (res.ok) {
        showMessage(`"${word.text}" deleted.`, "success");
        setExpandedIndex(null);
        fetchWords();
      } else {
        showMessage("Failed to delete word.", "error");
      }
    } catch {
      showMessage("Error deleting word.", "error");
    }
  };

  const cancelEdit = (e) => {
    e.stopPropagation();
    setEditingWord(null);
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-violet-500/60 transition-all resize-none";

  return (
    <div className="relative min-h-[calc(100vh-5rem)] bg-[#260e5c] text-white overflow-hidden">

      {/* Animated background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="animate-blob delay-0    absolute -top-32 -left-32  w-[500px] h-[500px] rounded-full bg-violet-500 opacity-40 blur-[80px]" />
        <div className="animate-blob delay-2000 absolute top-1/3 right-0   w-[400px] h-[400px] rounded-full bg-fuchsia-500 opacity-35 blur-[80px]" />
        <div className="animate-blob delay-4000 absolute bottom-0 left-1/3 w-[450px] h-[450px] rounded-full bg-pink-500 opacity-35 blur-[80px]" />
        <div className="animate-blob delay-6000 absolute bottom-10 right-1/4 w-[350px] h-[350px] rounded-full bg-indigo-400 opacity-30 blur-[80px]" />
      </div>

      <div className="relative z-10 flex flex-row items-start">

        {/* Sidebar */}
        <div className="w-52 sticky top-20 self-start pt-6 pl-5 pr-3 shrink-0">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
            <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/30 mb-3">Sort</div>
            <button
              onClick={() => setSortBy("time")}
              className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-xl mb-1.5 text-sm font-medium transition-all duration-200
                ${sortBy === "time" ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30" : "text-white/50 hover:text-white hover:bg-white/8"}`}
            >
              🕒 Recent
            </button>
            <button
              onClick={() => setSortBy("alpha")}
              className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200
                ${sortBy === "alpha" ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30" : "text-white/50 hover:text-white hover:bg-white/8"}`}
            >
              🔤 A → Z
            </button>
            <div className="mt-5 pt-4 border-t border-white/8 text-center">
              <div className="text-4xl font-black bg-gradient-to-br from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">{words.length}</div>
              <div className="text-[10px] uppercase tracking-[0.15em] text-white/25 mt-1">words</div>
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 flex flex-col items-center py-8 px-6 min-w-0">

          <div className="w-full max-w-2xl mb-6">
            <h2 className="text-4xl font-black tracking-tight mb-1">
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">Edit Words</span>
              <span className="ml-3 text-2xl">✏️</span>
            </h2>
            <p className="text-white/30 text-sm">Click a word to expand, then edit or delete</p>
          </div>

          {/* Message */}
          {message.text && (
            <div className={`w-full max-w-2xl mb-4 px-4 py-2.5 rounded-xl text-sm font-medium border animate-fade-in
              ${message.type === "success" ? "bg-green-500/15 border-green-500/25 text-green-300" : "bg-red-500/15 border-red-500/25 text-red-300"}`}>
              {message.type === "success" ? "✓ " : "✕ "}{message.text}
            </div>
          )}

          {/* Cards */}
          <div className="w-full max-w-2xl flex flex-col gap-2">
            {sortedWords.map((word, idx) => {
              const expanded = expandedIndex === idx;
              const isEditing = editingWord === word.text;
              const accent = ACCENTS[idx % ACCENTS.length];
              const synonyms = word.synonyms ? word.synonyms.filter(s => s && s.trim()) : [];
              const meaningPreview = word.meaning ? word.meaning.split("\n")[0] : "";

              return (
                <div
                  key={word.text}
                  onClick={() => !isEditing && setExpandedIndex(expanded ? null : idx)}
                  className={`group relative rounded-2xl border transition-all duration-300 overflow-hidden
                    ${expanded
                      ? "bg-white/8 border-white/20 shadow-2xl shadow-black/40 cursor-pointer"
                      : "bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.07] hover:border-white/15 cursor-pointer"
                    }`}
                >
                  {/* Left accent bar */}
                  <div className={`absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b ${accent} transition-all duration-300 ${expanded ? "opacity-100" : "opacity-40 group-hover:opacity-70"}`} />

                  {/* Header */}
                  <div className="flex items-center gap-3 pl-5 pr-4 py-3.5">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 transition-all duration-300
                      ${expanded ? `bg-gradient-to-br ${accent} text-white shadow-md` : "bg-white/10 text-white/40 group-hover:bg-white/15"}`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0 flex items-baseline gap-2 overflow-hidden">
                      <span className={`font-semibold text-base whitespace-nowrap shrink-0 transition-colors duration-200 ${expanded ? "text-white" : "text-white/80 group-hover:text-white"}`}>
                        {word.text}
                      </span>
                      {!expanded && meaningPreview && (
                        <span className="text-white/25 text-xs truncate min-w-0 hidden sm:block">{meaningPreview}</span>
                      )}
                    </div>
                    <span className={`text-white/20 text-[10px] shrink-0 transition-all duration-300 ${expanded ? "rotate-180 text-white/40" : "group-hover:text-white/35"}`}>▾</span>
                  </div>

                  {/* Expanded body */}
                  {expanded && (
                    <div className="pl-5 pr-4 pb-5 animate-fade-in" onClick={e => e.stopPropagation()}>
                      <div className={`h-px w-full bg-gradient-to-r ${accent} opacity-20 mb-4`} />

                      {isEditing ? (
                        /* Edit form */
                        <div className="space-y-3">
                          <div>
                            <label className="text-[9px] uppercase tracking-[0.2em] text-white/30 block mb-1">Word</label>
                            <input value={editForm.text} onChange={e => setEditForm(f => ({ ...f, text: e.target.value }))} className={inputClass} />
                          </div>
                          <div>
                            <label className="text-[9px] uppercase tracking-[0.2em] text-white/30 block mb-1">Meaning</label>
                            <textarea value={editForm.meaning} onChange={e => setEditForm(f => ({ ...f, meaning: e.target.value }))} rows={3} className={inputClass} />
                          </div>
                          <div>
                            <label className="text-[9px] uppercase tracking-[0.2em] text-white/30 block mb-1">Synonyms (comma separated)</label>
                            <input value={editForm.synonyms} onChange={e => setEditForm(f => ({ ...f, synonyms: e.target.value }))} className={inputClass} />
                          </div>
                          <div>
                            <label className="text-[9px] uppercase tracking-[0.2em] text-white/30 block mb-1">Example</label>
                            <textarea value={editForm.example} onChange={e => setEditForm(f => ({ ...f, example: e.target.value }))} rows={2} className={inputClass} />
                          </div>
                          <div className="flex gap-2 pt-1">
                            <button onClick={handleSave} className="px-4 py-1.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/20">
                              Save
                            </button>
                            <button onClick={cancelEdit} className="px-4 py-1.5 bg-white/8 text-white/60 text-xs font-semibold rounded-xl hover:bg-white/12 hover:text-white transition-all">
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Read view */
                        <>
                          <p className="text-white/70 text-sm leading-relaxed mb-4">{word.meaning}</p>

                          {synonyms.length > 0 && (
                            <div className="mb-4">
                              <div className="text-[9px] uppercase tracking-[0.2em] text-white/25 mb-2">Synonyms</div>
                              <div className="flex flex-wrap gap-1.5">
                                {synonyms.map((s, i) => (
                                  <span key={i} className="border border-white/10 text-white/70 px-3 py-0.5 rounded-full text-[11px] font-medium" style={{ background: "rgba(255,255,255,0.06)" }}>
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {word.example && (
                            <div className="bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3 mb-4">
                              <div className="text-[9px] uppercase tracking-[0.2em] text-white/20 mb-1.5">Example</div>
                              <p className="text-white/40 italic text-xs leading-relaxed">"{word.example.split("\n")[0]}"</p>
                            </div>
                          )}

                          {/* Footer: date + actions */}
                          <div className="flex items-center justify-between">
                            {word.created_at
                              ? <span className="text-[10px] text-white/15">Added {new Date(word.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                              : <span />
                            }
                            <div className="flex gap-2">
                              <button
                                onClick={e => openEdit(e, word)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/8 hover:bg-white/15 border border-white/10 hover:border-white/20 text-white/60 hover:text-white text-xs font-medium rounded-xl transition-all duration-200"
                              >
                                ✏️ Edit
                              </button>
                              <button
                                onClick={e => handleDelete(e, word)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300 text-xs font-medium rounded-xl transition-all duration-200"
                              >
                                🗑 Delete
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            {sortedWords.length === 0 && (
              <div className="text-center text-white/25 py-20 text-sm">No words found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Edit;
