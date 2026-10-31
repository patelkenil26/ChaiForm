import type { Metadata } from "next";
import { getPublicFormMetadata } from "~/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ form_id: string }>;
}): Promise<Metadata> {
  const { form_id } = await params;
  return getPublicFormMetadata(
    "Interactive Form",
    "Complete this conversational form on ChaiForm. Fluid 1-question-at-a-time experience.",
    form_id,
  );
}

export default function FormRunnerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
