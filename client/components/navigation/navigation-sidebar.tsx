import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { FC } from 'react';
import { NavigationAction } from '@/components/navigation/navigation-action';

export const NavigationSidebar: FC = async () => {
  const user = await currentUser();

  if (!user) {
    return redirect('/');
  }

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          userId: user.id
        }
      }
    }
  });

  return (
    <div className='space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1d1f22] py-3'>
      <NavigationAction />
    </div>
  );
};
