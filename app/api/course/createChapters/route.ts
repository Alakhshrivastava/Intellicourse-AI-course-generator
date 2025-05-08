// // /api/course/createChapters
// import { NextResponse } from "next/server";
// import { createChaptersSchema } from "@/validators/course";
// import { ZodError } from "zod";
// import { strict_output } from "@/lib/gpt";
// import { getUnsplashImage } from "@/lib/unsplash";
// import { prisma } from "@/lib/db";

// interface ApiError extends Error {
//     response?: {
//         data?: any;
//         status?: number;
//         headers?: {
//             'retry-after'?: string;
//         };
//     };
// }

// export async function POST(req: Request, res: Response) {
//     try {
//         const body = await req.json();
//         const{title,units}= createChaptersSchema.parse(body);
        
//         type outputUnits = {
//             title:string;
//             chapters:{
//                 youtube_search_query:string;
//                 chapter_title:string;

//             }[];
//         }[];
        
//         let output_units:outputUnits = await strict_output(
//             'you are an AI capable of curating course content, coming up with relevant chapter titles and finding relevant youtube videos for each chapters',
//             new Array(units.length).fill(
//                 `It is your job to create a course about ${title}. The user has requested to create chapters for each of the units. Then, for each chapter, provide a detail youtube search qquery that can be used to find an informative educational video for each chapter. Each query should give an educational informative course in youtube.`
//             ),
//                 {
//                     title: "title of the unit",
//                     chapters:"an array of chapters, each chapter should have a youtube_search_query and a chapter title key in the JSON object",
//                 }

//         );

//         const imageSearchTerm = await strict_output(
//             'you are an aAI capable of finding the most relevant image for a course',
//             `please provide a good image search term for the title of a course about ${title}. This search term will be fed into the unsplash API. So make sure it is a good search term that will return good results.`,
//             {
//                 image_search_term: 'a good search term for the title of a course'
//             }
//         );

//         const course_image = await getUnsplashImage(
//             imageSearchTerm.image_search_term
//         );

//         const course = await prisma.course.create({
//             data: {
//                 name: title,
//                 image: course_image,
//             },
//         });

//         for (const unit of output_units) {
//             const title = unit.title;
//             const prismaUnit = await prisma.unit.create({
//                 data: {
//                     name: title,
//                     courseId: course.id,
//                 }
//             })
//             await prisma.chapter.createMany({
//                 data: unit.chapters.map((chapter) => {
//                     return {
//                         name: chapter.chapter_title,
//                         youtubeSearchQuery: chapter.youtube_search_query,
//                         unitId: prismaUnit.id,
//                     };
//                 }),
//             });
//         }    
        
//         return NextResponse.json({course_id : course.id});
//     } catch (error: unknown) {
//         console.error("Full error details:", error);
        
//         if (error instanceof ZodError) {
//             return NextResponse.json({
//                 error: "Invalid request format",
//                 details: error.errors
//             }, { status: 400 });
//         }

//         const apiError = error as ApiError;
        
//         if (apiError.response?.data) {
//             console.error("API Error Response:", apiError.response.data);
            
//             if (apiError.response.status === 429) {
//                 return NextResponse.json({
//                     error: "Rate limit exceeded",
//                     message: "Please try again later",
//                     retryAfter: apiError.response.headers?.['retry-after'] || '60'
//                 }, { status: 429 });
//             }
//         }

//         return NextResponse.json({
//             error: "Internal server error",
//             message: apiError.message || "Unknown error occurred"
//         }, { status: 500 });
//     }
// }
import { NextResponse } from "next/server";
import { createChaptersSchema } from "@/validators/course";
import { ZodError } from "zod";
import { strict_output } from "@/lib/gpt";
import { getUnsplashImage } from "@/lib/unsplash";
import { prisma } from "@/lib/db";

interface ApiError extends Error {
    response?: {
        data?: any;
        status?: number;
        headers?: {
            'retry-after'?: string;
        };
    };
}

