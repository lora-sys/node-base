import { requireAuth } from "@/lib/auth-utils";

interface PageProps {
    params : Promise <{
      credentialsId : string;
    }>
}

const Page = async ({params}:PageProps) => {
    await requireAuth();
    const {credentialsId} = await params;
    return (
        <p>
          credentials id : {credentialsId} page
        </p>
    )
}


export default Page;