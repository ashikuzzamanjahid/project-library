import { AdminLogin } from "./login-form";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ return_to?: string }>;
}) {
  const params = await searchParams;
  const returnTo =
    params.return_to?.startsWith("/") && !params.return_to.startsWith("//")
      ? params.return_to
      : "/admin";
  return <AdminLogin returnTo={returnTo} />;
}
