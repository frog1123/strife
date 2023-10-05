import { currentUser } from '@/lib/current-user';
import { db } from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { NextPage } from 'next';
import { redirect } from 'next/navigation';

interface ServerIdPageProps {
  params: {
    serverId: string;
  };
}

const ServerIdPage: NextPage<ServerIdPageProps> = async ({ params }) => {
  const user = await currentUser();

  if (!user) return redirectToSignIn();

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          userId: user.id
        }
      }
    },
    include: {
      channels: {
        where: {
          name: 'general'
        },
        orderBy: {
          createdAt: 'asc'
        }
      }
    }
  });

  const initalChannel = server?.channels[0];

  if (initalChannel?.name !== 'general') return null;

  return redirect(`/servers/${params.serverId}/channels/${initalChannel.id}`);
};

export default ServerIdPage;
