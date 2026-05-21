const stats = [
  { number: '4.2M', label: 'UK Sole Traders' },
  { number: '10', label: 'Documents Per Pack' },
  { number: '24hrs', label: 'Delivery Time' },
  { number: '£79', label: 'One-Time, No Subscription' },
];

export default function SocialProof() {
  return (
    <section className="bg-navy py-7">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-wrap justify-center gap-x-12 gap-y-6">
        {stats.map((stat, i) => (
          <div key={stat.label} className="flex items-center gap-12">
            <div className="text-center">
              <div className="font-inter font-bold text-white" style={{ fontSize: '1.75rem' }}>
                {stat.number}
              </div>
              <div
                className="font-inter font-normal"
                style={{
                  fontSize: '0.825rem',
                  color: 'rgba(255,255,255,0.7)',
                  letterSpacing: '0.05em',
                }}
              >
                {stat.label}
              </div>
            </div>
            {i < stats.length - 1 && (
              <div
                className="hidden sm:block h-12"
                style={{ width: 1, background: 'rgba(255,255,255,0.2)' }}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
