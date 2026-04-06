"use client";

import {
  ActivityIcon,
  Calendar,
  DatabaseIcon,
  DicesIcon,
  FileCog,
  Inbox,
  Search,
  Settings,
  SettingsIcon,
  UserSearch,
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

export const sideBarMenu = [
  { title: "Player", url: "/player-info", icon: UserSearch },
  { title: "Round Activity", url: "/round-activity", icon: DicesIcon },
  { title: "Resolution Templates", url: "/resolution-template", icon: FileCog },
  { title: "Excel DB", url: "/db", icon: DatabaseIcon },
];

const sideBarFooter = [{ title: "Session", url: "/session", icon: SettingsIcon }];

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 font-bold">
          {!isCollapsed && (
            <>
              <Image src="/logo.png" alt="logo" width={36} height={36} />
              <span className="truncate transition-all">PP Pulse</span>
            </>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sideBarMenu.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {sideBarFooter.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}