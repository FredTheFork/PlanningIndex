import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-9xl font-bold text-[#1B3F7A] mb-4">404</h1>
        <h2 className="text-3xl font-bold text-[#1a1a2e] mb-4">
          Page Not Found
        </h2>
        <p className="text-[#5a5a7a] text-lg mb-8">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="bg-[#1B3F7A] text-white font-semibold rounded-lg hover:bg-[#2C68C4] transition-colors px-8 py-4"
          >
            Go Home
          </Link>
          <Link
            href="/whats-included"
            className="border-2 border-[#1B3F7A] text-[#1B3F7A] font-semibold rounded-lg hover:bg-[#F0F4FF] transition-colors px-8 py-4"
          >
            What&apos;s Included
          </Link>
        </div>
        <nav className="mt-12 flex flex-wrap justify-center gap-6 text-[#2C68C4]">
          <Link href="/pricing" className="hover:text-[#1B3F7A]">Pricing</Link>
          <Link href="/faq" className="hover:text-[#1B3F7A]">FAQs</Link>
          <Link href="/about" className="hover:text-[#1B3F7A]">About</Link>
          <Link href="/contact" className="hover:text-[#1B3F7A]">Contact</Link>
          <Link href="/blog" className="hover:text-[#1B3F7A]">Blog</Link>
        </nav>
      </div>
    </div>
  );
}
