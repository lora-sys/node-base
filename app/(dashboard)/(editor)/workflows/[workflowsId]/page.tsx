import { requireAuth } from "@/lib/auth-utils";

interface PageProps {
    params : Promise <{
      workflowsId : string;  
    }>
}


const Page = async ({params}:PageProps) => {
    const {workflowsId} = await params
await requireAuth()
    return (
        <p>
          cexecutions id : {workflowsId} page 
        </p>
    )
}


export default Page;