import { requireAuth } from "@/lib/auth-utils";
import { WorkflowClient } from "./workflow-client";
import { SignOutButton } from "./components/sign-out-button";

export default async function Page() {
  // Server-side authentication check
  await requireAuth();

  return (
    <>
      <WorkflowClient />
      <SignOutButton />
    </>
  );
}
