"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

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
import { c_getUser } from "@/lib/api/auth/user/me";

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
          password: value.password
        });

        if (res?.success && res?.authenticated) {
          toast.success("Welcome back!");
          localStorage.setItem("user", JSON.stringify(res.user));
          await c_requestUserCookie(res.user);
         const user = await c_getUser();
         console.log(user)
          router.push("/home");
          router.refresh();
        } else {
          toast.error("Login failed: Invalid email or password");
        }
      } catch (error: any) {
        toast.error(error.message || "Something went wrong. Please try again.");
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-sm border border-border/60 shadow-lg bg-background/80 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Sign in</CardTitle>
          <CardDescription>Enter your email to access your account</CardDescription>
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
            {/* EMAIL FIELD */}
            <form.Field
              name="email"
              validators={{
                onChange: ({ value }) =>
                  !value ? "Required" : !/^\S+@\S+\.\S+$/.test(value) ? "Invalid email" : undefined
              }}
              children={(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor={field.name} className="text-xs font-medium text-muted-foreground">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                    <Input
                      id={field.name}
                      type="email"
                      placeholder="you@example.com"
                      className={`pl-9 h-10 ${field.state.meta.errors.length ? "border-destructive focus-visible:ring-destructive" : ""}`}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </div>
                </div>
              )}
            />

            {/* PASSWORD FIELD */}
            <form.Field
              name="password"
              validators={{
                onChange: ({ value }) => !value ? "Required" : undefined
              }}
              children={(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor={field.name} className="text-xs font-medium text-muted-foreground">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                    <Input
                      id={field.name}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`pl-9 pr-10 h-10 ${field.state.meta.errors.length ? "border-destructive" : ""}`}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}
            />

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
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