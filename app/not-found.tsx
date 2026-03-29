import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0b1622] text-white flex flex-col items-center justify-center overflow-hidden p-4">
      {/* Sliding 404 header */}
      <div className="w-full overflow-hidden mb-10">
        <div className="flex animate-slide whitespace-nowrap text-6xl md:text-8xl font-extrabold opacity-90">
          <span className="mx-8 text-gray-400">Page</span>
          <span className="mx-8 bg-gradient-to-r from-cyan-400 to-teal-400 text-transparent bg-clip-text">404</span>
          <span className="mx-8 text-gray-200">Missing Page</span>
          <span className="mx-8 bg-gradient-to-r from-cyan-400 to-teal-400 text-transparent bg-clip-text">404</span>
          <span className="mx-8 text-gray-400">Page</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-300 text-center max-w-xl mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>

      {/* Links */}
      <div className="flex gap-4 flex-wrap justify-center">
        <Link
          href="/"
          className="px-6 py-3 rounded-full bg-cyan-400 text-black font-semibold hover:scale-105 transition"
        >
          Go to home page
        </Link>

        <Link
          href="/docs"
          className="px-6 py-3 rounded-full border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition"
        >
          Check the docs
        </Link>
      </div>
    </div>
  );
}