import Link from 'next/link';

export default function CTABanner() {
  return (
    <section
      className="py-20 px-6"
      style={{ background: 'linear-gradient(135deg, #1B3F7A 0%, #2C68C4 100%)' }}
    >
      <div className="max-w-[700px] mx-auto text-center">
        <h2
          className="font-inter font-bold text-white leading-[1.25]"
          style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)' }}
        >
          Your business, properly founded. One service or all four.
        </h2>
        <p
          className="font-inter font-normal leading-[1.7] mt-4"
          style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)' }}
        >
          Documents, website copy, social media, and ongoing support. Bundle and save.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
          <Link
            href="/services"
            className="inline-block font-inter font-bold text-navy bg-white rounded-lg hover:bg-[rgba(255,255,255,0.92)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all duration-200"
            style={{ padding: '16px 40px', fontSize: '1rem', minHeight: 48 }}
          >
            See All Services
          </Link>
          <Link
            href="/checkout"
            className="inline-block font-inter font-bold text-white border-2 border-white rounded-lg hover:bg-white/10 transition-all duration-200"
            style={{ padding: '14px 40px', fontSize: '1rem', minHeight: 48 }}
          >
            Start with Documents — £79
          </Link>
        </div>
      </div>
    </section>
  );
}
