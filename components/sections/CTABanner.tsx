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
          Ready to set up your business properly?
        </h2>
        <p
          className="font-inter font-normal leading-[1.7] mt-4"
          style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)' }}
        >
          Join the sole traders who stopped operating on a wing and a prayer and started running their business from a proper foundation.
        </p>
        <a
          href="#" // TODO: Link to checkout
          className="inline-block font-inter font-bold text-navy bg-white rounded-lg hover:bg-[rgba(255,255,255,0.92)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all duration-200 mt-10"
          style={{ padding: '18px 40px', fontSize: '1.05rem', minHeight: 48 }}
        >
          Get My Pack — £79
        </a>
        <p
          className="font-inter font-normal mt-4"
          style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}
        >
          10 documents. 24 hours. No subscription.
        </p>
      </div>
    </section>
  );
}
