
// /api/course/createChapters
import { NextResponse } from "next/server";
import { createChaptersSchema } from "@/validators/course";
import { ZodError } from "zod";
export async function POST(req: Request , res: Response){
    try{
        const body=await req.json()
        const {title , units}=createChaptersSchema.parse(body)

        type outputUnits={
            title:string;
            chapters:{
                youtube_search_query:string;
                chapter_title:string;

            }[];
        }

    }catch(error){
        if(error instanceof ZodError){
            return new NextResponse('invalid body', {status:400});

        }

    }
    
}

