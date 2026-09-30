export default function ApiDown({ error }) {
  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="max-w-md text-center">
        <p className="eyebrow justify-center">Offline for a moment</p>
        <h1 className="mt-4 text-4xl">The site can&apos;t load its content right now.</h1>
        <p className="mt-4 text-muted">Please refresh in a minute.</p>
        {process.env.NODE_ENV !== "production" ? (
          <p className="mt-6 rounded-xl bg-accent-soft p-4 text-left text-sm text-ink/80">
            Dev hint: {error?.message}. Is the API running at NEXT_PUBLIC_API_URL?
          </p>
        ) : null}
      </div>
    </main>
  );
}
