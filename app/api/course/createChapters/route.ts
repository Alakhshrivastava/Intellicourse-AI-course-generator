// /api/course/createChapters
import { NextResponse } from "next/server";
import { createChaptersSchema } from "@/validators/course";
import { ZodError } from "zod";
import { strict_output } from "@/lib/gpt";

// export async function POST(req: Request, res: Response) {
    // try {
    //     const body = await req.json();
    //     const{title,units}= createChaptersSchema.parse(body);
        
    //     type outputUnits = {
    //         title:string;
    //         chapters:{
    //             youtube_search_query:string;
    //             chapter_title:string;

    //         }[];
    //     };
        
    //     let output_units:outputUnits = await strict_output(
    //         'you are an AI capable of curating course content, coming up eith relvant chapter titles and finding relevant youtube videos for each chapters',
    //         new Array(units.length).fill(
    //             `It is your job to create a course about ${title}. The user has requested to create chapters for each of the units. Then, for each chapter, provide a detail youtube search qquery that can be used to find an informative educational video for each chapter. Each query should give an educational informative course in youtube.`
    //         ),
    //             {
    //                 title: "title of the unit",
    //                 chapters:"an array of chapters, each chapter should have a youtube_search_query and a chapter title key in the JSON object",
    //             }

    //     );
    //     console.log("||||||||working till here||||||");

    //     console.log(output_units);


    //     console.log(output_units);

    //     return NextResponse.json(output_units);
    // } catch (error) {
    //     if (error instanceof ZodError) {
    //         return new NextResponse("invalid body", {status: 400});
    //     }

    // }
// }
    export async function POST(req:Request,res:Response){
        try {
            const body = await req.json();
            const {title,units} = createChaptersSchema.parse(body);

            type outputUnits = {
                title:string;
                chapters:{
                    youtube_search_query: string;
                    chapter_title: string;
                }[];
            }

        } catch (error) {
            if (error instanceof ZodError){
                return new NextResponse("invalid body", {status: 400});
            }
        }
    }



