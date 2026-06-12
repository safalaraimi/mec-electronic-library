import { useState } from "react";
import { useNavigate } from "react-router";
import { AlertCircle, Loader2, Save, X } from "lucide-react";

const CATEGORIES = ["Technology", "Computer Science", "Database", "AI", "Networking", "Security", "Mathematics", "Science", "Literature", "History", "Other"];
const LANGUAGES = ["English", "Arabic", "French", "Spanish", "German", "Chinese", "Other"];
const FORMAT_OPTIONS = ["PDF", "EPUB", "MOBI", "TXT", "DOCX"];

export interface BookFormData {
  title: string;
  author: string;
  publisher: string;
  year: string;
  pages: string;
  category: string;
  description: string;
  language: string;
  size: string;
  isbn: string;
  formats: string[];
}

interface BookFormProps {
  initial?: Partial<BookFormData>;
  onSubmit: (data: BookFormData) => Promise<void>;
  submitLabel: string;
  title: string;
}

const defaultForm: BookFormData = {
  title: "", author: "", publisher: "", year: String(new Date().getFullYear()),
  pages: "", category: "Technology", description: "", language: "English",
  size: "", isbn: "", formats: ["PDF"],
};

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm outline-none transition-all bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-900";

export function BookForm({ initial = {}, onSubmit, submitLabel, title }: BookFormProps) {
  const navigate = useNavigate();
  const [form, setForm] = useState<BookFormData>({ ...defaultForm, ...initial });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (field: keyof BookFormData, value: string | string[]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleFormat = (fmt: string) => {
    set("formats", form.formats.includes(fmt)
      ? form.formats.filter((f) => f !== fmt)
      : [...form.formats, fmt]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) return setError("Book title is required");
    if (!form.author.trim()) return setError("Author name is required");
    if (!form.category) return setError("Category is required");
    if (form.formats.length === 0) return setError("At least one format is required");

    const year = parseInt(form.year);
    if (isNaN(year) || year < 1000 || year > new Date().getFullYear() + 1) {
      return setError("Please enter a valid publication year");
    }

    setLoading(true);
    try {
      await onSubmit(form);
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <button
          onClick={() => navigate("/books")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-50 border border-red-200 mb-5">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Core Info */}
        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 pb-2 border-b border-slate-100">Book Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Title" required>
              <input type="text" value={form.title} onChange={(e) => set("title", e.target.value)} className={inputCls} placeholder="e.g. Introduction to Algorithms" />
            </Field>
            <Field label="Author" required>
              <input type="text" value={form.author} onChange={(e) => set("author", e.target.value)} className={inputCls} placeholder="e.g. Thomas H. Cormen" />
            </Field>
            <Field label="Publisher">
              <input type="text" value={form.publisher} onChange={(e) => set("publisher", e.target.value)} className={inputCls} placeholder="e.g. MIT Press" />
            </Field>
            <Field label="ISBN">
              <input type="text" value={form.isbn} onChange={(e) => set("isbn", e.target.value)} className={inputCls} placeholder="e.g. 978-0262033848" />
            </Field>
          </div>
          <Field label="Description">
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className={`${inputCls} resize-none`}
              rows={4}
              placeholder="Write a brief description of the book..."
            />
          </Field>
        </div>

        {/* Classification */}
        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 pb-2 border-b border-slate-100">Classification & Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Category" required>
              <select value={form.category} onChange={(e) => set("category", e.target.value)} className={inputCls}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Publication Year">
              <input type="number" value={form.year} onChange={(e) => set("year", e.target.value)} className={inputCls} min={1000} max={new Date().getFullYear() + 1} placeholder="2024" />
            </Field>
            <Field label="Number of Pages">
              <input type="number" value={form.pages} onChange={(e) => set("pages", e.target.value)} className={inputCls} min={1} placeholder="e.g. 500" />
            </Field>
            <Field label="Language">
              <select value={form.language} onChange={(e) => set("language", e.target.value)} className={inputCls}>
                {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </Field>
            <Field label="File Size">
              <input type="text" value={form.size} onChange={(e) => set("size", e.target.value)} className={inputCls} placeholder="e.g. 5.2 MB" />
            </Field>
          </div>
        </div>

        {/* Formats */}
        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900 pb-2 border-b border-slate-100 mb-4">Available Formats</h3>
          <div className="flex gap-3 flex-wrap">
            {FORMAT_OPTIONS.map((fmt) => {
              const selected = form.formats.includes(fmt);
              return (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => toggleFormat(fmt)}
                  className="px-4 py-2 rounded-lg text-sm font-medium border transition-all"
                  style={{
                    backgroundColor: selected ? "#1B3A8C" : "transparent",
                    color: selected ? "#fff" : "#475569",
                    borderColor: selected ? "#1B3A8C" : "#E2E8F0",
                  }}
                >
                  {fmt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: "#1B3A8C" }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {loading ? "Saving..." : submitLabel}
          </button>
          <button
            type="button"
            onClick={() => navigate("/books")}
            className="px-6 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
