// src/app/page.tsx
'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
// Import your new custom hook and its MyBookItem interface
import { useGoogleBooksAPI } from '@/hooks/useGoogleBooksAPI';

// If you still need your internal book submission, keep these imports:
// import { useGetBookApi, BookDTO } from '@/hooks/useGetBookApi';

const BookSearch: React.FC = () => {
  // --- Use the custom Google Books API hook ---
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { books, loading: searchLoading, error: searchError, searchBooks } = useGoogleBooksAPI();

  // --- Handlers for Google Books API Search ---
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: FormEvent) => {
    event.preventDefault();
    searchBooks(searchTerm); // Call the search function from the hook
  };


  // --- State variables for the "Add New Book" form (unchanged) ---
  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [bookGenre, setBookGenre] = useState("");
  const [bookRating, setBookRating] = useState(0);
  const [formMessage, setFormMessage] = useState<{ text: string; type: string }>({ text: '', type: '' });

  // Placeholder for your internal book saving logic if you removed the hook:
  const handleBookSubmit = async () => {
    const trimmedTitle = bookTitle.trim();
    const trimmedAuthor = bookAuthor.trim();
    const selectedGenre = bookGenre.trim();

    if (!trimmedTitle || !trimmedAuthor || !selectedGenre) {
      setFormMessage({ text: 'Please fill in all book fields.', type: 'error' });
      return;
    }

    if (bookRating === 0) {
      setFormMessage({ text: "Please select a star rating for the book.", type: "error" });
      return;
    }

    console.log('--- New Book Details Captured ---');
    console.log('Book Title:', trimmedTitle);
    console.log('Author:', trimmedAuthor);
    console.log('Genre:', selectedGenre);
    console.log("Star Rating:", bookRating);
    console.log('---------------------------------');

    setFormMessage({ text: `Book "${trimmedTitle}" by ${trimmedAuthor} (${selectedGenre}) has been saved (simulated)!`, type: 'success' });
    setBookTitle('');
    setBookAuthor('');
    setBookGenre('');
    setBookRating(0);
  };

  return (
    <main className="px-6 py-4 w-full max-w-[800px] mx-auto">
      {/* --- Google Books API Search Section --- */}
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-200 mx-auto mb-8">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">Search Google Books</h2>
        <form onSubmit={handleSearchSubmit} className="space-y-6">
          <div>
            <label htmlFor="searchBookTitle" className="block text-sm font-medium text-gray-700 mb-1">Book Title</label>
            <input
              type="text"
              id="searchBookTitle"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-base outline-none transition duration-150 ease-in-out"
              placeholder="e.g., The Hitchhiker's Guide to the Galaxy"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 ease-in-out transform hover:-translate-y-0.5 hover:scale-105"
            disabled={searchLoading}
          >
            {searchLoading ? 'Searching...' : 'Search Books'}
          </button>
        </form>

        {searchError && <p className="text-red-600 text-center mt-4">{searchError}</p>}

        {searchLoading && <p className="text-center mt-4">Loading search results...</p>}

        {!searchLoading && books.length === 0 && searchTerm.trim() && !searchError && (
          <p className="text-center text-gray-600 mt-4">No books found for "{searchTerm}".</p>
        )}

        {/* --- Display REFINED Search Results --- */}
        {!searchLoading && books.length > 0 && (
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Search Results</h3>
            <ul className="space-y-4">
              {books.map((book, index) => (
                <li key={book.title + book.author + index} className="p-4 border border-gray-200 rounded-lg shadow-sm flex items-start space-x-4">
                  {book.thumbnail && ( // Display thumbnail if available
                    <img
                      src={book.thumbnail}
                      alt={`Cover of ${book.title}`}
                      className="w-24 h-auto flex-shrink-0 rounded-md shadow"
                    />
                  )}
                  <div className="flex-grow">
                    <h4 className="text-xl font-semibold text-gray-900">{book.title}</h4>
                    <p className="text-gray-700 text-sm">Author: {book.author}</p>
                    <p className="text-gray-600 text-sm">Genre: {book.genre}</p>
                    <p className="text-gray-600 text-sm">Page Count: {book.pageCount}</p>
                    {book.previewLink && ( // Display preview link if available
                      <a
                        href={book.previewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 text-sm mt-2 inline-block"
                      >
                        Read Preview
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* --- Original "Add New Book" Form Section (Your existing content) --- */}
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-200 mx-auto mb-8">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">Add New Book to Database</h2>
        <div className="space-y-6">
          {/* Book Title Input Field */}
          <div>
            <label htmlFor="bookTitle" className="block text-sm font-medium text-gray-700 mb-1">Book Title</label>
            <input
              type="text"
              id="bookTitle"
              name="bookTitle"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-base outline-none transition duration-150 ease-in-out"
              placeholder="e.g., The Great Gatsby"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
            />
          </div>

          {/* Author Input Field */}
          <div>
            <label htmlFor="bookAuthor" className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
            <input
              type="text"
              id="bookAuthor"
              name="bookAuthor"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-base outline-none transition duration-150 ease-in-out"
              placeholder="e.g., F. Scott Fitzgerald"
              value={bookAuthor}
              onChange={(e) => setBookAuthor(e.target.value)}
            />
          </div>

          {/* Genre Dropdown */}
          <div>
            <label htmlFor="bookGenre" className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
            <select
              id="bookGenre"
              name="bookGenre"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-red-500 sm:text-base outline-none transition duration-150 ease-in-out"
              value={bookGenre}
              onChange={(e) => setBookGenre(e.target.value)}
            >
              <option value="">Select a Genre</option>
              <option value="Fiction">Fiction</option>
              <option value="Science Fiction">Science Fiction</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Mystery">Mystery</option>
              <option value="Thriller">Thriller</option>
              <option value="Horror">Horror</option>
            </select>
          </div>

          {/* Star Rating Icons*/}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Star Rating</label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((starValue) => (
                <svg
                  key={starValue}
                  onClick={() => setBookRating(starValue)}
                  className={`
                    w-8 h-8 cursor-pointer transition-colors duration-150 ease-in-out
                    ${bookRating >= starValue ? 'text-red-400' : 'text-gray-300'}
                    hover:text-red-500
                  `}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="0"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 .587l3.668 7.568 8.332 1.206-6.001 5.856 1.416 8.307L12 18.896l-7.415 3.898 1.416-8.307-6.001-5.856 8.332-1.206z" />
                </svg>
              ))}
            </div>
            {bookRating > 0 && (
              <p className="text-xs text-gray-500 mt-1">Current rating: {bookRating} star(s)</p>
            )}
          </div>

          {/* Submit Button for the Book Form */}
          <button
            id="submitBookButton"
            onClick={handleBookSubmit}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 ease-in-out transform hover:-translate-y-0.5 hover:scale-105"
          >
            Submit Book
          </button>
          {formMessage.text && (
            <div
              id="formMessageArea"
              className={`mt-4 p-3 rounded-lg text-center text-sm ${formMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
              role="alert"
            >
              {formMessage.text}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default BookSearch;