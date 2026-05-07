import { Suspense } from "react";
import { UserManagementWrapper } from "@/features/user-management/components/user-management-wrapper";

export default function Page() {
    return (
        <Suspense fallback={null}>
            <UserManagementWrapper />
        </Suspense>
    );
}
