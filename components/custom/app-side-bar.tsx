"use client";

import {
  DatabaseIcon,
  DicesIcon,
  FileCog,
  SettingsIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import LogoutButton from "./logout-button";

export const sideBarMenu = [
  { title: "Round Activity", url: "/round-activity", icon: DicesIcon },
  { title: "Resolution Templates", url: "/resolution-template", icon: FileCog },
  { title: "Excel DB", url: "/excel-db", icon: DatabaseIcon },
];

const sideBarFooter = [
  { title: "Session", url: "/session", icon: SettingsIcon },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const pathname = usePathname();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      className="border-r border-border bg-background p-0"
    >
      <SidebarHeader className="h-10 px-3 flex items-center border-b border-border">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="logo" width={28} height={28} />
            <span className="text-sm font-semibold tracking-tight">
              PP Pulse
            </span>
          </div>
        )}
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Application
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {sideBarMenu.map((item) => {
                const isActive = pathname.startsWith(item.url);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={isCollapsed ? item.title : undefined}
                      className={cn(
                        "h-8 px-2 text-sm font-medium flex items-center gap-2 rounded-md",
                        "border border-transparent",
                        "hover:bg-muted/50 hover:border-border",
                        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border",
                        isActive && "bg-muted text-foreground border-border"
                      )}
                    >
                      <Link href={item.url}>
                        <item.icon className="w-4 h-4 shrink-0" />
                        {!isCollapsed && (
                          <span className="truncate">{item.title}</span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-border px-2 py-2">
        <SidebarMenu className="space-y-0.5">
          <SidebarMenuItem>
            <LogoutButton isCollapsed={isCollapsed} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}