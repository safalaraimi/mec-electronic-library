import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, User, Menu, SlidersHorizontal, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { mockBooks } from '../data/books';

const ITEMS_PER_PAGE = 5;

const NAVY = '#1B3A8C';

export default function BookSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const categories = ['All', 'Technology', 'Computer Science', 'Database', 'AI', 'Networking', 'Security'];

  const filteredBooks = mockBooks.filter(book => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      book.title.toLowerCase().includes(q) ||
      book.author.toLowerCase().includes(q) ||
      book.category.toLowerCase().includes(q);
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const pagedBooks = filteredBooks.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const handleBookClick = (id: number) => navigate(`/download/${id}`);
  const handleSearch = (q: string) => { setSearchQuery(q); setCurrentPage(1); };
  const handleCategory = (cat: string) => { setSelectedCategory(cat); setCurrentPage(1); };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <div className="w-full max-w-lg bg-white min-h-screen flex flex-col shadow-xl">

        {/* Header */}
        <header className="text-white px-4 py-3 flex items-center justify-between" style={{ backgroundColor: NAVY }}>
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="p-1 rounded hover:bg-white/10 transition-colors"
            aria-label="Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-base" style={{ fontWeight: 600 }}>MEC Electronic Library</h1>
          <button
            onClick={() => navigate('/login')}
            className="p-1 rounded hover:bg-white/10 transition-colors"
            aria-label="Profile"
          >
            <User className="w-6 h-6" />
          </button>
        </header>

        {/* Slide-out menu */}
        {menuOpen && (
          <div className="fixed inset-0 z-40 flex">
            <div className="w-64 bg-white shadow-2xl flex flex-col" style={{ borderRight: `4px solid ${NAVY}` }}>
              <div className="flex items-center justify-between px-5 py-4" style={{ backgroundColor: NAVY }}>
                <span className="text-white" style={{ fontWeight: 700 }}>Menu</span>
                <button onClick={() => setMenuOpen(false)} className="text-white hover:opacity-80">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 py-4">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => { handleCategory(cat); setMenuOpen(false); }}
                    className="w-full text-left px-6 py-3 text-sm transition-colors hover:bg-blue-50"
                    style={{ color: selectedCategory === cat ? NAVY : '#374151', fontWeight: selectedCategory === cat ? 600 : 400 }}
                  >
                    {cat === 'All' ? 'All Categories' : cat}
                  </button>
                ))}
              </nav>
            </div>
            <div className="flex-1 bg-black/30" onClick={() => setMenuOpen(false)} />
          </div>
        )}

        {/* Search Bar */}
        <div className="px-4 py-3 bg-white border-b border-gray-100">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search for books, authors, topics..."
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
            />
            <button
              className="flex-shrink-0 p-1 rounded hover:bg-gray-200 transition-colors"
              onClick={() => handleSearch('')}
              aria-label="Filter"
            >
              <SlidersHorizontal className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide bg-white border-b border-gray-100">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              className="flex-shrink-0 px-3 py-1 rounded-full text-xs transition-colors"
              style={{
                backgroundColor: selectedCategory === cat ? NAVY : '#f3f4f6',
                color: selectedCategory === cat ? '#fff' : '#374151',
                fontWeight: selectedCategory === cat ? 600 : 400,
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Book List */}
        <main className="flex-1 px-4 py-4">
          <p className="text-sm text-gray-500 mb-3" style={{ fontWeight: 500 }}>
            {searchQuery || selectedCategory !== 'All' ? `Results (${filteredBooks.length})` : 'Popular Books'}
          </p>

          {pagedBooks.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-sm">No books found matching your search.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pagedBooks.map(book => (
                <div
                  key={book.id}
                  className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleBookClick(book.id)}
                >
                  {/* Cover */}
                  <div
                    className="w-16 h-20 rounded-lg flex-shrink-0 flex flex-col items-center justify-center text-white p-1"
                    style={{ backgroundColor: book.coverColor }}
                  >
                    <span className="text-center leading-tight" style={{ fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.03em', whiteSpace: 'pre-line', textAlign: 'center' }}>
                      {book.coverLabel}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-gray-900 text-sm truncate" style={{ fontWeight: 600 }}>{book.title}</h3>
                    <p className="text-gray-500 text-xs mt-0.5">{book.author}</p>
                    <p className="text-gray-400 text-xs mt-1">{book.year} • {book.category}</p>
                  </div>

                  {/* View Button */}
                  <button
                    onClick={e => { e.stopPropagation(); handleBookClick(book.id); }}
                    className="flex-shrink-0 px-4 py-1.5 rounded-lg text-white text-xs transition-opacity hover:opacity-90"
                    style={{ backgroundColor: NAVY, fontWeight: 600 }}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 py-4 border-t border-gray-100 bg-white">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 disabled:opacity-30 hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {pageNumbers.map(n => (
              <button
                key={n}
                onClick={() => setCurrentPage(n)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors"
                style={{
                  backgroundColor: safePage === n ? NAVY : 'transparent',
                  color: safePage === n ? '#fff' : '#374151',
                  fontWeight: safePage === n ? 700 : 400,
                }}
              >
                {n}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 disabled:opacity-30 hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
