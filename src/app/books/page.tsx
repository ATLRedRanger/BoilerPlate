'use client'

import React, { useEffect, useState } from 'react'
import { useGetBookApi } from '@/hooks/useGetBookApi'
import { BookDTO } from '@/hooks/useGetBookApi'
import { BookItem, BooksApiResponse } from '../api/googlebooksapi/route'

const BookSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [books, setBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

// --- Handlers for Google Books API Search ---
const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
  setSearchTerm(event.target.value);
};

const handleSearchSubmit = async (event: FormEvent) => {
  event.preventDefault();
  setSearchError(null); // Clear previous search errors
  setSearchLoading(true); // Set search loading to true
  setBooks([]); // Clear previous search results

  if (!searchTerm.trim()) {
    setSearchError('Please enter a book title to search.');
    setSearchLoading(false);
    return;
  }

  try {
    // Call your Next.js API route for Google Books search
    const response = await fetch(`/api/googlebooksapi?query=${encodeURIComponent(searchTerm.trim())}&maxResults=10`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch books from internal API.');
    }

    const data: BooksApiResponse = await response.json();
    if (data.items) {
      setBooks(data.items);
    } else {
      setBooks([]); // No items found
    }
  } catch (err: any) {
    setSearchError(err.message || 'An unexpected error occurred during search.');
    console.error('Search error:', err);
  } finally {
    setSearchLoading(false); // Set search loading to false
  }
};


// --- State variables for the "Add New Book" form (if you still need this functionality) ---
const [bookTitle, setBookTitle] = useState("");
const [bookAuthor, setBookAuthor] = useState("");
const [bookGenre, setBookGenre] = useState("");
const [bookRating, setBookRating] = useState(0);
const [formMessage, setFormMessage] = useState<{ text: string; type: string }>({ text: '', type: '' });

  const {createBook, isLoading } = useGetBookApi();
  /**
   * Handles the submission of the new book form.
   * Performs basic validation and logs the collected data.
   */
  const handleBookSubmit = async () => {

    // Trim whitespace from input values for validation
    // Trim removes whitespace on the left and right ends of the string
    const trimmedTitle = bookTitle.trim();
    const trimmedAuthor = bookAuthor.trim();
    const selectedGenre = bookGenre.trim();

    // Basic validation: Check if any field is empty
    if (!trimmedTitle || !trimmedAuthor || !selectedGenre) {
      setFormMessage({ text: 'Please fill in all book fields.', type: 'error' });
      return; // Stop function execution if validation fails
    }

    if (bookRating === 0) {
      setFormMessage({text: "Please select a star rating for the book.", type: "error"});
      return;
    }
    // Log the captured book details to the console (simulating database input)
    console.log('--- New Book Details Captured ---');
    console.log('Book Title:', trimmedTitle);
    console.log('Author:', trimmedAuthor);
    console.log('Genre:', selectedGenre);
    console.log("Star Rating:", bookRating);
    console.log('---------------------------------');

    // Display a success message to the user
    //setFormMessage({ text: `Book "${trimmedTitle}" by ${trimmedAuthor} (${selectedGenre}) has been saved!`, type: 'success' });

    const newBookData: BookDTO = {
      title: trimmedTitle,
      author: trimmedAuthor,
      genre: selectedGenre,
      rating: bookRating
    }
    try {
      setFormMessage({text: "", type: ""}); // Clear previous messages
      // Call the createBook function from the hook
      await createBook(newBookData);

      // Display a success message to the user
      setFormMessage({
        text: `Book "${trimmedTitle}" by ${trimmedAuthor} (${selectedGenre}) has been saved!`,
        type: 'success',
      });

      // Clear the book input fields after successful submission
      setBookTitle('');
      setBookAuthor('');
      setBookGenre('');
      setBookRating(0);

    } 
    catch (err) 
    {
      // The useCreateBook hook already sets the error state, but you can display it here too
      setFormMessage({
        text: error || 'Failed to save book. Please try again.',
        type: 'error',
      });
      console.error('Submission error:', err);
    }
  };

  return (
    <main className="px-6 py-4 w-full max-w-[800px]">
      {/* Displaying the information retrieved from the helloAPi */}
      <div>
      {}
    </div>

    {/* --- New Book Input Form Section (Above your existing content) --- */}
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-200 mx-auto mb-8">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">Add New Book</h2>

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
              value={bookTitle} // Controlled component: input value tied to state
              onChange={(e) => setBookTitle(e.target.value)} // Update state on change
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

          {/* Genre Dropdown (Replaced Input Field) */}
          <div>
            <label htmlFor="bookGenre" className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
            <select
              id="bookGenre"
              name="bookGenre"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-red-500 sm:text-base outline-none transition duration-150 ease-in-out"
              value={bookGenre} // Controlled component: selected value tied to state
              onChange={(e) => setBookGenre(e.target.value)} // Update state on change
            >
              <option value="">Select a Genre</option> {/* Default/placeholder option */}
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
                //svg stands for scalable vector graphics
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
                  {/* The path defines the shape of the icons. The current numbers are the star, but these can be changed to get other shapes. */}
                  <path d="M12 .587l3.668 7.568 8.332 1.206-6.001 5.856 1.416 8.307L12 18.896l-7.415 3.898 1.416-8.307-6.001-5.856 8.332-1.206z"/>
                </svg>
              ))}
            </div>
            {bookRating > 0 && (
              <p className="text-xs text-gray-500 mt-1">Current rating: {bookRating} star(s)</p>
            )}
          </div>

          {/* Submit Button for the Book Form */}
          <button
            id="submitBookButton" // Unique ID for this button
            onClick={handleBookSubmit} // Call the new submit handler
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 ease-in-out transform hover:-translate-y-0.5 hover:scale-105"
          >
            Submit Book
          </button>
          {formMessage.text && ( // Only render if formMessage.text is not empty
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
  )
}

export default BookSearch;
