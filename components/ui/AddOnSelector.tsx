'use client';

import { Check } from 'lucide-react';
import {
  serviceCatalog,
  getServiceById,
  getOptionalServices,
  calculateBundleDiscount,
  type ServiceCatalogEntry,
} from '@/lib/services/service-catalog';

// ── Backward-compatible exports ──
// Other components (e.g. Pricing) may still import these.

export interface AddOn {
  id: string;
  title: string;
  price: number;
  description: string;
  includes: string[];
}

const availableAddOns: AddOn[] = getOptionalServices().map((service) => ({
  id: service.id,
  title: service.name,
  price: service.price,
  description: service.description,
  includes: service.includes,
}));

export { availableAddOns };

// ── Service Selector Component ──

interface ServiceSelectorProps {
  /** Service IDs that are already selected (e.g. pre-selected core pack). */
  selectedServiceIds: string[];
  /** Called when a service is toggled on/off. */
  onToggle: (serviceId: string) => void;
  /** If true, the core service cannot be deselected. */
  coreRequired?: boolean;
  /** If provided, only show these service IDs. Otherwise show all optional services. */
  onlyShowIds?: string[];
  /** Heading text above the selector. */
  heading?: string;
}

export default function ServiceSelector({
  selectedServiceIds,
  onToggle,
  coreRequired = false,
  onlyShowIds,
  heading = 'Enhance your order',
}: ServiceSelectorProps) {
  const optionalServices = getOptionalServices();
  const servicesToShow = onlyShowIds
    ? optionalServices.filter((s) => onlyShowIds.includes(s.id))
    : optionalServices;

  const selectedOptional = selectedServiceIds.filter(
    (id) => !getServiceById(id)?.isCore
  );

  const optionalTotal = selectedOptional.reduce((sum, id) => {
    const s = getServiceById(id);
    return sum + (s?.price ?? 0);
  }, 0);

  const discount = calculateBundleDiscount(selectedServiceIds);

  return (
    <div className="space-y-4">
      <h3 className="font-inter font-semibold text-navy text-sm mb-4">
        {heading}
      </h3>

      {servicesToShow.map((service) => {
        const isSelected = selectedServiceIds.includes(service.id);
        return (
          <div
            key={service.id}
            onClick={() => onToggle(service.id)}
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
                      {service.name}
                    </h4>
                    <span className="font-inter font-bold text-navy" style={{ fontSize: '0.95rem' }}>
                      {service.priceLabel}
                    </span>
                  </div>
                  <p className="font-inter text-secondary-text mt-1.5" style={{ fontSize: '0.85rem' }}>
                    {service.description}
                  </p>
                </div>
              </div>
            </div>

            {isSelected && (
              <div className="mt-3 pt-3 border-t border-border ml-8">
                <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                  {service.includes.map((item) => (
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

      {selectedOptional.length > 0 && (
        <div className="bg-navy bg-opacity-5 border border-medium-blue rounded-lg p-4 mt-4">
          <div className="flex items-center justify-between">
            <span className="font-inter font-medium text-navy" style={{ fontSize: '0.9rem' }}>
              Additional Services
            </span>
            <span className="font-inter font-bold text-medium-blue" style={{ fontSize: '1.1rem' }}>
              +£{optionalTotal.toFixed(2)}
            </span>
          </div>
          {discount > 0 && (
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-blue-200">
              <span className="font-inter font-medium text-green-700" style={{ fontSize: '0.85rem' }}>
                Bundle discount
              </span>
              <span className="font-inter font-bold text-green-700" style={{ fontSize: '0.95rem' }}>
                -£{discount.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Legacy wrapper for backward compatibility ──
// Existing code that imports AddOnSelector with addOns/selectedAddOns/onToggle props
// can use this wrapper.

interface LegacyAddOnSelectorProps {
  addOns: AddOn[];
  selectedAddOns: string[];
  onToggle: (addOnId: string) => void;
}

export function AddOnSelectorLegacy({ addOns, selectedAddOns, onToggle }: LegacyAddOnSelectorProps) {
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
