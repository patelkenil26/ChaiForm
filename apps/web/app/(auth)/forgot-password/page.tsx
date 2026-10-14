import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { IconForms } from "@tabler/icons-react";

import { ForgotPasswordForm } from "~/components/forgot-password-form";

export const metadata = {
  title: "Forgot Password • ChaiForm",
  description: "Recover your ChaiForm account password",
};

export default async function ForgotPasswordPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authentication-token")?.value;
  if (token) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted/40 p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col gap-6">
        <Link href="/" className="flex items-center gap-2.5 self-center group">
          <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-primary to-purple-600 text-white shadow-md shadow-primary/20 transition-transform duration-200 group-hover:scale-105">
            <IconForms className="size-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">ChaiForm</span>
        </Link>
        <div className="rounded-xl border border-border/80 bg-card text-card-foreground shadow-sm p-6 md:p-8">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}
