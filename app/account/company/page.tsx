'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button, Input, Alert } from '@/components/ui';

export default function CompanyPage() {
  const [companyName, setCompanyName] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const [phone, setPhone] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [vatNumber, setVatNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) return;
      const { data } = await supabase
        .from('profiles')
        .select('company_name, address_line1, address_line2, city, postcode, phone, company_email, company_phone, website, logo_url, vat_number')
        .eq('id', session.user.id)
        .maybeSingle();

      if (data) {
        setCompanyName(data.company_name || '');
        setAddressLine1(data.address_line1 || '');
        setAddressLine2(data.address_line2 || '');
        setCity(data.city || '');
        setPostcode(data.postcode || '');
        setPhone(data.phone || '');
        setCompanyEmail(data.company_email || '');
        setCompanyPhone(data.company_phone || '');
        setWebsite(data.website || '');
        setLogoUrl(data.logo_url || '');
        setVatNumber(data.vat_number || '');
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          company_name: companyName.trim() || null,
          address_line1: addressLine1.trim() || null,
          address_line2: addressLine2.trim() || null,
          city: city.trim() || null,
          postcode: postcode.trim() || null,
          phone: phone.trim() || null,
          company_email: companyEmail.trim() || null,
          company_phone: companyPhone.trim() || null,
          website: website.trim() || null,
          logo_url: logoUrl.trim() || null,
          vat_number: vatNumber.trim() || null,
        })
        .eq('id', session.user.id);

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setSuccess(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-primary-200 border-t-accent-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-sans font-semibold text-primary-900 text-lg mb-1">
        Company
      </h2>
      <p className="font-sans text-primary-500 text-sm mb-6">
        Your company details automatically appear in proposals and documents.
      </p>

      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
      {success && <Alert variant="success" className="mb-4">Company details updated.</Alert>}

      <form onSubmit={handleSave} className="max-w-md space-y-4">
        <Input
          label="Company name"
          name="companyName"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Your company name"
        />
        <Input
          label="Address line 1"
          name="addressLine1"
          value={addressLine1}
          onChange={(e) => setAddressLine1(e.target.value)}
          placeholder="Street address"
        />
        <Input
          label="Address line 2"
          name="addressLine2"
          value={addressLine2}
          onChange={(e) => setAddressLine2(e.target.value)}
          placeholder="Optional"
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="City"
            name="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
          />
          <Input
            label="Postcode"
            name="postcode"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            placeholder="Postcode"
          />
        </div>
        <Input
          label="Company phone"
          name="companyPhone"
          value={companyPhone}
          onChange={(e) => setCompanyPhone(e.target.value)}
          placeholder="01895 123456"
        />
        <Input
          label="Company email"
          name="companyEmail"
          type="email"
          value={companyEmail}
          onChange={(e) => setCompanyEmail(e.target.value)}
          placeholder="info@yourcompany.co.uk"
        />
        <Input
          label="Website"
          name="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="www.example.co.uk"
        />
        <Input
          label="Logo URL"
          name="logoUrl"
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
          placeholder="https://..."
          helperText="Link to your company logo. This appears on proposals."
        />
        <Input
          label="VAT number"
          name="vatNumber"
          value={vatNumber}
          onChange={(e) => setVatNumber(e.target.value)}
          placeholder="GB123456789"
          helperText="Appears on proposals if registered for VAT."
        />
        <Button type="submit" loading={saving}>
          Save Changes
        </Button>
      </form>
    </div>
  );
}