export async function POST(req: Request, res: Response) {
    try {
        const body = await req.json();
        const { title, units } = createChaptersSchema.parse(body);
        
        type outputUnits = {
            title: string;
            chapters: {
                youtube_search_query: string;
                chapter_title: string;
            }[];
        }[];
        
        let output_units: outputUnits = await strict_output(
            `You are an AI that strictly outputs valid JSON format using double quotes for all keys and string values.
            Generate course content with these requirements:
            1. Proper JSON syntax with quoted keys and values
            2. Each unit must have unique title
            3. Chapter titles should be distinct and descriptive`,
            new Array(units.length).fill(
                `Create a course about ${title} with units. For each chapter, provide:
                - youtube_search_query (string)
                - chapter_title (string)
                Use exactly this JSON structure:
                {
                    "title": "Unit Title",
                    "chapters": [
                        {
                            "youtube_search_query": "search phrase",
                            "chapter_title": "Chapter Name"
                        }
                    ]
                }`
            ),
            {
                title: "title of the unit",
                chapters: "array of chapters with youtube_search_query and chapter_title"
            }
        );

        // let course_image = "";
        // try {
        //     const imageSearchTerm = await strict_output(
        //         'You generate search terms for Unsplash images. Return ONLY the search term in JSON format.',
        //         `Generate a single image search term for: ${title}`,
        //         { image_search_term: "string" }
        //     );
            
        //     course_image = await getUnsplashImage(imageSearchTerm.image_search_term);
        // } catch (imageError) {
        //     console.error("Image search failed, using default", imageError);
        //     course_image = "https://images.unsplash.com/photo-1509228468518-180dd4864904?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMzh8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb258ZW58MHx8fHwxNzE2NjY1NjM5fDA&ixlib=rb-4.0.3&q=80&w=1080";
        // }

        // const course = await prisma.course.create({
        //     data: {
        //         name: title,
        //         image: course_image,
        //     },
        // });
        let course_image ="";
        try{
        const imageSearchTerm = await strict_output(
            'you are an AI capable of finding the most relevant image for a course',
            `please provide a good image search term for the title of a course about ${title}. This search term will be fed into the unsplash API. So make sure it is a good search term that will return good results.`,
            {
                image_search_term: 'a good search term for the title of a course'
            }
        );

        const course_image = await getUnsplashImage(
            imageSearchTerm.image_search_term
        );
    }catch (imageError) {
        console.error("Image search failed, using default", imageError);
        course_image = "https://images.unsplash.com/photo-1509228468518-180dd4864904?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMzh8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb258ZW58MHx8fHwxNzE2NjY1NjM5fDA&ixlib=rb-4.0.3&q=80&w=1080";
    }

        const course = await prisma.course.create({
            data: {
                name: title,
                image: course_image,
            },
        });

            

        for (const unit of output_units) {
            const title = unit.title;
            const prismaUnit = await prisma.unit.create({
                data: {
                    name: title,
                    courseId: course.id,
                }
            });
            
            await prisma.chapter.createMany({
                data: unit.chapters.map((chapter) => ({
                    name: chapter.chapter_title,
                    youtubeSearchQuery: chapter.youtube_search_query,
                    unitId: prismaUnit.id,
                })),
            });
        }

        return NextResponse.json({course_id:course.id });
    } catch (error: unknown) {
        console.error("Full error details:", error);
        
        if (error instanceof ZodError) {
            return NextResponse.json({
                error: "Invalid request format",
                details: error.errors
            }, { status: 400 });
        }

        const apiError = error as ApiError;
        
        if (apiError.response?.data) {            
            if (apiError.response.status === 429) {
                return NextResponse.json({
                    error: "Rate limit exceeded",
                    message: "Please try again later",
                    retryAfter: apiError.response.headers?.['retry-after'] || '60'
                }, { status: 429 });
            }
        }

        return NextResponse.json({
            error: "Internal server error",
            message: (error instanceof Error) ? error.message : "Unknown error occurred"
        }, { status: 500 });
    }
}