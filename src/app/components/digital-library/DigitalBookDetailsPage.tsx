import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ChevronLeft, Star, Download, BookOpen, Globe, Hash, Calendar, FileText, Loader2, AlertCircle, Eye } from "lucide-react";
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

function RelatedBookCard({ book, onClick }: { book: DigitalBook; onClick: () => void }) {
  const [imgError, setImgError] = useState(false);
  return (
    <button
      onClick={onClick}
      className="flex gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors text-left w-full"
    >
      <div
        className="w-10 h-14 rounded-lg flex-shrink-0 flex items-center justify-center text-white font-bold text-lg overflow-hidden"
        style={{ backgroundColor: book.coverColor }}
      >
        {!imgError ? (
          <img
            src={`${book.coverImage}&w=80&h=110&fit=crop`}
            alt={book.title}
            className="w-full h-full object-cover opacity-80"
            onError={() => setImgError(true)}
          />
        ) : (
          <span style={{ fontSize: "1.2rem" }}>{book.title.charAt(0)}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900 line-clamp-2 leading-tight">{book.title}</p>
        <p className="text-xs text-slate-500 mt-0.5">{book.authorShort}</p>
        <p className="text-xs text-slate-400">{book.year}</p>
      </div>
    </button>
  );
}

export default function DigitalBookDetailsPage() {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<DigitalBook | null>(null);
  const [related, setRelated] = useState<DigitalBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imgError, setImgError] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  useEffect(() => {
    if (!bookId) return;
    setLoading(true);
    api.digitalLibrary.get(bookId)
      .then((res) => {
        setBook(res.book);
        setRelated(res.related || []);
      })
      .catch((err) => setError(err.message || "Book not found"))
      .finally(() => setLoading(false));
  }, [bookId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-7 h-7 animate-spin" style={{ color: "#1B3A8C" }} />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
        <AlertCircle className="w-5 h-5 text-red-500" />
        <p className="text-sm text-red-700">{error || "Book not found"}</p>
        <button onClick={() => navigate("/digital-library")} className="ml-auto text-sm font-medium hover:underline" style={{ color: "#1B3A8C" }}>
          Back to Library
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Download Info Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <Download className="w-6 h-6" style={{ color: "#1B3A8C" }} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center mb-2">Download Information</h3>
            <p className="text-sm text-slate-600 text-center mb-4">
              <strong>{book.title}</strong> is an academic textbook. Please access it through official and authorized channels:
            </p>
            <ul className="text-sm text-slate-600 space-y-2 mb-5 text-left">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                Your institution's library subscription (e.g. IEEE, ACM, SpringerLink)
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                Open Library at <span className="font-medium text-blue-600">archive.org</span> (legal lending)
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                Publisher's website: ISBN {book.isbn}
              </li>
            </ul>
            <button
              onClick={() => setShowDownloadModal(false)}
              className="w-full py-2.5 rounded-lg text-white text-sm font-semibold"
              style={{ backgroundColor: "#1B3A8C" }}
            >
              Got it
            </button>
          </div>
        </div>
      )}

      <div className="max-w-5xl space-y-6">
        {/* Back */}
        <button
          onClick={() => navigate("/digital-library")}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Digital Library
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Hero Banner */}
          <div
            className="relative overflow-hidden"
            style={{ height: "220px", backgroundColor: book.coverColor }}
          >
            {!imgError && (
              <img
                src={`${book.coverImage}&w=1200&h=300&fit=crop`}
                alt={`${book.title} cover`}
                className="w-full h-full object-cover opacity-50"
                onError={() => setImgError(true)}
              />
            )}
            <div className="absolute inset-0 flex items-end p-6" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)" }}>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white backdrop-blur-sm">
                {book.category}
              </span>
            </div>
          </div>

          {/* Book Info */}
          <div className="p-6">
            <div className="flex gap-6 items-start">
              {/* Cover Thumbnail */}
              <div
                className="w-28 h-36 rounded-xl flex-shrink-0 overflow-hidden shadow-lg -mt-16 border-4 border-white"
                style={{ backgroundColor: book.coverColor }}
              >
                {!imgError ? (
                  <img
                    src={`${book.coverImage}&w=200&h=280&fit=crop`}
                    alt={book.title}
                    className="w-full h-full object-cover opacity-90"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white font-bold text-3xl opacity-40">
                    {book.title.charAt(0)}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0 pt-2">
                <h1 className="text-2xl font-bold text-slate-900 leading-tight mb-1">{book.title}</h1>
                <p className="text-slate-600 text-base">{book.author}</p>
                <p className="text-slate-400 text-sm mt-0.5">{book.publisher} · {book.edition}</p>

                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.round(book.rating) ? "text-yellow-400 fill-current" : "text-slate-200"}`}
                      />
                    ))}
                    <span className="text-sm font-semibold text-slate-700 ml-1">{book.rating}</span>
                  </div>
                  <span className="text-slate-400 text-sm">{book.downloads.toLocaleString()} downloads</span>
                </div>

                <div className="flex gap-2 mt-4 flex-wrap">
                  {book.formats.map((fmt) => (
                    <span key={fmt} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ backgroundColor: "#1B3A8C" }}>
                      <FileText className="w-3 h-3" />
                      {fmt}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 flex-shrink-0 pt-2">
                <button
                  onClick={() => setShowDownloadModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#1B3A8C" }}
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={() => setShowDownloadModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  Read Online
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Description */}
          <div className="xl:col-span-2 space-y-5">
            <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900 mb-3">About this Book</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{book.description}</p>
            </div>

            {/* Tags */}
            {book.tags && book.tags.length > 0 && (
              <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Topics</h3>
                <div className="flex gap-2 flex-wrap">
                  {book.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 capitalize">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Details Sidebar */}
          <div className="space-y-5">
            {/* Book Details */}
            <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Book Details</h3>
              <div className="space-y-3">
                {[
                  { icon: <Calendar className="w-4 h-4" />, label: "Published", value: book.year },
                  { icon: <Globe className="w-4 h-4" />, label: "Language", value: book.language },
                  { icon: <BookOpen className="w-4 h-4" />, label: "Pages", value: book.pages > 0 ? `${book.pages} pages` : "—" },
                  { icon: <Hash className="w-4 h-4" />, label: "ISBN", value: book.isbn || "—" },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="text-slate-400">{icon}</div>
                    <div>
                      <p className="text-xs text-slate-400">{label}</p>
                      <p className="text-sm font-medium text-slate-700">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Books */}
            {related.length > 0 && (
              <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Related Books</h3>
                <div className="space-y-2">
                  {related.map((rel) => (
                    <RelatedBookCard
                      key={rel.id}
                      book={rel}
                      onClick={() => navigate(`/digital-library/${rel.id}`)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
