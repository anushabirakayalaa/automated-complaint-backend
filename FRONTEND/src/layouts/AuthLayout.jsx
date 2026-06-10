import { ShieldCheck } from "lucide-react";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <main className="min-h-screen bg-banking-light">
      <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
        <section className="hidden bg-banking-navy p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-white/10 p-2">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div>
              <p className="text-lg font-bold">Automated Complaint Escalation</p>
              <p className="text-sm text-blue-100">Banking System</p>
            </div>
          </div>

          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-200">Enterprise complaint management</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight">Track, escalate, and resolve banking complaints with clarity.</h1>
            <p className="mt-5 text-base leading-7 text-blue-100">
              Streamline your complaint resolution process with our intuitive platform designed for modern banking operations.
            </p>
          </div>

          <p className="text-sm text-blue-200">Manage and resolve banking complaints efficiently.</p>
        </section>

        <section className="flex items-center justify-center p-5">
          <Outlet />
        </section>
      </div>
    </main>
  );
}
