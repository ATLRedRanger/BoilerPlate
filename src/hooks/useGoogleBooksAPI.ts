// src/hooks/useGoogleBooksAPI.ts
import { useState, useCallback } from 'react'

// Import the raw Google API response types for internal mapping
// (These could be in a separate file, e.g., 'src/types/googleApiRawTypes.ts',
// but for this example, we assume they are accessible or defined here if preferred)
// Import your NEW, flattened BookItem and BooksApiResponse
import { BookItem, RawGoogleBookItem, RawGoogleBooksApiResponse } from '@/app/api/googlebooksapi/route'

/**
 * Custom hook to search for books using the Google Books API via a Next.js API route.
 */
const useGoogleBooksAPI = () => {
  // `books` state now holds your flattened `BookItem` objects
  const [books, setBooks] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Fetches books from the Google Books API via the /api/googlebooksapi route.
   * @param query The search term for books.
   * @param maxResults The maximum number of results to return (default 10).
   */
  const searchBooks = useCallback(async (query: string, maxResults: number = 10) => {
    setError(null)
    setLoading(true)
    setBooks([]) // Clear previous results immediately

    if (!query.trim()) {
      setError('Please enter a book title to search.')
      setLoading(false)
      return
    }

    try {
      // Call your Next.js API route
      const response = await fetch(
        `/api/googlebooksapi?query=${encodeURIComponent(query.trim())}&maxResults=${maxResults}`,
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error: ${response.status} ${response.statusText}`)
      }

      // Parse the raw Google API response
      const rawData: RawGoogleBooksApiResponse = await response.json()

      if (rawData.items) {
        // --- CRUCIAL DATA TRANSFORMATION STEP ---
        // Map the raw Google API items to your desired flattened BookItem structure
        const transformedBooks: BookItem[] = rawData.items.map(
          (rawGoogleBook: RawGoogleBookItem) => {
            const { volumeInfo } = rawGoogleBook // Access the nested volumeInfo

            return {
              id: rawGoogleBook.id, // Take the ID directly
              title: volumeInfo.title || 'No Title Available',
              author: volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown Author',
              genre:
                volumeInfo.categories && volumeInfo.categories.length > 0
                  ? volumeInfo.categories[0]
                  : 'Uncategorized',
              pageCount: volumeInfo.pageCount || 0,
              thumbnail: volumeInfo.imageLinks?.thumbnail,
              previewLink: volumeInfo.previewLink,
              description: volumeInfo.description || '',
            }
          },
        )
        setBooks(transformedBooks)
      } else {
        setBooks([]) // No items found
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during search.')
      console.error('Error in useGoogleBooksAPI:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  return { books, loading, error, searchBooks }
}

export default useGoogleBooksAPI
