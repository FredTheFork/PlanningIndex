'use client';

import { Check } from 'lucide-react';

export interface AddOn {
  id: string;
  title: string;
  price: number;
  description: string;
  includes: string[];
}

interface AddOnSelectorProps {
  addOns: AddOn[];
  selectedAddOns: string[];
  onToggle: (addOnId: string) => void;
}

const availableAddOns: AddOn[] = [
  {
    id: 'website-copy',
    title: 'Website Copy Starter Pack',
    price: 49,
    description: 'Professional website copy written in your voice, ready to paste into any website builder.',
    includes: ['Homepage', 'About page', 'Services page', 'Contact page'],
  },
  {
    id: 'social-media',
    title: 'Social Media Starter Pack',
    price: 49,
    description: '30 done-for-you posts tailored to your industry, audience, and offer.',
    includes: ['Educational posts', 'Promotional posts', 'Personal / trust-building posts', 'Captions & hashtag suggestions'],
  },
  {
    id: 'quarterly-refresh',
    title: 'Quarterly Document Refresh',
    price: 29,
    description: 'Keep your documents accurate as your business evolves. First quarter included.',
    includes: ['One document update', 'Pricing changes', 'New services', 'GDPR updates if needed'],
  },
];

export { availableAddOns };

export default function AddOnSelector({ addOns, selectedAddOns, onToggle }: AddOnSelectorProps) {
  const totalAddOnPrice = selectedAddOns.reduce((sum, id) => {
    const addOn = addOns.find(a => a.id === id);
    return sum + (addOn?.price || 0);
  }, 0);

  return (
    <div className="space-y-4">
      <h3 className="font-inter font-semibold text-navy text-sm mb-4">
        Optional Add-ons
      </h3>

      {addOns.map((addOn) => {
        const isSelected = selectedAddOns.includes(addOn.id);
        return (
          <div
            key={addOn.id}
            onClick={() => onToggle(addOn.id)}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
              isSelected
                ? 'border-medium-blue bg-blue-50'
                : 'border-border bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start gap-3 flex-1">
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? 'bg-medium-blue' : 'border-2 border-gray-300 bg-white'
                  }`}
                >
                  {isSelected && <Check size={14} className="text-white" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-inter font-semibold text-dark-text" style={{ fontSize: '0.95rem' }}>
                      {addOn.title}
                    </h4>
                    <span className="font-inter font-bold text-navy" style={{ fontSize: '0.95rem' }}>
                      £{addOn.price}
                    </span>
                  </div>
                  <p className="font-inter text-secondary-text mt-1.5" style={{ fontSize: '0.85rem' }}>
                    {addOn.description}
                  </p>
                </div>
              </div>
            </div>

            {isSelected && (
              <div className="mt-3 pt-3 border-t border-border ml-8">
                <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                  {addOn.includes.map((item) => (
                    <span key={item} className="font-inter text-secondary-text" style={{ fontSize: '0.8rem' }}>
                      • {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {selectedAddOns.length > 0 && (
        <div className="bg-navy bg-opacity-5 border border-medium-blue rounded-lg p-4 mt-4">
          <div className="flex items-center justify-between">
            <span className="font-inter font-medium text-navy" style={{ fontSize: '0.9rem' }}>
              Add-ons Total
            </span>
            <span className="font-inter font-bold text-medium-blue" style={{ fontSize: '1.1rem' }}>
              +£{totalAddOnPrice}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
