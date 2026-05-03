"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { c_login } from "@/lib/api/auth/login/request-login";
import { c_requestUserCookie } from "@/lib/api/auth/user/request-user-cookie";
import { c_logout } from "@/lib/api/auth/logout/request-logout";
import Image from "next/image";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },

    onSubmit: async ({ value }) => {
      try {
        const res = await c_login({
          email: value.email,
          password: value.password,
        });

        if (!res?.success || !res?.authenticated) {
          toast.error("Login failed: Invalid credentials");
          return;
        }

        const userRes = await axios.get(
          "/portal/api/excel-db/rbac/tables/profile/rows",
          {
            params: { email: res.user.email },
          }
        );

        const user = userRes?.data?.data?.rows?.[0];

        if (!user) {
          toast.error("User profile not Created at PP Pulse");
          await c_logout();
          return;
        }

        await c_requestUserCookie({
          email: user.email,
          name: user.name,
          role: user.role,
          freshdesk: user.freshdesk,
        });

        toast.success("Welcome back!");
        router.push("/home");
        router.refresh();
      } catch (error: any) {
        toast.error(error.message || "Something went wrong. Please try again.");
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-sm border border-border/60 shadow-lg bg-background/80 backdrop-blur-sm">

        <CardHeader className="space-y-3 text-center align-center">

          <div className="flex items-center justify-center w-28 h-12 bg-slate-900 rounded-full">
            <Image
              src="/portal/logo.png"
              alt="logo"
              width={90}
              height={20}
              className="object-contain"
              priority
            />
          </div>

          <CardTitle className="text-2xl font-bold tracking-tight">
            Sign in
          </CardTitle>

          <CardDescription>
            Enter your email or username to access your account
          </CardDescription>
        </CardHeader>


        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            <form.Field
              name="email"
              validators={{
                onChange: ({ value }) =>
                  !value ? "Required" : undefined,
              }}
              children={(field) => (
                <div className="space-y-1.5">
                  <Label
                    htmlFor={field.name}
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Email or Username
                  </Label>

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />

                    <Input
                      id={field.name}
                      type="text"
                      placeholder="Enter email or username"
                      className={`pl-9 h-10 ${field.state.meta.errors.length
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                        }`}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(e.target.value)
                      }
                    />
                  </div>
                </div>
              )}
            />

            {/* PASSWORD FIELD */}
            <form.Field
              name="password"
              validators={{
                onChange: ({ value }) =>
                  !value ? "Required" : undefined,
              }}
              children={(field) => (
                <div className="space-y-1.5">
                  <Label
                    htmlFor={field.name}
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Password
                  </Label>

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />

                    <Input
                      id={field.name}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`pl-9 pr-10 h-10 ${field.state.meta.errors.length
                        ? "border-destructive"
                        : ""
                        }`}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(e.target.value)
                      }
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            />

            {/* SUBMIT */}
            <form.Subscribe
              selector={(state) => [
                state.canSubmit,
                state.isSubmitting,
              ]}
              children={([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  className="w-full h-10 font-semibold"
                  disabled={!canSubmit || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              )}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}