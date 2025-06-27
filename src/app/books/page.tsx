// src/app/page.tsx
/*
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
      { --- Google Books API Search Section --- }
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

        {/* --- Display REFINED Search Results --- }
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

export default <BookSearch></BookSearch>*/

"use client"

import {useState} from 'react';
import { useGetBooks, BookDTO, UseBooksOptions } from '@/hooks/useGetBookApi';

// Define a stricter interface for the internal state of sorting options
// This ensures sortBy and sortOrder are always strings within this state.
interface CurrentSortState {
  sortBy: 'title' | 'author' | 'genre' | 'rating';
  sortOrder: 'asc' | 'desc';
}

const BookList: React.FC = () => {
  // Example usage: Fetching books sorted by rating in descending order initially
  const { books, loading, error, refetch } = useGetBooks({
    sortBy: 'rating',
    sortOrder: 'desc',
  });

  // Use the stricter CurrentSortState for the local state
  const [currentSortOptions, setCurrentSortOptions] = useState<CurrentSortState>({
    sortBy: 'rating', // Initial value must be a valid string
    sortOrder: 'desc', // Initial value must be a valid string
  });

  const handleSortChange = (newSortBy: string, newNewSortOrder: string) => {
    // Type assertions are still needed here because 'newSortBy' and 'newNewSortOrder'
    // come from event.target.value which is 'string'.
    const validatedSortBy = newSortBy as CurrentSortState['sortBy'];
    const validatedSortOrder = newNewSortOrder as CurrentSortState['sortOrder'];

    setCurrentSortOptions({ sortBy: validatedSortBy, sortOrder: validatedSortOrder });
    refetch({ sortBy: validatedSortBy, sortOrder: validatedSortOrder });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-700">Loading books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <p className="text-red-600 text-lg mb-4">Error: {error}</p>
        <button
          onClick={() => refetch()} // Refetch with current options
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">My Book Collection</h1>

      <div className="mb-6 flex flex-col sm:flex-row justify-center items-center gap-4">
        <label htmlFor="sortBy" className="font-medium text-gray-700">Sort By:</label>
        <select
          id="sortBy"
          // currentSortOptions.sortBy is now guaranteed to be a string
          value={currentSortOptions.sortBy}
          // No need for '|| 'asc'' as currentSortOptions.sortOrder is always a string
          onChange={(e) => handleSortChange(e.target.value, currentSortOptions.sortOrder)}
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Sort By</option> {/* Added a default empty option */}
          <option value="title">Title</option>
          <option value="author">Author</option>
          <option value="genre">Genre</option>
          <option value="rating">Rating</option>
        </select>

        <label htmlFor="sortOrder" className="font-medium text-gray-700">Order:</label>
        <select
          id="sortOrder"
          // currentSortOptions.sortOrder is now guaranteed to be a string
          value={currentSortOptions.sortOrder}
          // No need for '|| 'title'' as currentSortOptions.sortBy is always a string
          onChange={(e) => handleSortChange(currentSortOptions.sortBy, e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Order</option> {/* Added a default empty option */}
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>

        <button
          onClick={() => refetch(currentSortOptions)} // Refetch with currently selected options
          className="px-4 py-2 bg-purple-500 text-white rounded-lg shadow hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
        >
          Apply Sort
        </button>
      </div>


      {books.length === 0 ? (
        <p className="text-center text-gray-600">No books found. Add some!</p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            // Using a composite key as 'id' is not part of BookDTO.
            // In a real application, ensure each item has a truly unique and stable key.
            <li key={`${book.title}-${book.author}`} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{book.title}</h2>
              <p className="text-gray-700 mb-1"><strong>Author:</strong> {book.author}</p>
              <p className="text-gray-700 mb-1"><strong>Genre:</strong> {book.genre}</p>
              <p className="text-gray-700"><strong>Rating:</strong> {book.rating} / 5 stars</p>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-8 text-center">
        <button
          onClick={() => refetch()}
          className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors"
        >
          Refresh Books
        </button>
      </div>
    </div>
  );
};

export default BookList;
