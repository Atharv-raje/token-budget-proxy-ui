import { redirect } from "next/navigation";

import { isAuthed } from "@/lib/session";
import { Dashboard } from "@/components/dashboard";

export default async function Home() {
  if (!(await isAuthed())) {
    redirect("/login");
  }
  return <Dashboard />;
}
