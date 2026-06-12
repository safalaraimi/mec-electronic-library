import { useNavigate } from "react-router";
import { BookForm, BookFormData } from "./BookForm";
import { api } from "../../lib/api";

export default function AddBookPage() {
  const navigate = useNavigate();

  const handleSubmit = async (data: BookFormData) => {
    await api.books.create({
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

  return <BookForm title="Add New Book" submitLabel="Add Book" onSubmit={handleSubmit} />;
}
