import { requireAuth } from "@/lib/auth-utils";

interface PageProps {
    params : Promise <{
      workflowsId : string;
    }>
}


const Page = async ({params}:PageProps) => {
    await requireAuth();
    const {workflowsId} = await params;
    return (
        <p>
          executions id : {workflowsId} page
        </p>
    )
}


export default Page;