'use client';

import { FC, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useModal } from '@/hooks/use-modal-store';
import { ServerWithMembersWithProfiles } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserAvatar } from '@/components/user-avatar';
import { MoreHorizontal, Shield, ShieldCheck, ShieldQuestion } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger
} from '@/components/ui/dropdown-menu';

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className='h-4 w-4 ml-2 text-emerald-500' />,
  ADMIN: <ShieldCheck className='h-4 w-4 ml-2 text-rose-500' />
};

export const MembersModal: FC = () => {
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const [loadingId, setLoadingId] = useState('');

  const isModalOpen = isOpen && type === 'members';
  const { server } = data as { server: ServerWithMembersWithProfiles };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className='bg-white text-black overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>Manage Members</DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>{server?.members?.length} Members</DialogDescription>
        </DialogHeader>
        <ScrollArea className='mt-8 max-h-[420px] pr-6'>
          {server?.members?.map(m => (
            <div key={m.id} className='flex items-center gap-x-2 mb-6'>
              <UserAvatar src={m.user.imageUrl} />
              <div className='flex flex-col gap-y-1'>
                <div className='text-xs font-semibold flex items-center gap-x-1'>
                  {m.user.name} {roleIconMap[m.role]}
                </div>
                <p className='text-xs text-zinc-500'>{m.user.email}</p>
              </div>
              {server.userId !== m.userId && loadingId !== m.id && (
                <div className='ml-auto'>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreHorizontal className='h-4 w-4 text-zinc-500' />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side='left'>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className='flex items-center'>
                          <ShieldQuestion className='h-4 w-4 mr-2' />
                          <span>Role</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem>
                              <Shield className='h-4 w-4 mr-2' />
                              Guest
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
