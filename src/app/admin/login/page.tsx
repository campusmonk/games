import AdminLoginForm from "./form";

export const metadata = {
  title: "Admin Login",
  description: "Admin access for the cognitive games allowlist.",
};

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-background px-4 pb-20 pt-28 text-foreground sm:px-8 lg:px-12">
      <section className="mx-auto grid max-w-md gap-6">
        <div>
          <p className="font-game text-2xl leading-none text-primary">Admin</p>
          <h1 className="mt-3 font-game text-5xl leading-none text-foreground drop-shadow-[4px_4px_0_color-mix(in_oklch,var(--background),var(--foreground)_12%)]">
            Panel Login
          </h1>
        </div>

        <AdminLoginForm />
      </section>
    </main>
  );
}
