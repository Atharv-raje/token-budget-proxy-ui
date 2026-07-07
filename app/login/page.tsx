import { redirect } from "next/navigation";

import { isAuthed } from "@/lib/session";
import { LoginForm } from "@/components/login-form";

export default async function LoginPage() {
  if (await isAuthed()) {
    redirect("/");
  }
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <LoginForm />
    </main>
  );
}
