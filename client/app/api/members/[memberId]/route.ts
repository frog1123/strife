import { db } from '@/lib/db';
import { currentUser } from '@/lib/current-user';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request, { params }: { params: { memberId: string } }) {
  try {
    const user = await currentUser();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get('serverId');

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!serverId) {
      return new NextResponse('Server Id missing', { status: 400 });
    }

    if (!params.memberId) {
      return new NextResponse('Member Id missing', { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        userId: user.id
      },
      data: {
        members: {
          deleteMany: {
            id: params.memberId,
            userId: {
              not: user.id
            }
          }
        }
      },
      include: {
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

    return NextResponse.json(server);
  } catch (err) {
    console.log('[MEMBER_ID_DELETE]', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { memberId: string } }) {
  try {
    // use lib
    const user = await currentUser();
    const { searchParams } = new URL(req.url);
    const { role } = await req.json();
    const serverId = searchParams.get('serverId');

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!serverId) {
      return new NextResponse('Server Id missing', { status: 400 });
    }

    if (!params.memberId) {
      return new NextResponse('Member Id missing', { status: 400 });
    }

    console.log(serverId, user.id, role);

    const server = await db.server.update({
      where: {
        id: serverId,
        userId: user.id
      },
      data: {
        members: {
          update: {
            where: {
              id: params.memberId,
              userId: {
                not: user.id
              }
            },
            data: {
              role
            }
          }
        }
      },
      include: {
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

    return NextResponse.json(server);
  } catch (err) {
    console.log('[MEMBERS_ID_PATCH]', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
