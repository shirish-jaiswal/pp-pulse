"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/custom/app-side-bar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RoundDetailsProvider } from "@/features/round-details/context/round-details-context";
import { ProfileProvider } from "@/context/use-profile";
import DoYouKnow from "@/components/custom/do-you-know";
import { useRbacMenu } from "@/hooks/use-rbac-menu";
import KnowledgeQuiz from "@/components/custom/k-quiz";
import TimeZone from "@/components/custom/time-zone";
import IPTracker from "@/components/custom/IPTracker";

// Import your newly created dynamic public API timezone selector component

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { menu } = useRbacMenu();
  const currentRoute = menu.find((item) =>
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
      <AppSidebar menu={menu} />
      <SidebarInset className="flex flex-col h-screen bg-background">
        <header className="sticky top-0 z-10 flex h-12 py-1.5 items-center justify-between gap-3 border-b bg-background/80 backdrop-blur px-4 shadow-md">
          {/* LEFT SIDE: Navigation Trigger and Route Identity */}
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <div className="flex flex-col leading-tight">
              <h1 className="text-sm font-semibold">{currentTitle}</h1>
              <p className="text-[11px] text-muted-foreground">
                Support Workspace
              </p>
            </div>
          </div>
        </header>

        {/* MAIN DISPLAY REGION */}
        <RoundDetailsProvider>
          <DoYouKnow />
          <KnowledgeQuiz />
          <ScrollArea className="flex-1 w-full">
            <div className="p-1">{children}</div>
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