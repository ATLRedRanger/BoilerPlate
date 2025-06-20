import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

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
export const addBookToDB = aysnc () => {
    

    try
    {

    }
    catch(error)
    {
        throw(error);
    }
}

//Receives the post and the body
//Expected DTO object is the book
export async function POST(){

}



export async function GET(){
    console.log("helloWorld API");

    const emailResult = await findsFirstEmail();
    console.log("helloWorld API is returning ", emailResult);

    return NextResponse.json(emailResult);
}