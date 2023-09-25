import { db } from '@/lib/db';
import { currentUser } from '@/lib/current-user';
import { redirect } from 'next/navigation';
import { FC } from 'react';
import { NavigationAction } from '@/components/navigation/navigation-action';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NavigationItem } from '@/components/navigation/navigation-item';

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
      <Separator className='h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto' />
      <ScrollArea className='flex-1 w-full'>
        {servers.map(server => (
          <div key={server.id} className='mb-4'>
            <NavigationItem id={server.id} imageUrl={server.imageUrl} name={server.name} />
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};
