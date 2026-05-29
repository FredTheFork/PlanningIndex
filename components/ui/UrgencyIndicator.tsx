import { Clock, TrendingUp } from 'lucide-react';

export default function UrgencyIndicator() {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <Clock size={18} className="text-amber-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="font-inter font-semibold text-amber-900" style={{ fontSize: '0.9rem' }}>
            Current Price: £79
          </div>
          <div className="font-inter text-amber-700 mt-1" style={{ fontSize: '0.85rem' }}>
            Price may increase as we grow. Lock in this price now.
          </div>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-amber-200 flex items-start gap-3">
        <TrendingUp size={18} className="text-amber-600 shrink-0 mt-0.5" />
        <div className="font-inter text-amber-700" style={{ fontSize: '0.85rem' }}>
          <strong>Delivery:</strong> Usually within 24 hours of completing your questionnaire
        </div>
      </div>
    </div>
  );
}
