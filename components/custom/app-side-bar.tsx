"use client";

import { useEffect } from "react";
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
  ChevronRight,
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

// Icon Map definition matching database/JSON configurations
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

// Expanded MenuItem type to handle optional metric/status badges
type MenuItem = {
  title: string;
  url: string;
  icon: string;
  group: string;
  enabled?: boolean;
  badge?: string | number; 
};

export function AppSidebar({ menu }: { menu: MenuItem[] }) {
  const { state, setOpen } = useSidebar();
  const pathname = usePathname();
  const isCollapsed = state === "collapsed";
  const { user } = useProfile();

  // Automatically collapse sidebar if pathname starts with /log-exp
  useEffect(() => {
    if (pathname.startsWith("/log-exp")) {
      setOpen(false);
    }
  }, [pathname, setOpen]);

  // Group navigation items cleanly and filter out disabled entries
  const grouped = menu.reduce((acc, item) => {
    if (item.enabled === false) return acc;
    const group = item.group || "OTHER";
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  // Dynamic menu mapper
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
              "h-10 px-3 relative flex items-center gap-3 rounded-lg transition-all duration-200 group/item",
              "hover:bg-muted/70 text-muted-foreground hover:text-foreground",
              isActive && [
                "bg-primary/5 text-primary font-medium hover:bg-primary/10 hover:text-primary",
                "before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-r-md before:bg-primary"
              ]
            )}
          >
            <Link href={item.url} className="flex items-center w-full justify-between">
              <div className="flex items-center gap-3 min-w-0">
                {Icon && (
                  <Icon
                    className={cn(
                      "w-4.5 h-4.5 shrink-0 transition-transform duration-200 group-hover/item:scale-105",
                      isActive ? "text-primary" : "text-muted-foreground/80 group-hover/item:text-foreground"
                    )}
                  />
                )}
                {!isCollapsed && (
                  <span className="truncate text-sm tracking-wide">{item.title}</span>
                )}
              </div>

              {/* Action item content (Badge counter or subtle Active arrow) */}
              {!isCollapsed && (
                <div className="flex items-center justify-end ml-auto shrink-0">
                  {item.badge ? (
                    <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide transition-all">
                      {item.badge}
                    </span>
                  ) : (
                    isActive && <ChevronRight className="w-3.5 h-3.5 text-primary/70" />
                  )}
                </div>
              )}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    });

  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      className="border-r border-border/60 bg-sidebar-background p-0 backdrop-blur-md"
    >
      {/* HEADER */}
      <SidebarHeader
        className={cn(
          "flex items-center justify-center border-b border-border/40 transition-all duration-300 h-12 p-0"
        )}
      >
        <div className="flex items-center justify-center w-full h-full relative bg-slate-800 shadow-md">
          {!isCollapsed ? (
            <div className="relative transition-all duration-300 animate-in fade-in zoom-in-95 ">
              <Image src="/portal/logo.png" alt="logo" width={90} height={40} />
            </div>
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold text-sm shadow-sm transition-all duration-300 animate-in fade-in zoom-in-75">
              P
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent className={cn("py-4 space-y-6 transition-all", isCollapsed ? "px-1.5" : "px-3")}>
        {Object.entries(grouped)
          .filter(([group]) => group !== "NA")
          .map(([group, items]) => (
            <SidebarGroup key={group} className="p-0 space-y-1.5">
              {!isCollapsed ? (
                <p className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground/60 px-3 mb-1 select-none pointer-events-none transition-all animate-in fade-in duration-300">
                  {group}
                </p>
              ) : (
                <div className="mx-2 my-1 border-t border-border/30 first:hidden" />
              )}

              <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                  {renderMenu(items)}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter
        className={cn(
          "border-t border-border/40 bg-muted/20 space-y-2 transition-all duration-200",
          isCollapsed ? "p-1.5" : "p-3"
        )}
      >
        <SidebarMenu>
          {user && (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip={isCollapsed ? user.name : undefined}
                className={cn(
                  "h-11 rounded-lg transition-all w-full flex items-center gap-3",
                  isCollapsed ? "px-2 justify-center" : "px-3 hover:bg-muted/80"
                )}
              >
                <Link href="/profile" className="flex items-center w-full min-w-0">
                  {/* Styled User Avatar Box */}
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-medium text-xs border border-primary/20">
                    {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-3.5 h-3.5" />}
                  </div>

                  {!isCollapsed && (
                    <div className="flex flex-col items-start ml-0.5 min-w-0 leading-none gap-0.5">
                      <span className="truncate text-sm font-medium text-foreground capitalize">
                        {user.name}
                      </span>
                      {/* Added multi-field compatibility fallback if user data yields role/email strings */}
                      <span className="truncate text-[10.5px] text-muted-foreground/80 font-normal">
                        {user.email || "View profile"}
                      </span>
                    </div>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>

        <div className={cn("w-full transition-all", isCollapsed ? "px-0.5" : "px-1")}>
          <LogoutButton isCollapsed={isCollapsed} />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}