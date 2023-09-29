import { currentUser } from '@/lib/current-user';
import { db } from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { NextPage } from 'next';
import { redirect } from 'next/navigation';

interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
}

const InviteCodePage: NextPage<InviteCodePageProps> = async ({ params }) => {
  const user = await currentUser();

  if (!user) {
    return redirectToSignIn();
  }

  if (!params.inviteCode) {
    return redirect('/');
  }

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          userId: user.id
        }
      }
    }
  });

  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }

  const server = await db.server.update({
    where: {
      inviteCode: params.inviteCode
    },
    data: {
      members: {
        create: [{ userId: user.id }]
      }
    }
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return null;
};

export default InviteCodePage;
