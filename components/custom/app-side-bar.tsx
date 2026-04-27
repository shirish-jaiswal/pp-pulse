"use client";

import {
  BookOpen,
  DatabaseIcon,
  DicesIcon,
  FileCog,
  GalleryHorizontal,
  HistoryIcon,
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
import LogoutButton from "@/components/custom/logout-button";
import { useProfile } from "@/context/use-profile";
import Image from "next/image";

/* =========================
   BASE MENU (ALWAYS FALLBACK)
========================= */

export const sideBarMenu = [
  { title: "Dashboard", url: "/home", icon: HomeIcon, group: "WORK" },
  { title: "Round Activity", url: "/round-activity", icon: DicesIcon, group: "WORK" },
  { title: "Player History", url: "/player-history", icon: HistoryIcon, group: "WORK" },

  { title: "Template Gallery", url: "/template-gallery", icon: GalleryHorizontal, group: "ASSETS" },
  { title: "Resolution Templates", url: "/resolution-template", icon: FileCog, group: "TOOLS" },
  { title: "K-Boost", url: "/knowledge-boost", icon: BookOpen, group: "TOOLS" },
  { title: "Excel DB", url: "/excel-db", icon: DatabaseIcon, group: "TOOLS" },
];

type DbMenuItem = {
  url: string;
  enabled: boolean;
};

function buildSidebarMenu(dbMenu: DbMenuItem[] | null) {
  if (!dbMenu || dbMenu.length === 0) return sideBarMenu;

  const enabledMap = new Map(dbMenu.map((i) => [i.url, i.enabled]));

  return sideBarMenu.filter((item) => {
    if (!enabledMap.has(item.url)) return true;
    return enabledMap.get(item.url);
  });
}

function groupMenu(items: typeof sideBarMenu) {
  return items.reduce((acc, item) => {
    const group = item.group || "OTHER";
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {} as Record<string, typeof sideBarMenu>);
}

export function AppSidebar({ dbMenu }: { dbMenu?: DbMenuItem[] }) {
  const { state } = useSidebar();
  const pathname = usePathname();
  const isCollapsed = state === "collapsed";
  const { user } = useProfile();

  const finalMenu = buildSidebarMenu(dbMenu || null);
  const grouped = groupMenu(finalMenu);

  const renderMenu = (items: typeof sideBarMenu) =>
    items.map((item) => {
      const isActive = pathname.startsWith(item.url);

      return (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            asChild
            tooltip={isCollapsed ? item.title : undefined}
            className={cn(
              "h-9 px-2 text-sm font-medium flex items-center gap-2 rounded-md transition-all",
              "border border-transparent hover:bg-muted/60",
              isActive &&
                "bg-muted text-foreground border-l-2 border-primary shadow-sm"
            )}
          >
            <Link href={item.url} className="flex items-center gap-2 w-full">
              <item.icon className="w-4 h-4 shrink-0" />
              {!isCollapsed && (
                <span className="truncate">{item.title}</span>
              )}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    });

  return (
    <Sidebar variant="inset" collapsible="icon" className="border-r bg-background p-0">

      {/* HEADER */}
      <SidebarHeader className="flex items-center justify-center bg-slate-800 p-1.5">
        {!isCollapsed && (
          <Image src="/portal/logo.png" alt="logo" width={90} height={40} />
        )}
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent className="px-2 space-y-4">

        {Object.entries(grouped).map(([group, items]) => (
          <SidebarGroup key={group}>
            <p className="text-[11px] uppercase text-muted-foreground px-2 mb-1">
              {group}
            </p>
            <SidebarGroupContent>
              <SidebarMenu>{renderMenu(items)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter className="border-t px-2 py-2 space-y-1">

        {user && (
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={isCollapsed ? user.name || "Profile" : undefined}
              className="h-9 px-2 flex items-center gap-2 rounded-md hover:bg-muted/60"
            >
              <Link href="/profile" className="flex items-center gap-2 w-full">
                <UserIcon className="w-4 h-4" />
                {!isCollapsed && (
                  <span className="truncate capitalize">
                    {user.name || "Profile"}
                  </span>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}

        <LogoutButton isCollapsed={isCollapsed} />
      </SidebarFooter>
    </Sidebar>
  );
}