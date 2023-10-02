import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs';
import { ChannelType, MemberRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import { FC } from 'react';
import { ServerHeader } from '@/components/server/server-header';
import { ScrollArea } from '@/components/ui/scroll-area';
import ServerSearch from '@/components/server/server-search';
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react';

interface ServerSidebarProps {
  serverId: string;
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className='mr-2 h-4 w-4' />,
  [ChannelType.AUDIO]: <Mic className='mr-2 h-4 w-4' />,
  [ChannelType.VIDEO]: <Video className='mr-2 h-4 w-4' />
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className='h-4 w-4 mr-2 text-blue-500' />,
  [MemberRole.ADMIN]: <ShieldAlert className='h-4 w-4 mr-2 text-rose-500' />
};

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

  // structure
  const role = server.members.find(member => member.user.userId === user.id)?.role;

  return (
    <div className='flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#f2f3f5]'>
      <ServerHeader server={server} role={role} />
      <ScrollArea className='flex-1 px-3'>
        <div className='mt-2'>
          <ServerSearch
            data={[
              {
                label: 'Text Channels',
                type: 'channel',
                data: textChannels?.map(channel => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type]
                }))
              },
              {
                label: 'Voice Channels',
                type: 'channel',
                data: audioChannels?.map(channel => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type]
                }))
              },
              {
                label: 'Video Channels',
                type: 'channel',
                data: videoChannels?.map(channel => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type]
                }))
              },
              {
                label: 'Members',
                type: 'member',
                data: members?.map(m => ({
                  id: m.id,
                  name: m.user.name,
                  icon: roleIconMap[m.role]
                }))
              }
            ]}
          />
        </div>
      </ScrollArea>
    </div>
  );
};
