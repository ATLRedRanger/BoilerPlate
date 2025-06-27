// @ts-nocheck

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { BookDTO } from '@/hooks/useGetBookApi'
import next from 'next'

const prisma = new PrismaClient()

export const findsFirstEmail = async () => {
  try {
    const firstEmail = await prisma.user.findFirst({
      select: {
        email: true,
      }
    })
    console.log(firstEmail)
    return firstEmail
  } catch (error) {
    console.error('Error finding first email:', error)
    throw (error)
  }
}

export async function GET() {
  console.log('helloWorld API')

  const emailResult = await findsFirstEmail()
  console.log('helloWorld API is returning ', emailResult)

  return NextResponse.json(emailResult)
}

// Call prisma function to insert book into database
export const addBookToDB = async (bookData: BookDTO) => {
  try {
    const newBook = await prisma.book.create({
      data: {
        title: bookData.title,
        author: bookData.author,
        genre: bookData.genre,
        rating: bookData.rating,
      },
    })
    console.log('Book added to DB:', newBook)
    return newBook
  } catch (error) {
    console.error('Error adding book to DB:', error)
    throw (error)
  } finally {
    await prisma.$disconnect()
  }
}

// Receives the post and the body
// Expected DTO object is the book
export async function POST(req: NextRequest) {
  try {
    const book: BookDTO = await req.json()

    // Basic server-side validation (should always be done in addition to client-side)
    if (!book.title || !book.author || !book.genre || !book.rating) {
      return NextResponse.json(
        { message: 'Please provide all required book fields.' },
        { status: 400 }
      )
    }

    if (book.rating === 0 || book.rating < 1 || book.rating > 5) { 
      return NextResponse.json(
        { message: 'Please provide a valid star rating (1-5).' },
        { status: 400 }
      )
    }

    const newBook = await addBookToDB(book)

    return NextResponse.json(
      { message: 'Book added successfully!', book: newBook },
      { status: 201 } // 201 Created
    )
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json(
      { message: 'Internal server error.', error: error.message },
      { status: 500 }
    )
  }
}

// Define a type for sorting options
type SortBy = 'title' | 'author' | 'genre' | 'rating' | 'id' | 'createdAt' | 'updatedAt'; // Add other sortable fields as needed
type SortOrder = 'asc' | 'desc';

/**
 * Handles GET requests to retrieve all books with optional sorting.
 * @param req The NextRequest object containing query parameters.
 * @returns A NextResponse object with the list of books or an error message.
 */
export async function GET(req: NextRequest) {
  try {
    console.log('GET /api/book called.'); // Log API call initiation (UPDATED LOGGING)
    const { searchParams } = new URL(req.url);

    // Extract sort parameters from query string
    // Default to 'title' ascending if not provided
    const sortBy = (searchParams.get('sortBy') as SortBy) || 'title';
    const sortOrder = (searchParams.get('sortOrder') as SortOrder) || 'asc';

    console.log(`Sorting by: ${sortBy}, Order: ${sortOrder}`); // Log sort parameters

    // Validate sortBy and sortOrder parameters against allowed values
    const validSortBys: SortBy[] = ['title', 'author', 'genre', 'rating', 'id', 'createdAt', 'updatedAt'];
    const validSortOrders: SortOrder[] = ['asc', 'desc'];

    if (!validSortBys.includes(sortBy)) {
      console.error(`Validation Error: Invalid 'sortBy' parameter received: ${sortBy}`);
      return NextResponse.json(
        { message: `Invalid 'sortBy' parameter. Must be one of: ${validSortBys.join(', ')}` },
        { status: 400 }
      );
    }

    if (!validSortOrders.includes(sortOrder)) {
      console.error(`Validation Error: Invalid 'sortOrder' parameter received: ${sortOrder}`);
      return NextResponse.json(
        { message: `Invalid 'sortOrder' parameter. Must be 'asc' or 'desc'.` },
        { status: 400 }
      );
    }

    // Fetch books from the database using Prisma, applying the sorting
    console.log('Attempting to fetch books from Prisma...');
    const books = await prisma.book.findMany({
      orderBy: {
        [sortBy]: sortOrder, // Dynamically apply the sort field and order
      },
    });
    console.log(`Successfully fetched ${books.length} books.`); // Log success and count

    // Return the fetched books
    return NextResponse.json({ books }, { status: 200 });
  } catch (error: any) {
    console.error('API Error fetching books in GET /api/book:', error); // More specific error log (UPDATED LOGGING)
    // Return a JSON error response even in case of unexpected errors
    return NextResponse.json(
      { message: 'Failed to retrieve books due to an internal server error.', error: error.message },
      { status: 500 }
    );
  } finally {
    // Disconnect Prisma client after the request is finished
    await prisma.$disconnect();
    console.log('Prisma client disconnected.');
  }
}

