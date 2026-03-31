import Link from "next/link";
import { ChevronLeft, ShieldCheck, Scale, AlertCircle } from "lucide-react";

export default function TermsOfService() {
  const lastUpdated = "March 31, 2026";

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ChevronLeft size={16} />
          Back to Home
        </Link>

        <div className="space-y-6">
          <header className="border-b border-border pb-6">
            <h1 className="text-4xl font-extrabold tracking-tight">Terms of Service</h1>
            <p className="text-muted-foreground mt-2">Last Updated: {lastUpdated}</p>
          </header>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold">
              <ShieldCheck size={20} />
              <h2>1. Acceptance of Terms</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              By accessing the website of <strong>Sangam Kunwar</strong> (sangamkunwar.com.np), you agree to be bound by these terms. If you do not agree, please do not use this site.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold">
              <Scale size={20} />
              <h2>2. Use of Content</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              All projects, code snippets, and creative assets displayed on this portfolio are the intellectual property of Sangam Kunwar unless otherwise stated. You may view and interact with the content for informational purposes.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold">
              <AlertCircle size={20} />
              <h2>3. User Accounts & Broadcasts</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              When you register or provide your email for broadcasts, you agree to receive technical updates and project announcements. We reserve the right to terminate access to the dashboard for any user who violates site integrity.
            </p>
          </section>

          <div className="bg-muted p-6 rounded-xl border border-border">
            <h3 className="font-bold mb-2">Questions?</h3>
            <p className="text-sm text-muted-foreground">
              If you have any questions regarding these terms, please reach out via the 
              <Link href="/#contact" className="text-primary hover:underline ml-1">Contact Section</Link>.
            </p>
          </div>
        </div>

        <footer className="mt-12 text-center text-xs text-muted-foreground border-t border-border pt-8">
          &copy; {new Date().getFullYear()} Sangam Kunwar. All rights reserved. Tilottama, Nepal.
        </footer>
      </div>
    </div>
  );
}