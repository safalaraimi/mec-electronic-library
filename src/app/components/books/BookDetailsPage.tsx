import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ChevronLeft, Edit2, Trash2, Star, BookOpen, Download, Globe, Hash, Calendar, FileText, Loader2, AlertCircle
} from "lucide-react";
import { api } from "../../lib/api";

function InfoRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-500 w-32 flex-shrink-0">{label}</span>
      <span className="text-sm font-medium text-slate-900">{value || "—"}</span>
    </div>
  );
}

function DeleteModal({ title, onConfirm, onCancel, loading }: { title: string; onConfirm: () => void; onCancel: () => void; loading: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.4)" }}>
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 text-center mb-2">Delete Book</h3>
        <p className="text-sm text-slate-500 text-center mb-6">
          Are you sure you want to delete <strong>"{title}"</strong>?
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} disabled={loading} className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-60"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BookDetailsPage() {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!bookId) return;
    api.books.get(bookId)
      .then((res) => setBook(res.book))
      .catch((err) => setError(err.message || "Book not found"))
      .finally(() => setLoading(false));
  }, [bookId]);

  const handleDelete = async () => {
    if (!bookId) return;
    setDeleteLoading(true);
    try {
      await api.books.delete(bookId);
      navigate("/books");
    } catch (err: any) {
      setError(err.message || "Failed to delete");
      setShowDelete(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-7 h-7 animate-spin" style={{ color: "#1B3A8C" }} />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="flex items-center gap-2.5 p-4 rounded-lg bg-red-50 border border-red-200">
        <AlertCircle className="w-5 h-5 text-red-500" />
        <p className="text-sm text-red-700">{error || "Book not found"}</p>
        <button onClick={() => navigate("/books")} className="ml-auto text-sm font-medium hover:underline" style={{ color: "#1B3A8C" }}>
          Back to Books
        </button>
      </div>
    );
  }

  const initials = book.title.split(" ").slice(0, 2).map((w: string) => w[0]).join("").toUpperCase();

  return (
    <>
      {showDelete && (
        <DeleteModal
          title={book.title}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
          loading={deleteLoading}
        />
      )}

      <div className="max-w-4xl space-y-5">
        {/* Back + Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/books")}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Books
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/books/${bookId}/edit`)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => setShowDelete(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        {/* Book Header Card */}
        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
          <div className="flex gap-6 items-start">
            <div
              className="w-24 h-32 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-bold text-lg shadow-md"
              style={{ backgroundColor: book.coverColor || "#1B3A8C" }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 leading-tight">{book.title}</h1>
                  <p className="text-slate-600 text-base mt-1">{book.author}</p>
                  {book.publisher && <p className="text-slate-400 text-sm mt-0.5">{book.publisher}</p>}
                </div>
                <span className="flex-shrink-0 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                  {book.category}
                </span>
              </div>

              <div className="flex items-center gap-4 mt-4">
                {book.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-semibold text-slate-700">{book.rating}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-slate-500 text-sm">
                  <Download className="w-3.5 h-3.5" />
                  <span>{(book.downloads || 0).toLocaleString()} downloads</span>
                </div>
                {book.year && (
                  <div className="flex items-center gap-1 text-slate-500 text-sm">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{book.year}</span>
                  </div>
                )}
              </div>

              {book.formats && book.formats.length > 0 && (
                <div className="flex gap-2 mt-4">
                  {book.formats.map((fmt: string) => (
                    <span key={fmt} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ backgroundColor: "#1B3A8C" }}>
                      <FileText className="w-3 h-3" />
                      {fmt}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Description */}
          <div className="xl:col-span-2 bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900 mb-3">About this Book</h3>
            {book.description ? (
              <p className="text-sm text-slate-600 leading-relaxed">{book.description}</p>
            ) : (
              <p className="text-sm text-slate-400 italic">No description available.</p>
            )}
          </div>

          {/* Details */}
          <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900 mb-3">Book Details</h3>
            <div>
              <InfoRow label="Category" value={book.category} />
              <InfoRow label="Language" value={book.language} />
              {book.pages > 0 && <InfoRow label="Pages" value={`${book.pages} pages`} />}
              {book.isbn && <InfoRow label="ISBN" value={book.isbn} />}
              {book.size && <InfoRow label="File Size" value={book.size} />}
              {book.addedBy && <InfoRow label="Added By" value={book.addedBy} />}
              {book.createdAt && (
                <InfoRow
                  label="Date Added"
                  value={new Date(book.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
