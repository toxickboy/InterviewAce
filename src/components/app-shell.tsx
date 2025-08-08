'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BarChart2, Home, PlusCircle, LogIn, LogOut, Loader2 } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Logo } from '@/components/logo';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/use-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  const isInterviewSession = pathname.startsWith('/interview/') && pathname.split('/').length > 2;
  const isLoginPage = pathname === '/login';

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  const getPageTitle = () => {
    if (pathname === '/') return 'Dashboard';
    if (pathname.startsWith('/interview')) return 'New Interview';
    if (pathname.startsWith('/progress')) return 'Progress';
    return 'InterviewAce';
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <div className={`flex min-h-screen w-full ${isInterviewSession ? '' : ''}`}>
      {!isInterviewSession && (
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <Logo />
              <span className="font-headline text-lg font-semibold">InterviewAce</span>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/'} tooltip="Dashboard">
                  <Link href="/">
                    <Home />
                    Dashboard
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/interview')} tooltip="New Interview">
                  <Link href="/interview">
                    <PlusCircle />
                    New Interview
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/progress')} tooltip="Progress">
                  <Link href="/progress">
                    <BarChart2 />
                    Progress
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-3 rounded-md p-2 cursor-pointer hover:bg-sidebar-accent">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.photoURL || `https://placehold.co/100x100.png`} alt="User" data-ai-hint="person avatar"/>
                      <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                      <span className="font-medium text-sm">{user.displayName || 'Guest User'}</span>
                      <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="start">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
               <div className="flex items-center gap-3 rounded-md p-2">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="https://placehold.co/100x100.png" alt="User" data-ai-hint="person avatar" />
                  <AvatarFallback>G</AvatarFallback>
                </Avatar>
                <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                  <span className="font-medium text-sm">Guest User</span>
                  <span className="text-xs text-muted-foreground">Welcome</span>
                </div>
              </div>
            )}
          </SidebarFooter>
        </Sidebar>
      )}
      <SidebarInset>
        {!isInterviewSession && (
           <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
             <div className="flex items-center gap-4">
                 <SidebarTrigger className="md:hidden" />
                 <h1 className="font-headline text-xl font-semibold">{getPageTitle()}</h1>
             </div>
             {user ? (
                 <Button asChild>
                     <Link href="/interview">
                         <PlusCircle className="mr-2 h-4 w-4" /> New Interview
                     </Link>
                 </Button>
             ) : (
                <Button asChild variant="outline">
                    <Link href="/login">
                        <LogIn className="mr-2 h-4 w-4" /> Login
                    </Link>
                </Button>
             )}
           </header>
        )}
        <main className={`flex-1 overflow-auto ${isInterviewSession ? '' : 'p-4 sm:p-6'}`}>
          {children}
        </main>
      </SidebarInset>
    </div>
  );
}
