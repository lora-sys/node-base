interface PageProps {
    params : Promise <{
      executionsId : string;  
    }>
}
import { requireAuth } from "@/lib/auth-utils";

const Page = async ({params}:PageProps) => {
const {executionsId} = await params
 await requireAuth();   
    return (
        <p>
          cexecutions id : {executionsId} page 
        </p>
    )
}


export default Page;