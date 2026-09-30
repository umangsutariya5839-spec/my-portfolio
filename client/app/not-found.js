import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="text-center">
        <p className="font-display text-8xl font-semibold italic text-accent/40">404</p>
        <h1 className="mt-2 text-3xl">This page doesn&apos;t exist.</h1>
        <Link href="/" className="btn-primary mt-8">
          Back to home
        </Link>
      </div>
    </main>
  );
}
