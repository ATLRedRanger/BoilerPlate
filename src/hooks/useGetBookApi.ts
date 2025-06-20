//POST in the body a .json object
import { useState } from "react";


export type BookDTO= {

  title: string; 
  author: string;  
  genre: string;     
  rating: number;      

}

// Custom hook for handling book creation API calls
export const useGetBookApi = () => { // <--- REMOVE 'async' HERE
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<BookDTO | null>(null);
  
    // This function *inside* the hook IS async, which is correct
    const createBook = async (book: BookDTO) => {
      setIsLoading(true);
      setError(null);
      setData(null);
  
      try {
        const response = await fetch('/api/books', {
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