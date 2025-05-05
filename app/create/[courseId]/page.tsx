import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {
  params: {
    courseId : string;
  };
};

const CreateChapters = async (props: Props) => {

  const params = await props.params; // ✅ Await the params object
  const courseId = params.courseId;  

  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/gallery");
  }
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      units: {
        include: {
          chapters: true
        },
      },
    },
  });
  if (!course) {
    return redirect("/create");
  }
  return <pre>{JSON.stringify(course, null, 2)}</pre>;
};

export default CreateChapters;