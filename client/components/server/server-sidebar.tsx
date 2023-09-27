import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs';
import { ChannelType } from '@prisma/client';
import { redirect } from 'next/navigation';
import { FC } from 'react';

interface ServerSidebarProps {
  serverId: string;
}

export const ServerSidebar: FC<ServerSidebarProps> = async ({ serverId }) => {
  const user = await currentUser();

  if (!user) {
    return redirect('/');
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId
    },
    include: {
      channels: {
        orderBy: {
          createdAt: 'asc'
        }
      },
      members: {
        include: {
          user: true
        },
        orderBy: {
          role: 'asc'
        }
      }
    }
  });

  const textChannels = server?.channels.filter(channel => channel.type === ChannelType.TEXT);
  const audioChannels = server?.channels.filter(channel => channel.type === ChannelType.VIDEO);
  const videoChannels = server?.channels.filter(channel => channel.type === ChannelType.AUDIO);

  const members = server?.members.filter(member => member.userId !== user.id);

  if (!server) {
    return redirect('/');
  }

  const role = server.members.find(member => member.userId === user.id)?.role;

  // TODO

  return (
    <div className='flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#f2f3f5]'>
      <ServerHeader server={server} role={role} />
    </div>
  );
};
