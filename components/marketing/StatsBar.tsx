interface Stat {
  value: string;
  label: string;
}

const stats: Stat[] = [
  { value: '100%', label: 'UK Councils Covered' },
  { value: '60%', label: 'Cheaper Than Competitors' },
  { value: '20%', label: 'Lower Competition' },
  { value: 'Daily', label: 'Data Updates' },
];

export function StatsBar() {
  return (
    <section className="bg-primary-900 px-6 py-12 border-t border-white/10">
      <div className="max-w-page mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display font-bold text-accent-400" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>
                {stat.value}
              </p>
              <p className="font-sans text-white/60 mt-1" style={{ fontSize: '0.85rem' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
