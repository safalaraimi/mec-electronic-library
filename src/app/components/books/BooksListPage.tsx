import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router";
import { Search, PlusCircle, Edit2, Trash2, Eye, Loader2, AlertCircle, BookOpen, X, ChevronLeft, ChevronRight, Star, Download, ExternalLink } from "lucide-react";
import { api } from "../../lib/api";

interface DigitalBook {
  id: string;
  title: string;
  authorShort: string;
  edition: string;
  year: number;
  category: string;
  description: string;
  coverImage: string;
  coverColor: string;
  rating: number;
  formats: string[];
}

interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  year: number;
  pages: number;
  category: string;
  description: string;
  formats: string[];
  language: string;
  isbn: string;
  coverColor: string;
  rating: number;
  downloads: number;
  createdAt: string;
}

const CATEGORIES = ["All", "Technology", "Computer Science", "Database", "AI", "Networking", "Security", "Mathematics", "Science", "Literature", "History", "Other"];
const PAGE_SIZE = 10;

function BookCover({ book }: { book: Book }) {
  const initials = book.title.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return (
    <div
      className="w-9 h-12 rounded flex items-center justify-center text-white flex-shrink-0"
      style={{ backgroundColor: book.coverColor || "#1B3A8C", fontSize: "0.6rem", fontWeight: 700 }}
    >
      {initials}
    </div>
  );
}

