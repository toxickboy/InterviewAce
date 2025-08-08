'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart2, Home, PlusCircle } from 'lucide-react';

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

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isInterviewSession = pathname.startsWith('/interview/') && pathname.split('/').length > 2;

  if (isInterviewSession) {
    return <>{children}</>;
  }

  const getPageTitle = () => {
    if (pathname === '/') return 'Dashboard';
    if (pathname.startsWith('/interview')) return 'New Interview';
    if (pathname.startsWith('/progress')) return 'Progress';
    return 'InterviewAce';
  };

  return (
      <div className="flex min-h-screen w-full">
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
                <Link href="/" legacyBehavior passHref>
                  <SidebarMenuButton isActive={pathname === '/'} tooltip="Dashboard">
                    <Home />
                    Dashboard
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/interview" legacyBehavior passHref>
                  <SidebarMenuButton isActive={pathname.startsWith('/interview')} tooltip="New Interview">
                    <PlusCircle />
                    New Interview
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/progress" legacyBehavior passHref>
                  <SidebarMenuButton isActive={pathname.startsWith('/progress')} tooltip="Progress">
                    <BarChart2 />
                    Progress
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <div className="flex items-center gap-3 rounded-md p-2">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://placehold.co/100x100.png" alt="User" data-ai-hint="person avatar" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="font-medium text-sm">Guest User</span>
                <span className="text-xs text-muted-foreground">Welcome</span>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
            <div className="flex items-center gap-4">
                <SidebarTrigger className="md:hidden" />
                <h1 className="font-headline text-xl font-semibold">{getPageTitle()}</h1>
            </div>
            <Button asChild>
                <Link href="/interview">
                    <PlusCircle className="mr-2 h-4 w-4" /> New Interview
                </Link>
            </Button>
          </header>
          <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
        </SidebarInset>
      </div>
  );
}
