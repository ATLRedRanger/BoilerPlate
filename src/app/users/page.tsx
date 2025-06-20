'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { User } from '@prisma/client'
import { useGetUsersQuery } from '@/store'
import { formatDate } from '@/lib/date'
import Avatar from '@/components/Avatar'

const LOAD_INCREMENT = 5

const UserCard: React.FC<{ user: Partial<User> }> = ({ user }) => (
  <Link href={`/users/${user.id}`}>
    <div className="flex items-center text-center md:text-left justify-between bg-base-200 rounded-box p-4 mt-4 w-full">
      <div className="flex items-center">
        <div className="hidden md:block mr-4"><Avatar user={user} size={64} /></div>
        <div>
          <div className="flex justify-center mb-4 md:hidden">
            <Avatar user={user} size={64} />
          </div>
          <h3 className="text-2xl font-medium">{user?.name || user?.email}</h3>
          <p className="text-gray-500">{`Joined on ${formatDate(String(user.createdAt))}`}</p>
        </div>
      </div>
    </div>
  </Link>
)

const Users: React.FC = () => {
  const [loadedUserCount, setLoadedUserCount] = useState(2 * LOAD_INCREMENT)
  const [visibleUserCount, setVisibleUserCount] = useState(LOAD_INCREMENT)

  const { data: users } = useGetUsersQuery({ skip: 0, take: loadedUserCount })

  useEffect(() => {
    // cache the next results and scroll to bottom
    setLoadedUserCount(visibleUserCount + LOAD_INCREMENT)
    scrollToBottom()
  }, [visibleUserCount])

  const scrollToBottom = () => window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth',
  })

  

  //State variables for the book inputs
  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [bookGenre, setBookGenre] = useState("");
  const [bookRating, setBookRating] = useState(0);
  //State variable for displaying success/error messages to the user
  const [formMessage, setFormMessage] = useState({ text: "", type: ""});

  /**
   * Handles the submission of the new book form.
   * Performs basic validation and logs the collected data.
   */
  const handleBookSubmit = () => {
    // Trim whitespace from input values for validation
    const trimmedTitle = bookTitle.trim();
    const trimmedAuthor = bookAuthor.trim();
    const trimmedGenre = bookGenre.trim();

    // Basic validation: Check if any field is empty
    if (!trimmedTitle || !trimmedAuthor || !trimmedGenre) {
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
    console.log('Genre:', trimmedGenre);
    console.log("Star Rating:", bookRating);
    console.log('---------------------------------');

    // Display a success message to the user
    setFormMessage({ text: `Book "${trimmedTitle}" by ${trimmedAuthor} (${trimmedGenre}) has been captured! (Check console)`, type: 'success' });

    // Clear the book input fields after successful "submission"
    setBookTitle('');
    setBookAuthor('');
    setBookGenre('');
    setBookRating(0);
  };

  //This needs to be directly on top of the HTML code
  if (!users) return <></>

  return (
    <main className="px-6 py-4 w-full max-w-[800px]">
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

          {/* Genre Input Field */}
          <div>
            <label htmlFor="bookGenre" className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
            <input
              type="text"
              id="bookGenre"
              name="bookGenre"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-base outline-none transition duration-150 ease-in-out"
              placeholder="e.g., Classic Fiction"
              value={bookGenre}
              onChange={(e) => setBookGenre(e.target.value)}
            />
          </div>
          {/* Star Rating Icons (New) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Star Rating</label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((starValue) => (
                <svg
                  key={starValue}
                  onClick={() => setBookRating(starValue)}
                  className={`
                    w-8 h-8 cursor-pointer transition-colors duration-150 ease-in-out
                    ${bookRating >= starValue ? 'text-yellow-400' : 'text-gray-300'}
                    hover:text-yellow-500
                  `}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="0"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
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

          {/* Message Display Area for Book Form (conditionally rendered) */}
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
      {users.slice(0, visibleUserCount).map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
      {visibleUserCount < users.length && (
        <div className="flex justify-center mt-4">
          <button
            className="btn btn-primary btn-wide"
            onClick={() => {
              setVisibleUserCount(visibleUserCount + LOAD_INCREMENT)
            }}
          >
            Load More
          </button>
        </div>
      )}
    </main>
  )
}

export default Users
