import Link from "next/link";
import { ArrowLeft, FileText, scale } from "lucide-react";

export default function TermsPage() {
  const currentYear = new Date().getFullYear();
  const lastUpdated = "March 30, 2026";

  return (
    <div className="min-h-screen bg-gray-950 text-gray-300 selection:bg-blue-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 py-20">
        {/* Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Portfolio
        </Link>

        {/* Header */}
        <header className="mb-16">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 mb-6 border border-blue-500/20">
            <FileText size={24} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-gray-500 text-sm">
            Last updated: {lastUpdated} • © {currentYear} Sangam Kunwar
          </p>
        </header>

        {/* Content Card */}
        <div className="prose prose-invert prose-blue max-w-none bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
          
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              1. Acceptance of Terms
            </h2>
            <p className="leading-relaxed">
              By accessing and using <strong>sangamkunwar.com.np</strong>, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">
              2. Intellectual Property
            </h2>
            <p className="leading-relaxed">
              The code, design, and content on this portfolio are the intellectual property of Sangam Kunwar. You may view and use the code for educational purposes, but commercial reproduction is strictly prohibited without consent.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">
              3. User Conduct
            </h2>
            <p className="leading-relaxed">
              Users are prohibited from attempting to breach the security of the admin dashboard or using the contact forms for spamming purposes.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">
              4. Cookies & Analysis
            </h2>
            <p className="leading-relaxed">
              We use cookies to improve user experience. By using this site, you acknowledge our use of Vercel Analytics to track site traffic based on your cookie consent preferences.
            </p>
          </section>

          <div className="pt-10 border-t border-white/5 mt-10 text-center">
            <p className="text-sm text-gray-500">
              Questions about these terms? Reach out via the <Link href="/#contact" className="text-blue-400 hover:underline">Contact Form</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}