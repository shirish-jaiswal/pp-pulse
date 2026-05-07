"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/utils/cn";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { c_logout } from "@/lib/api/auth/logout/request-logout";

export default function LogoutButton({
  isCollapsed,
}: {
  isCollapsed: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await c_logout();
      router.push("/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger
        className={cn(
          "w-full h-8 px-2 text-sm flex items-center gap-2 rounded-md",
          "hover:bg-red-500/10 text-red-500",
          isCollapsed && "justify-center px-0"
        )}
      >
        <LogOut className="w-4 h-4" />
        {!isCollapsed && <span>Logout</span>}
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to logout?
          </AlertDialogTitle>
          <AlertDialogDescription>
            You will be signed out and redirected to login.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleLogout}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600"
          >
            {loading ? "Logging out..." : "Logout"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}