"use client";

import { usePathname } from "next/navigation";
import { AppSidebar, sideBarMenu } from "@/components/custom/app-side-bar";
import SessionValidation from "@/components/custom/session-validation";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RoundDetailsProvider } from "@/features/round-details/context/round-details-context";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const currentRoute = sideBarMenu.find((item) => item.url === pathname);
  const currentTitle = currentRoute ? currentRoute.title : "Dashboard";

  return (
    <SidebarProvider style={{
      "--sidebar-width": "12rem",
      "--sidebar-width-icon": "2rem"
    } as React.CSSProperties}>
      <AppSidebar />
      <SidebarInset>
        <RoundDetailsProvider >
          <header className="flex h-8 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="transition-all text-xl font-bold">
              {currentTitle}
            </h1>
          </header>
          <ScrollArea className="h-[calc(100vh-4rem)] w-full">
            <div className="p-2">
              <SessionValidation>{children}</SessionValidation>
            </div>
          </ScrollArea>
        </RoundDetailsProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}