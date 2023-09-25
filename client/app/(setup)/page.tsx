import { NextPage } from 'next';
import { initialUser } from '@/lib/inital-user';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { InitialModal } from '@/components/modals/inital-modal';

const SetupPage: NextPage = async () => {
  const user = await initialUser();

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          userId: user.id
        }
      }
    }
  });

  if (server) {
    return redirect(`servers/${server.id}`);
  }

  return <InitialModal />;
};

export default SetupPage;
