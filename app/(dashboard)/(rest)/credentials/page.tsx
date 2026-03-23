import { requireAuth } from "@/lib/auth-utils";

const Page =  async () => {
await requireAuth();
    return (
        <p>
          cexecutions page 
        </p>
    )
}


export default Page;