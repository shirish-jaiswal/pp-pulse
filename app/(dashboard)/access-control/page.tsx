"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeatureListTabs } from "@/features/access-control/feature-list/feature-list-tab";
import { ProfileTabs } from "@/features/access-control/profile/profile-tab";
import { RolesTabs } from "@/features/access-control/roles/roles-tabs";

function RBAC() {
    return (
        <Tabs defaultValue="roles" className="w-full">
            <TabsList>
                <TabsTrigger value="roles">Roles</TabsTrigger>
                <TabsTrigger value="feature-list">Feature List</TabsTrigger>
                <TabsTrigger value="profiles">Profiles</TabsTrigger>
            </TabsList>

            <TabsContent value="roles">
                <RolesTabs />
            </TabsContent>

            <TabsContent value="feature-list">
                <FeatureListTabs />
            </TabsContent>

            <TabsContent value="profiles">
                <ProfileTabs />
            </TabsContent>
        </Tabs>
    );
}

export default RBAC;