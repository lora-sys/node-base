import { requireAuth } from "@/lib/auth-utils";
import { WorkflowClient } from "./workflow-client";
import { SignOutButton } from "./components/sign-out-button";
import { AiTestClient } from "./aiTest-Client";

export default async function Page() {
  // Server-side authentication check
  await requireAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">NodeBase Dashboard</h1>
          <SignOutButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Workflow Section */}
        <section>
          <WorkflowClient />
        </section>

        {/* AI Test Section */}
        <section>
          <AiTestClient />
        </section>
      </main>
    </div>
  );
}
