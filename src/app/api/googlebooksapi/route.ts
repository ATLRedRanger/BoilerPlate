export interface BookItem{
    title: string;
    author: string;
    genre: string;
    pageCount: number;
}




// googlebooksapi/route.ts
import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
const GOOGLE_BOOKS_BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query'); // e.g., /api/googlebooksapi?query=harry+potter
  const maxResults = searchParams.get('maxResults') || '10'; // Optional: default to 10

  if (!query) {
    return NextResponse.json({ error: 'Missing search query parameter.' }, { status: 400 });
  }

  if (!GOOGLE_BOOKS_API_KEY) {
    console.error('GOOGLE_BOOKS_API_KEY is not set in environment variables.');
    return NextResponse.json({ error: 'Server configuration error: API Key missing.' }, { status: 500 });
  }

  try {
    const response = await fetch(
      `${GOOGLE_BOOKS_BASE_URL}?q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${GOOGLE_BOOKS_API_KEY}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Google Books API Error:', errorData);
      return NextResponse.json(
        { error: errorData.error?.message || 'Failed to fetch from Google Books API.' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data); // Return the data directly from Google Books API
  } catch (error) {
    console.error('Error in Google Books API route:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// You could also add other HTTP methods if your API needs them, e.g., POST, PUT, DELETE
// export async function POST(request: NextRequest) { /* ... */ }