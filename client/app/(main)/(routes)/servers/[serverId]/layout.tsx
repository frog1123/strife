import { ServerSidebar } from '@/components/server/server-sidebar';
import { currentUser } from '@/lib/current-user';
import { db } from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const ServerIdLayout = async ({ children, params }: { children: React.ReactNode; params: { serverId: string } }) => {
  const user = await currentUser();

  if (!user) {
    return redirectToSignIn();
  }

  // serverId because mapped to [serverId]
  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          userId: user.id
        }
      }
    }
  });

  if (!server) {
    return redirect('/');
  }

  return (
    <div className='h-full'>
      <div className='md:flex h-full w-60 z-20 flex-col fixed inset-y-0'>
        <ServerSidebar serverId={params.serverId} />
      </div>
      <main className='h-full md:pl-60'>{children}</main>
    </div>
  );
};

export default ServerIdLayout;
