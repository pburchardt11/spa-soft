import { listBranches } from "@/lib/actions/branches";
import BranchesClient from "./branches-client";

export default async function BranchesPage() {
  const branches = await listBranches();
  return <BranchesClient initialBranches={branches} />;
}
