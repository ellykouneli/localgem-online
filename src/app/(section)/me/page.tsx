import PageHeader from "@/components/PageHeader";

export default function LoginPage() {
  return (
    <>
      <PageHeader title="Sign in / Join (€3.99 once)" />
      <div className="rounded-xl border p-6 max-w-md">
        <button className="w-full rounded-lg bg-emerald-600 text-white py-2 font-semibold">
          Continue with Google
        </button>
        <div className="my-4 h-px bg-gray-200" />
        <form className="space-y-3">
          <input className="w-full rounded-lg border p-2" placeholder="Email" />
          <input className="w-full rounded-lg border p-2" placeholder="Password" type="password" />
          <button className="w-full rounded-lg border border-emerald-600 text-emerald-700 py-2 font-semibold">
            Create account (€3.99)
          </button>
        </form>
      </div>
    </>
  );
}