import { NavigationSidebar } from '@/components/navigation/navigation-sidebar';

const ServerLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='h-full'>
      {/* remove hidden */}
      <div className='md:flex h-full w-[72px] z-30 flex-col fixed inset y-0'>
        <NavigationSidebar />
      </div>
      <main className='md:pl-[72px] h-full'>{children}</main>
    </div>
  );
};

export default ServerLayout;