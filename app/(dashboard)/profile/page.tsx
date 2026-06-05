"use client";

import { useEffect, useState } from "react";

import { useProfile } from "@/context/use-profile";
import { useFindProfile } from "@/features/access-control/hooks/profile/use-find-profile";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import { useProfileForm } from "@/features/profile/hooks/use-profile-form";
import ProfileHeader from "@/features/profile/components/profile-header";
import SettingsSection from "@/features/profile/components/settings-section";
import TimeZone from "@/components/custom/time-zone";

export default function ProfilePage() {
  const { user } = useProfile();
  const { data, isLoading, isError } = useFindProfile({
    email: user?.email as string,
  });

  const profile = data?.[0];

  const form = useProfileForm(profile);

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (isError) return <div className="p-6 text-red-500">Error</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <ProfileHeader
        isEditing={form.isEditing}
        setIsEditing={form.setIsEditing}
        onSave={form.handleSave}
        onCancel={form.handleCancel}
        isPending={form.isPending}
        hasChanges={form.hasChanges}
      />

      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* NAME */}
          <div>
            <div className="text-sm text-muted-foreground">Name</div>
            {form.isEditing ? (
              <Input
                value={form.name}
                onChange={(e) => form.setName(e.target.value)}
              />
            ) : (
              <div className="font-medium">{profile?.name}</div>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <div className="text-sm text-muted-foreground">Email</div>
            <div>{profile?.email}</div>
          </div>

          {/* ROLE */}
          <div>
            <div className="text-sm text-muted-foreground">Role</div>
            <Badge>{profile?.role}</Badge>
          </div>

          {/* DEFAULT TIMEZONE REGION */}
          <div>
            <div className="text-sm text-muted-foreground mb-1.5">Default Time Display Country</div>
            {form.isEditing ? (
              <TimeZone
                defaultCountryName={form.localSettings?.defaultCountry || profile?.settings?.defaultCountry}
                onCountrySelect={(countryName) => 
                  form.updateSettings({ ...form.localSettings, defaultCountry: countryName })
                } 
              />
            ) : (
              <div className="font-medium text-sm">
                {form.localSettings?.defaultCountry || profile?.settings?.defaultCountry || "Not Configured"}
              </div>
            )}
          </div>

          {/* FRESHDESK */}
          <div>
            <div className="text-sm text-muted-foreground">Freshdesk</div>

            {form.isEditing ? (
              <div className="space-y-2">
                <Input
                  placeholder="Enter your Freshdesk API Key"
                  value={form.freshdesk}
                  onChange={(e) => form.setFreshdesk(e.target.value)}
                />

                <div className="text-xs text-muted-foreground leading-relaxed">
                  How to get your API Key:
                  <br />
                  1. Login to your Freshdesk account
                  <br />
                  2. Go to <span className="font-medium">Profile Settings</span>
                  <br />
                  3. Scroll to <span className="font-medium">API Key</span>
                  <br />
                  4. Copy and paste it here
                </div>
              </div>
            ) : (
              <div className="font-medium">
                {form.freshdesk || profile?.freshdesk ? "••••••••••••" : "-"}
              </div>
            )}
          </div>

          {/* SETTINGS */}
          <SettingsSection
            isEditing={form.isEditing}
            settings={form.localSettings}
            onChange={form.updateSettings}
          />
        </CardContent>
      </Card>
    </div>
  );
}