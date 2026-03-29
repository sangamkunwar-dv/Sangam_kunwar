// app/privacy/page.tsx
import React from 'react';

export const metadata = {
  title: 'Privacy Policy | YourBrand',
  description: 'Learn how we collect, use, and protect your personal data.',
};

export default function PrivacyPolicy() {
  const lastUpdated = "March 29, 2026";

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-sm border border-gray-200 rounded-2xl p-8 md:p-12">
        
        {/* Header */}
        <header className="border-b border-gray-100 pb-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Privacy Policy</h1>
          <p className="mt-4 text-gray-500">
            Last Updated: <span className="font-medium text-gray-700">{lastUpdated}</span>
          </p>
        </header>

        {/* Executive Summary Box */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-10 rounded-r-lg">
          <h2 className="text-blue-800 font-semibold mb-2">TL;DR / Summary</h2>
          <p className="text-blue-700 text-sm leading-relaxed">
            We value your privacy. We collect minimal data to provide our service, we never sell your info, 
            and you have full control over your data at any time.
          </p>
        </div>

        {/* Table of Contents */}
        <nav className="mb-10">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Contents</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-blue-600 text-sm">
            <li><a href="#collection" className="hover:underline underline-offset-4">1. Information Collection</a></li>
            <li><a href="#usage" className="hover:underline underline-offset-4">2. How We Use Data</a></li>
            <li><a href="#cookies" className="hover:underline underline-offset-4">3. Cookie Policy</a></li>
            <li><a href="#rights" className="hover:underline underline-offset-4">4. Your Legal Rights</a></li>
            <li><a href="#contact" className="hover:underline underline-offset-4">5. Contact Support</a></li>
          </ul>
        </nav>

        {/* Main Content */}
        <div className="prose prose-blue max-w-none text-gray-600 leading-7 space-y-8">
          
          <section id="collection">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Information We Collect</h2>
            <p>
              When you use our Next.js application, we may collect information that you voluntarily provide 
              (such as your name and email when signing up) and technical data (such as browser type and IP address) 
              collected via our hosting provider, <strong>Vercel</strong>.
            </p>
          </section>

          <section id="usage">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. How We Use Data</h2>
            <p>Your data allows us to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Authenticate your account via NextAuth.js or Clerk.</li>
              <li>Provide personalized content and features.</li>
              <li>Monitor site performance and fix bugs.</li>
            </ul>
          </section>

          <section id="cookies">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Cookie Policy</h2>
            <p>
              We use essential cookies to maintain your session. We also use 
              <strong> Google Analytics</strong> to understand user behavior. You can disable cookies in your browser settings, 
              though some features of this site may stop functioning.
            </p>
          </section>

          <section id="rights" className="pt-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Your Legal Rights</h2>
            <p>
              Under the GDPR (General Data Protection Regulation) and CCPA, you have the right to access, 
              rectify, or erase your personal data. To exercise these rights, please email our privacy team.
            </p>
          </section>

          <section id="contact" className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-2">5. Contact Us</h2>
            <p className="text-sm">
              If you have questions about this policy, please reach out:
            </p>
            <div className="mt-4 text-sm font-medium">
              <p>Email: privacy@yourdomain.com</p>
              <p>Location: San Francisco, CA</p>
            </div>
          </section>
        </div>

        <footer className="mt-12 pt-8 border-t border-gray-100 text-center text-gray-400 text-xs">
          &copy; {new Date().getFullYear()} Your Brand Name. All rights reserved.
        </footer>
      </div>
    </div>
  );
}