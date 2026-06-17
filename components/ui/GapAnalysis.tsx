'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Shield, CheckCircle, XCircle, ChevronDown, ChevronUp, HelpCircle, FileText, Scale } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

// Gap Analysis - Interactive Risk Assessment
interface RiskItem {
  id: string;
  category: string;
  question: string;
  hasRisk: boolean | null;
  risk: string;
  solution: string;
  tier: 'foundation' | 'operations' | 'industry';
  icon?: React.ReactNode;
}

interface GapAnalysisProps {
  className?: string;
}

export function GapAnalysis({ className = '' }: GapAnalysisProps) {
  const [ref, inView] = useInView(0.2);
  const [expanded, setExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [currentStep, setCurrentStep] = useState(0);

  const categories = [
    {
      id: 'contracts',
      name: 'Client Contracts',
      icon: <FileText size={18} />,
      color: '#1B3F7A',
      items: [
        {
          id: 'has_contract',
          question: 'Do you have a signed contract for every client?',
          risk: 'Without a signed contract, you have no legal protection against scope disputes, payment issues, or cancellation disputes.',
          solution: 'Client Contract in Business Foundations Pack',
          tier: 'foundation' as const,
        },
        {
          id: 'scope_documented',
          question: 'Is your scope of work clearly documented and agreed before starting?',
          risk: 'Unclear scope leads to scope creep, unpaid work, and client conflicts.',
          solution: 'Scope of Work Template in Operations Pack',
          tier: 'operations' as const,
        },
      ],
    },
    {
      id: 'payments',
      name: 'Payment Protection',
      icon: <Scale size={18} />,
      color: '#2C68C4',
      items: [
        {
          id: 'invoice_terms',
          question: 'Do your invoices include full legal terms and late payment penalties?',
          risk: 'Invoices without proper terms have no legal weight for enforcement.',
          solution: 'Invoice Terms & Conditions in Payment Protection Pack',
          tier: 'operations' as const,
        },
        {
          id: 'late_payment',
          question: 'Do you have a formal late payment chasing process?',
          risk: 'Ad-hoc chasing is inconsistent and often ineffective.',
          solution: 'Late Payment Scripts in Payment Protection Pack',
          tier: 'operations' as const,
        },
      ],
    },
    {
      id: 'compliance',
      name: 'Legal Compliance',
      icon: <Shield size={18} />,
      color: '#38A169',
      items: [
        {
          id: 'privacy_policy',
          question: 'Do you have a GDPR-compliant privacy policy displayed?',
          risk: 'Missing or non-compliant privacy policy risks ICO fines.',
          solution: 'GDPR Privacy Policy in Business Foundations Pack',
          tier: 'foundation' as const,
        },
        {
          id: 'data_handling',
          question: 'Do you have documented data retention and breach procedures?',
          risk: 'Inadequate data procedures violate GDPR requirements.',
          solution: 'GDPR Deep Pack',
          tier: 'operations' as const,
        },
      ],
    },
  ];

  const toggleCategory = (categoryId: string) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId);
  };

  const handleAnswer = (itemId: string, hasRisk: boolean) => {
    setAnswers(prev => ({
      ...prev,
      [itemId]: hasRisk,
    }));
  };

  // Calculate risk score
  const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0);
  const answeredItems = Object.keys(answers).length;
  const riskItems = Object.values(answers).filter(v => v === true).length;
  const riskScore = Math.round((riskItems / Math.max(answeredItems, 1)) * 100);

  const getRiskLevel = () => {
    if (riskScore >= 70) return { level: 'High', color: '#DC2626', bg: '#FEE2E2' };
    if (riskScore >= 40) return { level: 'Medium', color: '#F59E0B', bg: '#FEF3C7' };
    return { level: 'Low', color: '#38A169', bg: '#D1FAE5' };
  };

  const currentRisk = getRiskLevel();

  return (
    <div ref={ref} className={`bg-white rounded-2xl border border-slate-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle size={20} className="text-amber-500" />
              <h3 className="font-inter font-bold text-navy text-lg">Business Risk Assessment</h3>
            </div>
            <p className="font-inter text-secondary-text text-sm">
              Answer a few questions to discover potential gaps in your business protection
            </p>
          </div>
          {answeredItems > 0 && (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ background: currentRisk.bg }}
            >
              <div className="w-3 h-3 rounded-full" style={{ background: currentRisk.color }} />
              <span className="font-inter font-semibold text-sm" style={{ color: currentRisk.color }}>
                {currentRisk.level} Risk
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Risk Score Visual */}
      <div className="px-6 py-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <span className="font-inter text-secondary-text text-sm">Your protection score</span>
          <span className="font-inter font-bold text-navy text-lg">
            {100 - (answeredItems > 0 ? riskScore : 0)}%
          </span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${100 - (answeredItems > 0 ? riskScore : 0)}%`,
              background: answeredItems > 0
                ? riskScore > 50 ? '#DC2626' : riskScore > 25 ? '#F59E0B' : '#38A169'
                : '#E2E8F0',
            }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="font-inter text-xs text-slate-400">Protected</span>
          <span className="font-inter text-xs text-slate-400">Exposed</span>
        </div>
      </div>

      {/* Categories */}
      <div className="p-6">
        <div className="space-y-4">
          {categories.map((category, categoryIndex) => (
            <div
              key={category.id}
              className="border border-slate-200 rounded-xl overflow-hidden"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.4s ease ${categoryIndex * 100}ms, transform 0.4s ease ${categoryIndex * 100}ms`,
              }}
            >
              {/* Category header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: `${category.color}15`, color: category.color }}
                  >
                    {category.icon}
                  </div>
                  <div>
                    <span className="font-inter font-semibold text-dark-text text-sm block">
                      {category.name}
                    </span>
                    <span className="font-inter text-secondary-text text-xs">
                      {category.items.length} questions
                    </span>
                  </div>
                </div>
                {activeCategory === category.id ? (
                  <ChevronUp size={18} className="text-slate-400" />
                ) : (
                  <ChevronDown size={18} className="text-slate-400" />
                )}
              </button>

              {/* Category items */}
              {activeCategory === category.id && (
                <div className="border-t border-slate-200 p-4 space-y-4">
                  {category.items.map((item, itemIndex) => (
                    <div
                      key={item.id}
                      className="bg-slate-50 rounded-lg p-4"
                      style={{
                        animation: 'fadeInUp 0.3s ease forwards',
                        animationDelay: `${itemIndex * 50}ms`,
                      }}
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-start gap-2">
                          <HelpCircle size={16} className="text-slate-400 shrink-0 mt-0.5" />
                          <span className="font-inter font-medium text-dark-text text-sm">
                            {item.question}
                          </span>
                        </div>
                      </div>

                      {/* Answer buttons */}
                      <div className="flex gap-2 mb-3">
                        <button
                          onClick={() => handleAnswer(item.id, false)}
                          className={`flex-1 py-2 rounded-lg font-inter font-medium text-sm transition-all duration-200 ${answers[item.id] === false
                              ? 'bg-success text-white'
                              : 'bg-white border border-slate-200 text-slate-600 hover:border-success'
                            }`}
                        >
                          <CheckCircle size={14} className="inline mr-1" />
                          Yes, I have this
                        </button>
                        <button
                          onClick={() => handleAnswer(item.id, true)}
                          className={`flex-1 py-2 rounded-lg font-inter font-medium text-sm transition-all duration-200 ${answers[item.id] === true
                              ? 'bg-red-500 text-white'
                              : 'bg-white border border-slate-200 text-slate-600 hover:border-red-300'
                            }`}
                        >
                          <XCircle size={14} className="inline mr-1" />
                          No, I don&apos;t
                        </button>
                      </div>

                      {/* Risk info shown when "No" is selected */}
                      {answers[item.id] === true && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 animate-fadeIn">
                          <div className="flex items-start gap-2">
                            <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-inter font-semibold text-red-800 text-xs block">Risk</span>
                              <p className="font-inter text-red-700 text-xs mt-0.5">{item.risk}</p>
                              <p className="font-inter text-success text-xs font-medium mt-1.5">
                                Recommended: {item.solution}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Summary CTA */}
        {answeredItems > 0 && riskItems > 0 && (
          <div
            className="mt-6 bg-gradient-to-r from-navy to-medium-blue rounded-xl p-6 text-center"
            style={{
              animation: 'fadeInUp 0.4s ease forwards',
            }}
          >
            <div className="font-inter font-bold text-white text-lg mb-2">
              Found {riskItems} gap{riskItems !== 1 ? 's' : ''} in your protection
            </div>
            <p className="font-inter text-white/80 text-sm mb-4">
              We can help you address all of them with our document packs.
            </p>
            <a
              href="/services"
              className="inline-flex items-center gap-2 font-inter font-bold text-navy bg-white rounded-lg hover:bg-slate-50 transition-colors px-6 py-3"
            >
              View Solutions
            </a>
          </div>
        )}

        {/* All good message */}
        {answeredItems === totalItems && riskItems === 0 && (
          <div
            className="mt-6 bg-success/10 border border-success rounded-xl p-6 text-center"
            style={{
              animation: 'fadeInUp 0.4s ease forwards',
            }}
          >
            <div className="w-12 h-12 rounded-full bg-success mx-auto flex items-center justify-center mb-3">
              <CheckCircle size={24} className="text-white" />
            </div>
            <div className="font-inter font-bold text-success text-lg mb-1">
              Great job! You&apos;re well protected.
            </div>
            <p className="font-inter text-success/80 text-sm">
              You have solid foundations. Consider adding more protection with our Operations packs.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Quick Risk Scan - simplified version
interface QuickRiskScanProps {
  className?: string;
}

export function QuickRiskScan({ className = '' }: QuickRiskScanProps) {
  const [ref, inView] = useInView(0.2);
  const [selectedGaps, setSelectedGaps] = useState<string[]>([]);

  const gaps = [
    { id: 'contract', label: 'No signed client contract', impact: 'High' },
    { id: 'gdpr', label: 'Missing GDPR privacy policy', impact: 'High' },
    { id: 'terms', label: 'No terms & conditions', impact: 'Medium' },
    { id: 'invoice', label: 'Invoices without legal terms', impact: 'Medium' },
    { id: 'scope', label: 'Scope not documented', impact: 'Medium' },
    { id: 'data', label: 'No data retention policy', impact: 'High' },
  ];

  const toggleGap = (id: string) => {
    setSelectedGaps(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  return (
    <div ref={ref} className={`bg-white rounded-2xl border border-slate-200 p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle size={20} className="text-amber-500" />
        <h3 className="font-inter font-bold text-navy text-lg">Quick Risk Scan</h3>
      </div>

      <p className="font-inter text-secondary-text text-sm mb-4">
        Select any that apply to your current situation:
      </p>

      <div className="space-y-2">
        {gaps.map((gap, i) => (
          <button
            key={gap.id}
            onClick={() => toggleGap(gap.id)}
            className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-200 ${selectedGaps.includes(gap.id)
                ? 'border-red-300 bg-red-50'
                : 'border-slate-200 hover:border-slate-300'
              }`}
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateX(0)' : 'translateX(-10px)',
              transition: `opacity 0.3s ease ${i * 50}ms, transform 0.3s ease ${i * 50}ms`,
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded flex items-center justify-center ${selectedGaps.includes(gap.id) ? 'bg-red-500' : 'border-2 border-slate-300 bg-white'
                  }`}
              >
                {selectedGaps.includes(gap.id) && (
                  <CheckCircle size={12} className="text-white" />
                )}
              </div>
              <span className="font-inter font-medium text-dark-text text-sm text-left">
                {gap.label}
              </span>
            </div>
            <span
              className={`font-inter text-xs font-semibold px-2 py-0.5 rounded ${gap.impact === 'High'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-amber-100 text-amber-700'
                }`}
            >
              {gap.impact} Impact
            </span>
          </button>
        ))}
      </div>

      {selectedGaps.length > 0 && (
        <div className="mt-4 p-3 bg-navy rounded-lg text-center">
          <span className="font-inter font-bold text-white">
            {selectedGaps.length} risk{selectedGaps.length !== 1 ? 's' : ''} identified
          </span>
          <p className="font-inter text-white/80 text-xs mt-1">
            Our packs can help you address all of these.
          </p>
        </div>
      )}
    </div>
  );
}
