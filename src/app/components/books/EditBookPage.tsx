import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Loader2, AlertCircle } from "lucide-react";
import { BookForm, BookFormData } from "./BookForm";
import { api } from "../../lib/api";

export default function EditBookPage() {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!bookId) return;
    api.books.get(bookId)
      .then((res) => setBook(res.book))
      .catch((err) => setError(err.message || "Book not found"))
      .finally(() => setLoading(false));
  }, [bookId]);

  const handleSubmit = async (data: BookFormData) => {
    if (!bookId) return;
    await api.books.update(bookId, {
      title: data.title,
      author: data.author,
      publisher: data.publisher,
      year: data.year,
      pages: data.pages,
      category: data.category,
      description: data.description,
      language: data.language,
      size: data.size,
      isbn: data.isbn,
      formats: data.formats,
    });
    navigate("/books");
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
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
        <p className="text-sm text-red-700">{error || "Book not found"}</p>
        <button onClick={() => navigate("/books")} className="ml-auto text-sm font-medium hover:underline" style={{ color: "#1B3A8C" }}>
          Back to Books
        </button>
      </div>
    );
  }

  const initial: Partial<BookFormData> = {
    title: book.title || "",
    author: book.author || "",
    publisher: book.publisher || "",
    year: String(book.year || new Date().getFullYear()),
    pages: String(book.pages || ""),
    category: book.category || "Technology",
    description: book.description || "",
    language: book.language || "English",
    size: book.size || "",
    isbn: book.isbn || "",
    formats: book.formats || ["PDF"],
  };

  return <BookForm title="Edit Book" submitLabel="Save Changes" initial={initial} onSubmit={handleSubmit} />;
}
