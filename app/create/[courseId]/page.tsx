import { getAuthSession } from '@/lib/auth';
import {redirect} from 'next/navigation';
import { prisma } from '@/lib/db';
import React from 'react'
import { toast } from 'sonner';
import { Info } from 'lucide-react';
import ConfirmChapters from '@/components/ConfirmChapters';

type Props = {
  params: {
    courseId: string;
  };
};

const createChapters = async (props: Props) => {
  
  const params = await props.params; // ✅ Await the params object
  const courseId = params.courseId; 
  const session= await getAuthSession();
  if (!session?.user) {
    return redirect('/gallery');
  }
  console.log(courseId);
  const course = await prisma.course.findUnique({
    
    where: {
      id: courseId
    },
    include: {
      units: {
        include: {
          chapters: true,
        },
      },
    },
    
  });
  
  if (!course){
    toast("Error",{
      description: "Course Not Found",
      action: "destructive",
  });
  return redirect('/create');
  }
  
  
  return (
    <div className='flex flex-col items-start max-w-xl mx-auto my-16'>
      <h5 className="text-sm uppercase text-secondary-foreground/60">
        Course Name
      </h5>
      <h1 className= "text-5xl font-bold">
        {course.name}
      </h1>

      <div className='flex p-4 mt-5 border-none bg-secondary'>
        <Info className='w-12 h-12 mr-3 text-blue-400'/>
        <div>
          we generated chapters for each of your units. Look over them and then click the Button to confirm and continue.
        </div>
      </div>
      <ConfirmChapters course={course}/>
    </div>
  )
};

export default createChapters;