interface PageProps {
    params : Promise <{
      credentialId : string;  
    }>
}
import { requireAuth } from "@/lib/auth-utils";

const Page = async ({params}:PageProps) => {
const {credentialId} = await params
await requireAuth();
    return (
        <p>
          cexecutions id : {credentialId} page 
        </p>
    )
}


export default Page;