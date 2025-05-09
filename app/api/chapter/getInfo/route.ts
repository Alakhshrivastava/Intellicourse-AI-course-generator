// /api/chapter/getInfo

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getQuestionsFromTranscript, getTranscript, searchYouTube } from "@/lib/youtube";
import { strict_output } from "@/lib/gpt";


const bodyParser = z.object({
  chapterId: z.string(),
})


export async function POST(req: Request, res: Response) {
  try {
    const body =await req.json();
    const { chapterId } = bodyParser.parse(body);

    const chapter =await prisma.chapter.findUnique({
      where:{
        id:chapterId,
      },
    });
    if (!chapter) {
      return NextResponse.json({
        Success: false,
        error: "Chapter not found",
      },{ status: 404 });
    }

    const videoId= await searchYouTube(chapter.youtubeSearchQuery);
    let transcript = await getTranscript(videoId);
    let maxLength = 500;
    transcript = transcript.split(' ').slice(0, maxLength).join(' ');

    const {summary}:{summary:string} = await strict_output(
      'you are an AI capable of summarising a youtube video transcript.',
      'summarise the transcript in 250 words or less and do not talk of the sponsors or anything unrelated to the main topic of the video, also do not introduce what the summary is about.\n'+ transcript,
      {
        summary: "summary of the transcript"
      }
    );

    const questions = await getQuestionsFromTranscript(transcript, chapter.name)

    await prisma.question.createMany({
      data: questions.map(question => {
        let options = [question.answer, question.option1, question.option2, question.option3];
        options = options.sort(() => Math.random() - 0.5);
        return{
          question:question.question,
          answer:question.answer,
          options:JSON.stringify(options),
          chapterId:chapterId,
        }
      }),
    });

    await prisma.chapter.update({
      where: {
        id: chapterId,
      },
      data:{
        videoId: videoId,
        summary: summary,
      },
    });

    return NextResponse.json({success:true});

  } catch (error) {
    if(error instanceof z.ZodError) {
      return NextResponse.json({
        Success: false,
        error: "Invalid Body",
      },{ status: 400 });
    }
    else{
      return NextResponse.json({
        Success: false,
        error: "Unknown",
      },{ status: 500 });
    }
  }
    
}