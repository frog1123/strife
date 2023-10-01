import { currentUser } from '@/lib/current-user';
import { db } from '@/lib/db';
import { MemberRole } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    const { name, type } = await req.json();
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get('serverId');

    if (!user) return new NextResponse('Unauthorized', { status: 401 });
    if (!serverId) return new NextResponse('Server ID missing', { status: 400 });
    if (name === 'general') return new NextResponse("Name cannot be 'general'", { status: 400 });

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            userId: user.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR]
            }
          }
        }
      },
      data: {
        channels: {
          create: {
            userId: user.id,
            name,
            type
          }
        }
      }
    });

    return NextResponse.json(server);
  } catch (err) {
    console.log('[CHANNEL_POST]', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
