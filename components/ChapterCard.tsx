"use client"
import { Chapter } from '@prisma/client'
import React from 'react'
import { cn } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'



type Props = {
    chapter: Chapter
    chapterIndex: number
};

export type ChapterCardHandler = {
    triggerLoad: () => void;
}

const ChapterCard = React.forwardRef<ChapterCardHandler, Props>(({chapter, chapterIndex}, ref) => {
    React.useImperativeHandle(ref, () => ({
        async triggerLoad(){
            console.log("Hello")
        }
    }))

    const[Success, setSuccess] = React.useState <boolean | null> (null);
    const {mutate: getChapterInfo, isPending}= useMutation({
        mutationFn: async ()=>{
            const response =await axios.post('/api/chapter/getInfo')
            return response.data;
        }
    })
  return (
    <div key={chapter.id} className={cn('px-4 py-2 mt-2 rounded flex justify-between', {
        "bg-secondary": Success === null, 
        'bg-red-500': Success ===false, 
        'bg-green-500': Success === true,
    }
    )}>
        <h5>
            {chapter.name}
        </h5>
    </div>
  )
});

ChapterCard.displayName = 'ChapterCard';

export default ChapterCard