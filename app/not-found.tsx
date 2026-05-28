import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="font-inter font-bold text-navy mb-4" style={{ fontSize: '4rem' }}>
          404
        </h1>
        <h2 className="font-inter font-semibold text-dark-text mb-3" style={{ fontSize: '1.5rem' }}>
          Page Not Found
        </h2>
        <p className="font-inter font-normal text-secondary-text mb-8" style={{ fontSize: '1rem' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block font-inter font-semibold text-white bg-navy rounded-lg hover:bg-medium-blue transition-colors duration-200"
          style={{ padding: '14px 28px', fontSize: '1rem' }}
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
