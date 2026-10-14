import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { GalleryVerticalEnd, Loader2 } from "lucide-react";
import { LoginForm } from "~/components/login-form"

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authentication-token")?.value;
  if (token) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted/40 p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-medium group">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground transition-transform group-hover:scale-105">
            <GalleryVerticalEnd className="size-4" />
          </div>
          <span>ChaiCode Forms</span>
        </Link>
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 md:p-8">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-12 gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-5 animate-spin text-primary" />
                <span>Loading sign in...</span>
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
