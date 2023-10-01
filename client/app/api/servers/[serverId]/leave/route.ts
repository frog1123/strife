import { currentUser } from '@/lib/current-user';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {
  try {
    const user = await currentUser();

    if (!user) return new NextResponse('Unauthorized', { status: 401 });
    if (!params.serverId) return new NextResponse('Server ID Missing', { status: 400 });

    const server = await db.server.update({
      where: {
        id: params.serverId,
        userId: {
          not: user.id
        },
        members: {
          some: {
            userId: user.id
          }
        }
      },
      data: {
        members: {
          deleteMany: {
            userId: user.id
          }
        }
      }
    });

    return NextResponse.json(server);
  } catch (err) {
    console.log('[SERVER_ID_LEAVE]', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
