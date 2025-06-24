// src/app/page.tsx

'use client'

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react'
// Import your new custom hook and its MyBookItem interface
import { useGoogleBooksAPI } from '@/hooks/useGoogleBooksAPI'

const BookSearch: React.FC = () => {
  // --- Use the custom Google Books API hook ---
  const [searchTerm, setSearchTerm] = useState<string>('')
  const { books, loading: searchLoading, error: searchError, searchBooks } = useGoogleBooksAPI()
  useEffect (()=> {
    if(books.length === 0) return
    console.log("TEST", books)
  }, [books])
  // --- Handlers for Google Books API Search ---
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handleSearchSubmit = (event: FormEvent) => {
    event.preventDefault()
    searchBooks(searchTerm) // Call the search function from the hook
  }

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
    </main>
  )
}

export default BookSearch
