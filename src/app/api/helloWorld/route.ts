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


export async function GET(){
    console.log("helloWorld API");

    const emailResult = await findsFirstEmail();
    console.log("helloWorld API is returning ", emailResult);

    return NextResponse.json(emailResult);
}