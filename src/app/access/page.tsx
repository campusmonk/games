import AccessForm from "./form";

export const metadata = {
  title: "Game Access",
  description: "Enter an allowed email to access the cognitive games.",
};

export default async function AccessPage({
  searchParams,
}: PageProps<"/access">) {
  const params = await searchParams;
  const next = Array.isArray(params.next) ? params.next[0] : params.next;

  return (
    <main className="min-h-screen bg-background px-4 pb-20 pt-28 text-foreground sm:px-8 lg:px-12">
      <section className="mx-auto grid max-w-md gap-6">
        <div>
          <p className="font-game text-2xl leading-none text-primary">Access Required</p>
          <h1 className="mt-3 font-game text-5xl leading-none text-foreground drop-shadow-pop-md">
            Enter Email
          </h1>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Use an email that has been approved by the admin.
          </p>
        </div>

        <AccessForm next={next || "/moreGames"} />
      </section>
    </main>
  );
}
