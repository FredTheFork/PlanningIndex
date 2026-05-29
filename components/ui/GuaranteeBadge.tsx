import { ShieldCheck } from 'lucide-react';

export default function GuaranteeBadge({ size = 'default' }: { size?: 'small' | 'default' | 'large' }) {
  const sizes = {
    small: { padding: '12px 16px', iconSize: 16, titleSize: '0.85rem', textSize: '0.75rem' },
    default: { padding: '16px 20px', iconSize: 20, titleSize: '0.95rem', textSize: '0.85rem' },
    large: { padding: '20px 24px', iconSize: 24, titleSize: '1.05rem', textSize: '0.9rem' },
  };

  const s = sizes[size];

  return (
    <div
      className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg"
      style={{ padding: s.padding }}
    >
      <div className="flex items-start gap-3">
        <ShieldCheck size={s.iconSize} className="text-success shrink-0 mt-0.5" />
        <div>
          <div className="font-inter font-bold text-success" style={{ fontSize: s.titleSize }}>
            7-Day Satisfaction Guarantee
          </div>
          <div className="font-inter font-normal text-secondary-text mt-1" style={{ fontSize: s.textSize }}>
            Not happy? We'll make it right. If your documents don't accurately reflect your business, we'll revise them at no extra cost.
          </div>
        </div>
      </div>
    </div>
  );
}
