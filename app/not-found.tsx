import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0b1622] text-white flex flex-col items-center justify-center overflow-hidden p-4">
      {/* Sliding 404 header */}
      <div className="w-full overflow-hidden mb-12 relative">
        <div className="flex animate-slide whitespace-nowrap text-7xl md:text-9xl font-black uppercase tracking-tighter italic">
          {/* First Group */}
          <span className="mx-4 text-gray-700">Page</span>
          <span className="mx-4 bg-gradient-to-r from-cyan-400 to-teal-400 text-transparent bg-clip-text">404</span>
          <span className="mx-4 text-white">Missing</span>
          {/* Second Group (Needed for the loop) */}
          <span className="mx-4 text-gray-700">Page</span>
          <span className="mx-4 bg-gradient-to-r from-cyan-400 to-teal-400 text-transparent bg-clip-text">404</span>
          <span className="mx-4 text-white">Missing</span>
        </div>
      </div>

      {/* Description */}
      <div className="text-center z-10">
        <h2 className="text-2xl font-bold mb-2">Lost in Space?</h2>
        <p className="text-gray-400 max-w-md mb-10 leading-relaxed">
          The page you are looking for doesn't exist or has been moved to another coordinate.
        </p>

        {/* Links */}
        <div className="flex gap-6 flex-wrap justify-center">
          <Link
            href="/"
            className="px-8 py-3 rounded-xl bg-cyan-500 text-black font-bold hover:bg-cyan-400 hover:-translate-y-1 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          >
            Go Home
          </Link>

          <Link
            href="/docs"
            className="px-8 py-3 rounded-xl border border-gray-600 text-gray-300 font-semibold hover:border-cyan-400 hover:text-cyan-400 transition-all"
          >
            Check Docs
          </Link>
        </div>
      </div>
    </div>
  );
}