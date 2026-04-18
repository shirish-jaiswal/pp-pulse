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
import { useUser } from "@/hooks/use-user";
import { ProfileProvider } from "@/context/use-profile";

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
      <SidebarInset>
        <RoundDetailsProvider>
          <header className="flex h-8 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-xl font-bold">{currentTitle}</h1>
          </header>

          <ScrollArea className="h-[calc(100vh-2rem)] w-full">
            <div className="p-2">{children}</div>
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