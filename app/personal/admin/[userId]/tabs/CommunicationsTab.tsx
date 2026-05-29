'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  Mail, Phone, MapPin, CreditCard, Calendar, ExternalLink,
  MessageSquare, DollarSign, Package, Send, AlertCircle
} from 'lucide-react';

interface CommunicationsTabProps {
  userId: string;
  data: any;
  refreshData: () => void;
}

export default function CommunicationsTab({ userId, data, refreshData }: CommunicationsTabProps) {
  const [orders, setOrders] = useState<any[]>([]);
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    setLoading(true);

    // Fetch orders
    const { data: ordersData } = await supabase
      .from('stripe_orders')
      .select('*')
      .eq('customer_id', userId)
      .order('created_at', { ascending: false });

    setOrders(ordersData || []);

    // Fetch contact messages
    const { data: messagesData } = await supabase
      .from('contact_messages')
      .select('*')
      .eq('email', data.email)
      .order('created_at', { ascending: false });

    setContactMessages(messagesData || []);

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B3F7A]" />
      </div>
    );
  }

  const intake = data.intakeResponses || {};

  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-inter font-bold text-[#1B3F7A] text-lg mb-4">
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {intake.q7_document_email && (
            <ContactItem
              icon={Mail}
              label="Email"
              value={intake.q7_document_email}
              href={`mailto:${intake.q7_document_email}`}
            />
          )}
          {intake.q8_business_phone && (
            <ContactItem
              icon={Phone}
              label="Phone"
              value={intake.q8_business_phone}
              href={`tel:${intake.q8_business_phone}`}
            />
          )}
          {intake.q6_business_address && (
            <div className="md:col-span-2">
              <ContactItem
                icon={MapPin}
                label="Address"
                value={intake.q6_business_address}
              />
            </div>
          )}
          {intake.q10_website_url && (
            <ContactItem
              icon={ExternalLink}
              label="Website"
              value={intake.q10_website_url}
              href={intake.q10_website_url}
              external
            />
          )}
        </div>
      </div>

      {/* Business Details */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-inter font-bold text-[#1B3F7A] text-lg mb-4">
          Business Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BusinessItem label="Legal Name" value={intake.q1_legal_name} />
          <BusinessItem label="Trading Name" value={intake.q2_business_name} />
          <BusinessItem label="Business Type" value={intake.q3_business_registered} />
          {intake.q4_companies_house && (
            <BusinessItem label="Companies House No." value={intake.q4_companies_house} />
          )}
          <BusinessItem label="Jurisdiction" value={intake.q5_jurisdiction} />
          <BusinessItem label="VAT Registered" value={intake.q34_vat_registered} />
          {intake.q35_vat_number && (
            <BusinessItem label="VAT Number" value={intake.q35_vat_number} />
          )}
        </div>
      </div>

      {/* Order History */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-inter font-bold text-[#1B3F7A] text-lg mb-4">
          Order History
        </h3>
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard size={40} className="text-gray-400 mx-auto mb-3" />
            <p className="font-inter text-gray-600 text-sm">No orders found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => (
              <div key={order.id} className="bg-[#FAFBFC] rounded-lg p-4 border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Package size={16} className="text-[#1B3F7A]" />
                    <span className="font-inter font-medium text-gray-900 text-sm">
                      Order #{order.id.substring(0, 8)}
                    </span>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    order.status === 'completed' ? 'bg-green-50 text-green-600' :
                    order.status === 'failed' ? 'bg-red-50 text-red-600' :
                    'bg-gray-50 text-gray-600'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {order.amount_total && (
                    <div>
                      <p className="font-inter text-gray-600 text-xs">Amount</p>
                      <p className="font-inter font-medium text-gray-900 text-sm">
                        £{(order.amount_total / 100).toFixed(2)}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="font-inter text-gray-600 text-xs">Date</p>
                    <p className="font-inter font-medium text-gray-900 text-sm">
                      {new Date(order.created_at).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                  {order.payment_status && (
                    <div>
                      <p className="font-inter text-gray-600 text-xs">Payment</p>
                      <p className="font-inter font-medium text-gray-900 text-sm capitalize">
                        {order.payment_status}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="font-inter text-gray-600 text-xs">Currency</p>
                    <p className="font-inter font-medium text-gray-900 text-sm uppercase">
                      {order.currency || 'GBP'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contact Messages */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-inter font-bold text-[#1B3F7A] text-lg mb-4">
          Contact Messages
        </h3>
        {contactMessages.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare size={40} className="text-gray-400 mx-auto mb-3" />
            <p className="font-inter text-gray-600 text-sm">No contact messages found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {contactMessages.map(msg => (
              <div key={msg.id} className="bg-[#FAFBFC] rounded-lg p-4 border border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-inter font-medium text-gray-900 text-sm">{msg.name}</p>
                    <p className="font-inter text-gray-600 text-xs">{msg.email}</p>
                  </div>
                  <p className="font-inter text-gray-500 text-xs">
                    {new Date(msg.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="mb-2">
                  <p className="font-inter text-gray-600 text-xs font-medium mb-1">Subject: {msg.subject}</p>
                  <p className="font-inter text-gray-700 text-sm whitespace-pre-wrap">{msg.message}</p>
                </div>
                {msg.phone && (
                  <p className="font-inter text-gray-600 text-xs">
                    <span className="font-medium">Phone:</span> {msg.phone}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Purchased Upsells */}
      {data.profile?.purchased_upsells && data.profile.purchased_upsells.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-inter font-bold text-[#1B3F7A] text-lg mb-4">
            Purchased Upsells
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.profile.purchased_upsells.map((upsell: string, i: number) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-inter font-medium"
              >
                <Package size={14} />
                {upsell}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ContactItem({ icon: Icon, label, value, href, external }: any) {
  const content = (
    <div className="flex items-start gap-3">
      <div className="bg-[#FAFBFC] rounded-lg p-2 shrink-0">
        <Icon size={16} className="text-[#1B3F7A]" />
      </div>
      <div>
        <p className="font-inter text-gray-600 text-xs mb-1">{label}</p>
        <p className="font-inter text-gray-900 text-sm">{value}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}
        className="block hover:bg-gray-50 rounded-lg p-3 transition-colors -m-3">
        {content}
      </a>
    );
  }

  return <div className="p-3">{content}</div>;
}

function BusinessItem({ label, value }: { label: string; value: string }) {
  if (!value) return null;

  return (
    <div>
      <p className="font-inter text-gray-600 text-xs mb-1">{label}</p>
      <p className="font-inter text-gray-900 text-sm">{value}</p>
    </div>
  );
}
