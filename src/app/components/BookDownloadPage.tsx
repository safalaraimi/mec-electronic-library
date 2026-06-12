import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ChevronLeft, Bookmark, Download, BookOpen, Star, Heart } from 'lucide-react';
import { mockBooksRecord } from '../data/books';

const NAVY = '#1B3A8C';

export default function BookDownloadPage() {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const [selectedFormat, setSelectedFormat] = useState<string>('PDF');
  const [downloading, setDownloading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const book = bookId ? mockBooksRecord[parseInt(bookId)] : null;

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Book not found</p>
          <button onClick={() => navigate('/')} style={{ color: NAVY }} className="hover:underline text-sm">
            Return to Search
          </button>
        </div>
      </div>
    );
  }

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert(`Downloading "${book.title}" in ${selectedFormat} format...`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <div className="w-full max-w-lg bg-white min-h-screen flex flex-col shadow-xl">

        {/* Header */}
        <header className="text-white px-4 py-3 flex items-center justify-between" style={{ backgroundColor: NAVY }}>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 hover:opacity-80 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </button>
          <h1 className="text-base" style={{ fontWeight: 600 }}>Book Details</h1>
          <button
            onClick={() => setBookmarked(v => !v)}
            className="p-1 rounded hover:bg-white/10 transition-colors"
            aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark'}
          >
            <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-white' : ''}`} />
          </button>
        </header>

        {/* Book Card */}
        <div className="px-4 pt-5 pb-4">
          <div className="flex gap-4">
            {/* Cover */}
            <div
              className="w-24 h-32 rounded-xl flex-shrink-0 flex flex-col items-center justify-center text-white shadow-md"
              style={{ backgroundColor: book.coverColor }}
            >
              <span
                className="text-center leading-tight px-1"
                style={{ fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.04em', whiteSpace: 'pre-line', textAlign: 'center' }}
              >
                {book.coverLabel}
              </span>
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-gray-900 text-base leading-tight" style={{ fontWeight: 700 }}>{book.title}</h2>
                <button
                  onClick={() => setLiked(v => !v)}
                  className={`flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-full border text-xs transition-colors ${
                    liked
                      ? 'border-pink-300 bg-pink-50 text-pink-600'
                      : 'border-gray-200 bg-white text-gray-400 hover:border-pink-300 hover:text-pink-500'
                  }`}
                  aria-label={liked ? 'Unlike' : 'Like'}
                >
                  <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
                  <span>{liked ? 'Liked' : 'Like'}</span>
                </button>
              </div>
              <p className="text-gray-500 text-sm mt-0.5">{book.author}</p>

              <div className="mt-2 space-y-0.5">
                <p className="text-xs text-gray-500"><span style={{ color: '#374151', fontWeight: 500 }}>Publisher:</span> {book.publisher}</p>
                <p className="text-xs text-gray-500"><span style={{ color: '#374151', fontWeight: 500 }}>Year:</span> {book.year}</p>
                <p className="text-xs text-gray-500"><span style={{ color: '#374151', fontWeight: 500 }}>Pages:</span> {book.pages}</p>
                <p className="text-xs text-gray-500"><span style={{ color: '#374151', fontWeight: 500 }}>Category:</span> {book.category}</p>
              </div>

              <div className="flex items-center gap-1 mt-2">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                <span className="text-xs text-gray-600" style={{ fontWeight: 500 }}>{book.rating}</span>
                <span className="text-xs text-gray-400">({book.downloads.toLocaleString()} downloads)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100 mx-4" />

        {/* About */}
        <div className="px-4 py-4">
          <h3 className="text-gray-900 text-sm mb-2" style={{ fontWeight: 600 }}>About the book</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{book.description}</p>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100 mx-4" />

        {/* Format Selection */}
        <div className="px-4 py-4">
          <p className="text-xs text-gray-500 mb-2" style={{ fontWeight: 500 }}>Select Format</p>
          <div className="flex gap-2 flex-wrap">
            {book.formats.map(fmt => (
              <button
                key={fmt}
                onClick={() => setSelectedFormat(fmt)}
                className="px-3 py-1.5 rounded-lg text-xs transition-colors"
                style={{
                  backgroundColor: selectedFormat === fmt ? NAVY : '#f3f4f6',
                  color: selectedFormat === fmt ? '#fff' : '#374151',
                  fontWeight: selectedFormat === fmt ? 600 : 400,
                  border: `1px solid ${selectedFormat === fmt ? NAVY : '#e5e7eb'}`,
                }}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 pb-4 space-y-3">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: NAVY, fontWeight: 600 }}
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'Preparing Download...' : `Download ${selectedFormat}`}</span>
          </button>

          <button
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm transition-colors hover:bg-blue-50"
            style={{ border: `1.5px solid ${NAVY}`, color: NAVY, fontWeight: 600, backgroundColor: 'white' }}
          >
            <BookOpen className="w-4 h-4" />
            <span>Read Online</span>
          </button>
        </div>

        {/* Footer Info Bar */}
        <div className="mt-auto border-t border-gray-100">
          <div className="flex items-center divide-x divide-gray-100">
            <div className="flex-1 py-3 text-center">
              <p className="text-xs text-gray-400">Language</p>
              <p className="text-xs text-gray-700 mt-0.5" style={{ fontWeight: 500 }}>{book.language}</p>
            </div>
            <div className="flex-1 py-3 text-center">
              <p className="text-xs text-gray-400">Format</p>
              <p className="text-xs text-gray-700 mt-0.5" style={{ fontWeight: 500 }}>{selectedFormat}</p>
            </div>
            <div className="flex-1 py-3 text-center">
              <p className="text-xs text-gray-400">Size</p>
              <p className="text-xs text-gray-700 mt-0.5" style={{ fontWeight: 500 }}>{book.size}</p>
            </div>
          </div>
          <p className="text-center text-xs text-gray-400 pb-3">By downloading, you agree to the terms of service</p>
        </div>

      </div>
    </div>
  );
}
