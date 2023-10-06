import ChatHeader from '@/components/chat/chat-header';
import { currentUser } from '@/lib/current-user';
import { db } from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { NextPage } from 'next';
import { redirect } from 'next/navigation';

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

const ChannelIdPage: NextPage<ChannelIdPageProps> = async ({ params }) => {
  const user = await currentUser();

  if (!user) return redirectToSignIn();

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId
    }
  });

  const member = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      userId: user.id
    }
  });

  if (!channel || !member) redirect('/');

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
      <ChatHeader />
    </div>
  );
};

export default ChannelIdPage;
