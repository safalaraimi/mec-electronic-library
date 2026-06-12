import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { Search, BookOpen, Eye, Download, Loader2, AlertCircle, Star, X } from "lucide-react";
import { api } from "../../lib/api";

interface DigitalBook {
  id: string;
  title: string;
  authorShort: string;
  author: string;
  publisher: string;
  year: number;
  edition: string;
  pages: number;
  category: string;
  language: string;
  isbn: string;
  description: string;
  coverImage: string;
  coverColor: string;
  rating: number;
  downloads: number;
  formats: string[];
  tags: string[];
}

const CATEGORIES = [
  "All",
  "Computer Science",
  "Software Engineering",
  "Artificial Intelligence",
  "Database Systems",
  "Networking",
  "Cybersecurity",
  "Data Analytics",
];

function BookCard({ book, onView }: { book: DigitalBook; onView: () => void }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all group flex flex-col">
      {/* Cover */}
      <div className="relative overflow-hidden" style={{ height: "200px", backgroundColor: book.coverColor }}>
        {!imgError ? (
          <img
            src={`${book.coverImage}&w=400&h=280&fit=crop`}
            alt={`${book.title} cover`}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity"
            onError={() => setImgError(true)}
          />
        ) : null}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center p-4"
          style={{ background: imgError ? book.coverColor : "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%)" }}
        >
          {imgError && (
            <div className="text-white font-bold text-4xl opacity-30 mb-2">
              {book.title.charAt(0)}
            </div>
          )}
          <div className="absolute bottom-3 left-3 right-3">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm">
              {book.category}
            </span>
          </div>
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/30 backdrop-blur-sm">
          <Star className="w-3 h-3 text-yellow-400 fill-current" />
          <span className="text-white text-xs font-semibold">{book.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-bold text-slate-900 leading-tight mb-1 line-clamp-2">{book.title}</h3>
        <p className="text-xs text-slate-500 mb-1">{book.authorShort}</p>
        <p className="text-xs text-slate-400 mb-3">{book.edition} · {book.year}</p>

        <p className="text-xs text-slate-500 line-clamp-2 mb-3 flex-1">{book.description}</p>

        <div className="flex gap-1 flex-wrap mb-4">
          {book.formats.map((fmt) => (
            <span key={fmt} className="px-1.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">{fmt}</span>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onView}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-white text-xs font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#1B3A8C" }}
          >
            <Eye className="w-3.5 h-3.5" />
            View Details
          </button>
          <button
            onClick={onView}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 transition-colors"
            title="Download"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DigitalLibraryPage() {
  const navigate = useNavigate();
  const [books, setBooks] = useState<DigitalBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.digitalLibrary.list({
        search: search || undefined,
        category: category !== "All" ? category : undefined,
      });
      setBooks(res.books || []);
    } catch (err: any) {
      setError(err.message || "Failed to load books");
    } finally {
      setLoading(false);
    }
  }, [search, category]);

  useEffect(() => {
    const timer = setTimeout(fetchBooks, 300);
    return () => clearTimeout(timer);
  }, [fetchBooks]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Digital Library</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Browse our collection of {books.length} academic books
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 p-3 rounded-lg bg-red-50 border border-red-200">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700 flex-1">{error}</p>
          <button onClick={() => setError("")}><X className="w-4 h-4 text-red-400" /></button>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
        <div className="flex gap-3 flex-wrap items-center">
          <div className="relative flex-1 min-w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, author, or topic..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none transition-all bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-sm text-slate-500 border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all border"
            style={{
              backgroundColor: category === cat ? "#1B3A8C" : "white",
              color: category === cat ? "#fff" : "#475569",
              borderColor: category === cat ? "#1B3A8C" : "#E2E8F0",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-7 h-7 animate-spin" style={{ color: "#1B3A8C" }} />
        </div>
      ) : books.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-slate-400 bg-white rounded-xl border border-slate-100">
          <BookOpen className="w-12 h-12 mb-3 opacity-25" />
          <p className="font-medium">No books found</p>
          <p className="text-sm mt-1">
            {search || category !== "All" ? "Try a different search or category" : "The library is loading..."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onView={() => navigate(`/digital-library/${book.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
