import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";
import { SignOutButton } from "./components/sign-out-button";

const Page = async () => {
  await requireAuth();
  const data = await caller.getUsers();
  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Protected Server Components</h1>
        <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
      <SignOutButton />
    </div>
  );
};

export default Page