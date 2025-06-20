import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

type BookDTO= {

    title: string; 
    author: string;  
    genre: string;     
    rating: number;      
  
  }

const prisma = new PrismaClient();

export const findsFirstEmail = async () => {
    try
    {
        const firstEmail = await prisma.user.findFirst({
            select: {
                email: true,
            }
        });
        console.log(firstEmail);
        return firstEmail;
    }
    catch (error){
        console.error("Error finding first email:", error);
        throw(error);
    }
}

//Call prisma function to insert book into database
export const addBookToDB = async (bookData: BookDTO) => {
    

    try
    {
        const newBook = await prisma.book.create({
            data: {
                title: bookData.title,
                author: bookData.author,
                genre: bookData.genre,
                rating: bookData.rating,
            },
        });
        console.log("Book added to DB:", newBook)
        return newBook
    }
    catch(error)
    {
        console.error("Error adding book to DB:", error)
        throw(error);
    }finally{
        await prisma.$disconnect();
    }
}

//Receives the post and the body
//Expected DTO object is the book
export async function POST(req: NextRequest){
    try {
        const book: BookDTO = await req.json();
    
        // Basic server-side validation (should always be done in addition to client-side)
        if (!book.title || !book.author || !book.genre || !book.rating) {
          return NextResponse.json(
            { message: 'Please provide all required book fields.' },
            { status: 400 }
          );
        }
    
        if (book.rating === 0 || book.rating < 1 || book.rating > 5) { // Assuming a 1-5 star rating
            return NextResponse.json(
                { message: 'Please provide a valid star rating (1-5).' },
                { status: 400 }
            );
        }
    
        const newBook = await addBookToDB(book);
    
        return NextResponse.json(
          { message: 'Book added successfully!', book: newBook },
          { status: 201 } // 201 Created
        );
      } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json(
          { message: 'Internal server error.', error: error.message },
          { status: 500 }
        );
      }
}



export async function GET(){
    console.log("helloWorld API");

    const emailResult = await findsFirstEmail();
    console.log("helloWorld API is returning ", emailResult);

    return NextResponse.json(emailResult);
}