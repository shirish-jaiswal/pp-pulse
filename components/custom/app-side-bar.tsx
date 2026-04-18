"use client";

import {
  DatabaseIcon,
  DicesIcon,
  FileCog,
  HomeIcon,
  UserIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import LogoutButton from "./logout-button";
import { useProfile } from "@/context/use-profile";

export const sideBarMenu = [
  { title: "Dashboard", url: "/home", icon: HomeIcon },
  { title: "Round Activity", url: "/round-activity", icon: DicesIcon },
  { title: "Resolution Templates", url: "/resolution-template", icon: FileCog },
  { title: "Excel DB", url: "/excel-db", icon: DatabaseIcon },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const pathname = usePathname();
  const isCollapsed = state === "collapsed";

  const { user } = useProfile();
  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      className="border-r border-border bg-background p-0"
    >
      <SidebarHeader className="px-3 py-1.5 flex border-b border-border">
        {!isCollapsed && (
          <div className="flex gap-2">
            <span className="text-base font-semibold tracking-tight">
              PP Pulse
            </span>
          </div>
        )}
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        <SidebarGroup>
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

          {/* Profile */}
          {user && (
            <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip={isCollapsed ? `${user.name || "Profile"}` : undefined}
                  className="h-8 px-2 text-sm font-medium flex items-center gap-2 rounded-md border border-transparent hover:bg-muted/50 hover:border-border"
                >
                  <UserIcon className="w-4 h-4 shrink-0" />
                  {!isCollapsed && (
                    <span className="truncate">
                      {user.name || "Profile"}
                    </span>
                  )}
                </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          {/* Logout */}
          <SidebarMenuItem>
            <LogoutButton isCollapsed={isCollapsed} />
          </SidebarMenuItem>

        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}