function DeleteModal({ book, onConfirm, onCancel, loading }: { book: Book; onConfirm: () => void; onCancel: () => void; loading: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.4)" }}>
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 text-center mb-2">Delete Book</h3>
        <p className="text-sm text-slate-500 text-center mb-6">
          Are you sure you want to delete <strong>"{book.title}"</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-60"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DigitalBookCard({ book, onView }: { book: DigitalBook; onView: () => void }) {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all group flex flex-col">
      <div className="relative overflow-hidden" style={{ height: "160px", backgroundColor: book.coverColor }}>
        {!imgError && (
          <img
            src={`${book.coverImage}&w=400&h=240&fit=crop`}
            alt={book.title}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity"
            onError={() => setImgError(true)}
          />
        )}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ background: imgError ? book.coverColor : "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.05) 60%)" }}
        >
          {imgError && (
            <span className="text-white font-bold text-4xl opacity-30">{book.title.charAt(0)}</span>
          )}
          <div className="absolute bottom-2 left-3 right-3">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm">
              {book.category}
            </span>
          </div>
        </div>
        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-sm">
          <Star className="w-3 h-3 text-yellow-400 fill-current" />
          <span className="text-white text-xs font-semibold">{book.rating}</span>
        </div>
      </div>
      <div className="p-3 flex flex-col flex-1">
        <h4 className="text-xs font-bold text-slate-900 leading-tight mb-0.5 line-clamp-2">{book.title}</h4>
        <p className="text-xs text-slate-500 mb-1">{book.authorShort}</p>
        <p className="text-xs text-slate-400 mb-3">{book.edition} · {book.year}</p>
        <div className="flex gap-1 flex-wrap mb-3">
          {book.formats.map((fmt) => (
            <span key={fmt} className="px-1.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">{fmt}</span>
          ))}
        </div>
        <div className="flex gap-2 mt-auto">
          <button
            onClick={onView}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-white text-xs font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#1B3A8C" }}
          >
            <Eye className="w-3 h-3" />
            View
          </button>
          <button
            onClick={onView}
            className="flex items-center justify-center px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Download"
          >
            <Download className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BooksListPage() {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Book | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [digitalBooks, setDigitalBooks] = useState<DigitalBook[]>([]);
  const [digitalLoading, setDigitalLoading] = useState(true);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.books.list({ search: search || undefined, category: category !== "All" ? category : undefined });
      setBooks(res.books || []);
      setPage(1);
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

  useEffect(() => {
    api.digitalLibrary.list().then((res) => {
      setDigitalBooks((res.books || []).slice(0, 6));
    }).catch(() => {}).finally(() => setDigitalLoading(false));
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await api.books.delete(deleteTarget.id);
      setBooks((prev) => prev.filter((b) => b.id !== deleteTarget.id));
      setDeleteTarget(null);
      setSuccessMsg(`"${deleteTarget.title}" was deleted successfully.`);
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      setError(err.message || "Failed to delete book");
      setDeleteTarget(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(books.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedBooks = books.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="space-y-6">
      {deleteTarget && (
        <DeleteModal
          book={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Books</h1>
          <p className="text-slate-500 text-sm mt-0.5">{books.length} book{books.length !== 1 ? "s" : ""} in the library</p>
        </div>
        <button
          onClick={() => navigate("/books/add")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#1B3A8C" }}
        >
          <PlusCircle className="w-4 h-4" />
          Add New Books
        </button>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2.5 p-3 rounded-lg bg-green-50 border border-green-200">
          <div className="w-4 h-4 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
            <X className="w-2.5 h-2.5 text-white" onClick={() => setSuccessMsg("")} style={{ cursor: "pointer" }} />
          </div>
          <p className="text-sm text-green-700 flex-1">{successMsg}</p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2.5 p-3 rounded-lg bg-red-50 border border-red-200">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700 flex-1">{error}</p>
          <button onClick={() => setError("")} className="text-red-400 hover:text-red-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Digital Library Section */}
      <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Digital Library</h3>
            <p className="text-slate-500 text-xs mt-0.5">Browse our collection of academic e-books</p>
          </div>
          <Link
            to="/digital-library"
            className="flex items-center gap-1.5 text-sm font-medium hover:underline"
            style={{ color: "#1B3A8C" }}
          >
            View all
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
        {digitalLoading ? (
          <div className="flex items-center justify-center h-36">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#1B3A8C" }} />
          </div>
        ) : digitalBooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-36 text-slate-400">
            <BookOpen className="w-8 h-8 mb-2 opacity-30" />
            <p className="text-sm">No digital books available</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
            {digitalBooks.map((book) => (
              <DigitalBookCard
                key={book.id}
                book={book}
                onView={() => navigate(`/digital-library/${book.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900 mb-4">All Books</h3>
        <div className="flex gap-3 items-center flex-wrap">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, author, category, ISBN..."
              className="w-full pl-9 pr-3.5 py-2 border border-slate-200 rounded-lg text-sm outline-none transition-all bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none transition-all bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-700"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat === "All" ? "All Categories" : cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#1B3A8C" }} />
          </div>
        ) : pagedBooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400">
            <BookOpen className="w-10 h-10 mb-2 opacity-30" />
            <p className="text-sm font-medium">No books found</p>
            <p className="text-xs mt-1">
              {search || category !== "All" ? "Try adjusting your search or filter" : "Start by adding your first book"}
            </p>
            {!search && category === "All" && (
              <button
                onClick={() => navigate("/books/add")}
                className="mt-3 text-xs font-semibold hover:underline"
                style={{ color: "#1B3A8C" }}
              >
                Add a book
              </button>
            )}
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Book</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Author</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden xl:table-cell">Year</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden xl:table-cell">Formats</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedBooks.map((book, i) => (
                  <tr
                    key={book.id}
                    className="group hover:bg-slate-50 transition-colors"
                    style={{ borderBottom: i < pagedBooks.length - 1 ? "1px solid #F1F5F9" : "none" }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <BookCover book={book} />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate max-w-xs">{book.title}</p>
                          <p className="text-xs text-slate-400 md:hidden">{book.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-sm text-slate-700">{book.author}</p>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {book.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden xl:table-cell">
                      <p className="text-sm text-slate-600">{book.year}</p>
                    </td>
                    <td className="px-4 py-3 hidden xl:table-cell">
                      <div className="flex gap-1 flex-wrap">
                        {(book.formats || []).map((fmt) => (
                          <span key={fmt} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">{fmt}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => navigate(`/books/${book.id}`)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/books/${book.id}/edit`)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                          title="Edit book"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(book)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete book"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, books.length)} of {books.length}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={safePage === 1}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className="w-7 h-7 rounded-lg text-xs font-medium transition-colors"
                      style={{
                        backgroundColor: safePage === n ? "#1B3A8C" : "transparent",
                        color: safePage === n ? "#fff" : "#475569",
                      }}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safePage === totalPages}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
