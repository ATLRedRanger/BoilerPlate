import { useState, useEffect, useCallback } from 'react';

export type BookDTO= {

  title: string; 
  author: string;  
  genre: string;     
  rating: number;      

}


// Custom hook for handling book creation API calls
export const useSubmitBook = () => { // <--- REMOVE 'async' HERE
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<BookDTO | null>(null);
  
    // This function *inside* the hook IS async, which is correct
    const createBook = async (book: BookDTO) => {
      setIsLoading(true);
      setError(null);
      setData(null);
  
      try {
        const response = await fetch('/api/book', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(book),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create book.');
        }
  
        const responseData: BookDTO = await response.json();
        setData(responseData);
        return responseData;
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred.');
        throw err;
      } finally {
        setIsLoading(false);
      }
    };
  
    return { createBook, isLoading, error, data };
  };

  export interface UseBooksOptions {
    // Sorting options now only reflect fields available in BookDTO
    sortBy?: 'title' | 'author' | 'genre' | 'rating';
    sortOrder?: 'asc' | 'desc';
  }
  
  interface UseBooksResult {
    books: BookDTO[]; // Directly use BookDTO here
    loading: boolean;
    error: string | null;
    refetch: (options?: UseBooksOptions) => void; // Function to manually refetch data with optional new options
  }
  
  // Directly use BookDTO as the type for fetched books
  export const useGetBooks = (initialOptions?: UseBooksOptions): UseBooksResult => {
    const [books, setBooks] = useState<BookDTO[]>([]); // Initialize with BookDTO array
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [options, setOptions] = useState<UseBooksOptions>(initialOptions || { sortBy: 'title', sortOrder: 'asc' });
  
    const { sortBy = 'title', sortOrder = 'asc' } = options;
  
    // useCallback to memoize the fetch function to prevent unnecessary re-renders
    const fetchBooks = useCallback(async (currentSortBy: UseBooksOptions['sortBy'], currentSortOrder: UseBooksOptions['sortOrder']) => {
      setLoading(true);
      setError(null);
      try {
        // Construct the URL with query parameters for sorting
        const url = `/api/books?sortBy=${currentSortBy}&sortOrder=${currentSortOrder}`;
        const response = await fetch(url);
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch books');
        }
  
        const data = await response.json();
        setBooks(data.books);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
        console.error('Error fetching books:', err);
      } finally {
        setLoading(false);
      }
    }, []); // Dependencies are now passed directly to fetchBooks from the effect/refetch
  
    // Refetch function to allow changing options dynamically
    const refetch = useCallback((newOptions?: UseBooksOptions) => {
      setOptions(prevOptions => ({ ...prevOptions, ...newOptions }));
    }, []);
  
    // useEffect to call fetchBooks when the component mounts or sort options change
    useEffect(() => {
      fetchBooks(sortBy, sortOrder);
    }, [fetchBooks, sortBy, sortOrder]); // Dependency on fetchBooks memoized function and current options
  
    // Return the data, loading state, error, and a refetch function
    return { books, loading, error, refetch };
  };