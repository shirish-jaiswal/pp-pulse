"use client";

import {
  BookOpen,
  Building2,
  DatabaseIcon,
  DicesIcon,
  FileCog,
  GalleryHorizontal,
  HistoryIcon,
  HomeIcon,
  Users,
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
   ICON MAP
========================= */

const ICON_MAP: Record<string, any> = {
  HomeIcon,
  DicesIcon,
  HistoryIcon,
  Building2,
  Users,
  GalleryHorizontal,
  FileCog,
  BookOpen,
  DatabaseIcon,
  UserIcon,
};

/* =========================
   TYPES
========================= */

type MenuItem = {
  title: string;
  url: string;
  icon: string;
  group: string;
  enabled?: boolean;
};

/* =========================
   PROPS
========================= */

export function AppSidebar({
  menu,
}: {
  menu: MenuItem[];
}) {
  const { state } = useSidebar();
  const pathname = usePathname();
  const isCollapsed = state === "collapsed";
  const { user } = useProfile();

  /* =========================
     GROUP MENU (DYNAMIC)
  ========================= */

  const grouped = menu.reduce((acc, item) => {
    if (item.enabled === false) return acc;

    const group = item.group || "OTHER";

    if (!acc[group]) acc[group] = [];
    acc[group].push(item);

    return acc;
  }, {} as Record<string, MenuItem[]>);

  /* =========================
     RENDER MENU
  ========================= */

  const renderMenu = (items: MenuItem[]) =>
    items.map((item) => {
      const isActive = pathname.startsWith(item.url);
      const Icon = ICON_MAP[item.icon];

      return (
        <SidebarMenuItem key={item.url}>
          <SidebarMenuButton
            asChild
            tooltip={isCollapsed ? item.title : undefined}
            className={cn(
              "h-9 px-2 flex items-center gap-2 rounded-md transition-all",
              "border border-transparent hover:bg-muted/60",
              isActive &&
                "bg-muted text-foreground border-l-2 border-primary shadow-sm"
            )}
          >
            <Link href={item.url} className="flex items-center gap-2 w-full">
              {Icon && <Icon className="w-4 h-4 shrink-0" />}
              {!isCollapsed && (
                <span className="truncate">{item.title}</span>
              )}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    });

  /* =========================
     UI
  ========================= */

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
              <SidebarMenu>
                {renderMenu(items)}
              </SidebarMenu>
            </SidebarGroupContent>

          </SidebarGroup>
        ))}

      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter className="border-t px-2 py-2 space-y-1">

        {user && (
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={isCollapsed ? user.name : undefined}
              className="h-9 px-2 flex items-center gap-2"
            >
              <Link href="/profile" className="flex gap-2 w-full">
                <UserIcon className="w-4 h-4" />
                {!isCollapsed && (
                  <span className="truncate capitalize">
                    {user.name}
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