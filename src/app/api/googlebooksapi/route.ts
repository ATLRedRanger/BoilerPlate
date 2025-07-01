// src/types/bookTypes.ts

// This is the flattened BookItem interface that you want to use throughout your app.
// It combines relevant data points directly from the Google API's nested structure.
// googlebooksapi/route.ts
import { NextRequest, NextResponse } from 'next/server'

export interface BookItem {
  id: string; // Google's unique ID for the book
  title: string;
  author: string; // Combined from Google's authors array
  genre: string; // Derived from Google's categories
  pageCount: number;
  thumbnail?: string; // Optional: for the book cover image
  previewLink?: string; // Optional: for linking to a preview on Google Books
  description?: string; // Optional: if you want to include a short description
}

// BooksApiResponse now contains an array of YOUR flattened BookItem
export interface BooksApiResponse {
  kind: string;
  totalItems: number;
  items?: BookItem[]; // Array of your flattened BookItem
}

// We'll also need interfaces for the *raw* Google API response to parse it
// These should ideally be in a separate file like 'src/types/googleApiRawTypes.ts'
// but for simplicity, I'll put them here or assume they are managed by the hook
// so they don't clutter your main application types.
// For the purpose of the mapping, we still need to know the *original* structure:
export interface RawGoogleBookVolumeInfo {
  title?: string;
  authors?: string[];
  pageCount?: number;
  categories?: string[];
  imageLinks?: {
    thumbnail?: string;
    smallThumbnail?: string;
  };
  previewLink?: string;
  description?: string;
}

export interface RawGoogleBookItem {
  id: string;
  volumeInfo: RawGoogleBookVolumeInfo;
  // ... other top-level Google API properties you don't care about (kind, etag, saleInfo, etc.)
}

export interface RawGoogleBooksApiResponse {
  kind: string;
  totalItems: number;
  items?: RawGoogleBookItem[];
}

const { GOOGLE_BOOKS_API_KEY, GOOGLE_BOOKS_BASE_URL } = process.env

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query') // e.g., /api/googlebooksapi?query=harry+potter
  const maxResults = searchParams.get('maxResults') || '10' // Optional: default to 10

  if (!query) {
    return NextResponse.json({ error: 'Missing search query parameter.' }, { status: 400 })
  }

  if (!GOOGLE_BOOKS_API_KEY) {
    console.error('GOOGLE_BOOKS_API_KEY is not set in environment variables.')
    return NextResponse.json(
      { error: 'Server configuration error: API Key missing.' },
      { status: 500 },
    )
  }

  try {
    const response = await fetch(
      `${GOOGLE_BOOKS_BASE_URL}?q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${GOOGLE_BOOKS_API_KEY}`,
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Google Books API Error:', errorData)
      return NextResponse.json(
        {
          error: errorData.error?.message || 'Failed to fetch from Google Books API.',
        },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data) // Return the data directly from Google Books API
  } catch (error) {
    console.error('Error in Google Books API route:', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

// You could also add other HTTP methods if your API needs them, e.g., POST, PUT, DELETE
// export async function POST(request: NextRequest) { /* ... */ }
