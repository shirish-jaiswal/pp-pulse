"use client";

import { usePathname } from "next/navigation";

import { AppSidebar, sideBarMenu } from "@/components/custom/app-side-bar";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { ScrollArea } from "@/components/ui/scroll-area";
import { RoundDetailsProvider } from "@/features/round-details/context/round-details-context";
import { ProfileProvider } from "@/context/use-profile";
import { useUser } from "@/hooks/use-user";
import NotesToaster from "@/components/custom/NotesToaster";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  useUser();

  const currentRoute = sideBarMenu.find((item) =>
    pathname.startsWith(item.url)
  );

  const currentTitle = currentRoute?.title ?? "Dashboard";

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "12rem",
          "--sidebar-width-icon": "2rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />

      <SidebarInset className="flex flex-col h-screen bg-background">

        {/* HEADER */}
        <header className="sticky top-0 z-10 flex h-12 items-center gap-3 border-b bg-background/80 backdrop-blur px-4">
          <SidebarTrigger className="-ml-1" />

          <div className="flex flex-col leading-tight">
            <h1 className="text-sm font-semibold">{currentTitle}</h1>
            <p className="text-[11px] text-muted-foreground">
              Support Workspace
            </p>
          </div>

          <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
            {/* future: status / alerts / workload */}
          </div>
        </header>

        {/* CONTENT */}
        <RoundDetailsProvider>
          <NotesToaster />

          <ScrollArea className="flex-1 w-full">
            <div className="p-3 md:p-4">{children}</div>
          </ScrollArea>
        </RoundDetailsProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProfileProvider>
      <LayoutContent>{children}</LayoutContent>
    </ProfileProvider>
  );
}