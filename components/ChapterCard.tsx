"use client"
import { Chapter } from '@prisma/client'
import React from 'react'
import { cn } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'sonner'
import { set } from 'zod'
import { Loader2 } from 'lucide-react'


type Props = {
    chapter: Chapter
    chapterIndex: number
    completedChapters: Set<String>
    setCompletedChapters: React.Dispatch<React.SetStateAction<Set<String>>>
};

export type ChapterCardHandler = {
    triggerLoad: () => void;
}

const ChapterCard = React.forwardRef<ChapterCardHandler, Props>(({chapter, chapterIndex, setCompletedChapters, completedChapters}, ref) => {

    const[Success, setSuccess] = React.useState <boolean | null> (null);
    const {mutate: getChapterInfo, isPending}= useMutation({
        mutationFn: async ()=>{
            const response =await axios.post('/api/chapter/getInfo',{chapterId: chapter.id});
            return response.data;
        },
    });

    const addChapterIdToSet = React.useCallback(() => {
        setCompletedChapters((prev) => {
            const newSet = new Set(prev);
            newSet.add(chapter.id);
            return newSet;
        });
    }, [chapter.id, setCompletedChapters]);

    React.useEffect(() => {
        if(chapter.videoId){
            setSuccess(true);
            addChapterIdToSet();
        }
    }, [chapter, addChapterIdToSet]);

    React.useImperativeHandle(ref, () => ({
        async triggerLoad(){
            if(chapter.videoId){
                addChapterIdToSet();
                return;
            }
            getChapterInfo(undefined, {
                onSuccess: () => {
                    setSuccess(true);
                    addChapterIdToSet();
                },
                onError:(error) => {
                    console.error(error);
                    setSuccess(false);  
                    toast("Error",{
                        description: "There was an error loading your chapter",
                        action: "destructive",
                    });
                    addChapterIdToSet();
                },
                
            });
        },
    }));

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
        {isPending && <Loader2 className='animate-spin'/>}
    </div>
  )
});

ChapterCard.displayName = 'ChapterCard';

export default ChapterCard

// "use client";
// import { cn } from "@/lib/utils";
// import { Chapter } from "@prisma/client";
// import { useMutation } from "@tanstack/react-query";
// import axios from "axios";
// import React from "react";
// import {toast} from "sonner"
// import { Loader2 } from "lucide-react";

// type Props = {
//   chapter: Chapter;
//   chapterIndex: number;
//   completedChapters: Set<String>;
//   setCompletedChapters: React.Dispatch<React.SetStateAction<Set<String>>>;
// };

// export type ChapterCardHandler = {
//   triggerLoad: () => any;
// };

// const ChapterCard = React.forwardRef<ChapterCardHandler, Props>(
//   ({ chapter, chapterIndex, setCompletedChapters, completedChapters }, ref) => {
//     const { toast } = useToast();
//     const [success, setSuccess] = React.useState<boolean | null>(null);
//     const { mutate: getChapterInfo, isPending } = useMutation({
//       mutationFn: async () => {
//         const response = await axios.post("/api/chapter/getInfo", {
//           chapterId: chapter.id,
//         });
//         return response.data;
//       },
//     });

//     const addChapterIdToSet = React.useCallback(() => {
//       setCompletedChapters((prev) => {
//         const newSet = new Set(prev);
//         newSet.add(chapter.id);
//         return newSet;
//       });
//     }, [chapter.id, setCompletedChapters]);

//     React.useEffect(() => {
//       if (chapter.videoId) {
//         setSuccess(true);
//         addChapterIdToSet;
//       }
//     }, [chapter, addChapterIdToSet]);

//     React.useImperativeHandle(ref, () => ({
//       async triggerLoad() {
//         if (chapter.videoId) {
//           addChapterIdToSet();
//           return;
//         }
//         getChapterInfo(undefined, {
//           onSuccess: () => {
//             setSuccess(true);
//             addChapterIdToSet();
//           },
//           onError: (error) => {
//             console.error(error);
//             setSuccess(false);
//             toast({
//               title: "Error",
//               description: "There was an error loading your chapter",
//               variant: "destructive",
//             });
//             addChapterIdToSet();
//           },
//         });
//       },
//     }));
//     return (
//       <div
//         key={chapter.id}
//         className={cn("px-4 py-2 mt-2 rounded flex justify-between", {
//           "bg-secondary": success === null,
//           "bg-red-500": success === false,
//           "bg-green-500": success === true,
//         })}
//       >
//         <h5>{chapter.name}</h5>
//         {isLoading && <Loader2 className="animate-spin" />}
//       </div>
//     );
//   }
// );

// ChapterCard.displayName = "ChapterCard";

// export default ChapterCard;