import { currentUser, redirectToSignIn } from '@clerk/nextjs';
import { db } from '@/lib/db';
import { User } from '@prisma/client';

export const initialUser = async (): Promise<User> => {
  const clerkUser = await currentUser();

  if (!clerkUser) return redirectToSignIn();

  const user = await db.user.findUnique({
    where: {
      userId: clerkUser.id
    }
  });

  if (user) {
    return user;
  }

  const newUser = await db.user.create({
    data: {
      userId: clerkUser.id,
      name: `${clerkUser.firstName} ${clerkUser.lastName}`,
      imageUrl: clerkUser.imageUrl,
      email: clerkUser.emailAddresses[0].emailAddress
    }
  });

  return newUser;
};
