import {
  buildIntakeForm,
  getTotalFieldCount,
  getSectionsForService,
  getSectionIdsForService,
  isFieldVisible,
  getVisibleFieldIds,
  getServiceListDescription,
} from '../build-intake-form';

// ── buildIntakeForm ──

describe('buildIntakeForm', () => {
  it('returns empty array for no services', () => {
    expect(buildIntakeForm([])).toEqual([]);
  });

  it('returns all core sections for business_foundations_pack only', () => {
    const sections = buildIntakeForm(['business_foundations_pack']);
    const ids = sections.map((s) => s.id);

    expect(ids).toEqual([
      'intro',
      'business_identity',
      'services',
      'clients',
      'pricing',
      'gdpr',
      'legal',
      'brand',
      'invoice',
      'linkedin',
      'final',
    ]);
  });

  it('returns correct sections for website_copy_pack only', () => {
    const sections = buildIntakeForm(['website_copy_pack']);
    const ids = sections.map((s) => s.id);

    expect(ids).toEqual([
      'intro',
      'business_identity',
      'services',
      'clients',
      'brand',
      'final',
      'website_copy',
    ]);

    // q67_brand_colours should be included when website_copy_pack is purchased
    const brandSection = sections.find((s) => s.id === 'brand')!;
    const hasBrandColours = brandSection.fields.some((f) => f.id === 'q67_brand_colours');
    expect(hasBrandColours).toBe(true);
  });

  it('returns correct sections for social_media_pack only', () => {
    const sections = buildIntakeForm(['social_media_pack']);
    const ids = sections.map((s) => s.id);

    expect(ids).toEqual([
      'intro',
      'business_identity',
      'services',
      'brand',
      'final',
      'social_media',
    ]);

    // q67_brand_colours should be included when social_media_pack is purchased
    const brandSection = sections.find((s) => s.id === 'brand')!;
    const hasBrandColours = brandSection.fields.some((f) => f.id === 'q67_brand_colours');
    expect(hasBrandColours).toBe(true);
  });

  it('de-duplicates shared sections when documents + website are combined', () => {
    const sections = buildIntakeForm(['business_foundations_pack', 'website_copy_pack']);
    const ids = sections.map((s) => s.id);

    // Shared sections appear once, not twice
    expect(ids.filter((id) => id === 'business_identity').length).toBe(1);
    expect(ids.filter((id) => id === 'services').length).toBe(1);
    expect(ids.filter((id) => id === 'brand').length).toBe(1);
    expect(ids.filter((id) => id === 'final').length).toBe(1);

    // All document-specific sections included
    expect(ids).toContain('pricing');
    expect(ids).toContain('gdpr');
    expect(ids).toContain('legal');
    expect(ids).toContain('invoice');
    expect(ids).toContain('linkedin');

    // Website-specific section included
    expect(ids).toContain('website_copy');

    // Clients included (shared by documents + website)
    expect(ids).toContain('clients');

    // Social media NOT included
    expect(ids).not.toContain('social_media');

    // Check sort order
    expect(ids).toEqual([
      'intro',
      'business_identity',
      'services',
      'clients',
      'pricing',
      'gdpr',
      'legal',
      'brand',
      'invoice',
      'linkedin',
      'final',
      'website_copy',
    ]);
  });

  it('de-duplicates all shared sections when all three services are combined', () => {
    const sections = buildIntakeForm([
      'business_foundations_pack',
      'website_copy_pack',
      'social_media_pack',
    ]);
    const ids = sections.map((s) => s.id);

    // Each section appears exactly once
    const idCounts = new Map<string, number>();
    for (const id of ids) {
      idCounts.set(id, (idCounts.get(id) || 0) + 1);
    }
    for (const [id, count] of idCounts) {
      expect(count).toBe(1);
    }

    expect(ids).toEqual([
      'intro',
      'business_identity',
      'services',
      'clients',
      'pricing',
      'gdpr',
      'legal',
      'brand',
      'invoice',
      'linkedin',
      'final',
      'website_copy',
      'social_media',
    ]);
  });

  it('fieldServiceTags: excludes q67_brand_colours for documents-only purchase', () => {
    const sections = buildIntakeForm(['business_foundations_pack']);
    const brandSection = sections.find((s) => s.id === 'brand')!;
    const hasBrandColours = brandSection.fields.some((f) => f.id === 'q67_brand_colours');
    expect(hasBrandColours).toBe(false);
  });

  it('fieldServiceTags: includes q67_brand_colours for website_copy_pack purchase', () => {
    const sections = buildIntakeForm(['website_copy_pack']);
    const brandSection = sections.find((s) => s.id === 'brand')!;
    const hasBrandColours = brandSection.fields.some((f) => f.id === 'q67_brand_colours');
    expect(hasBrandColours).toBe(true);
  });

  it('fieldServiceTags: includes q67_brand_colours for combined documents + website purchase', () => {
    const sections = buildIntakeForm(['business_foundations_pack', 'website_copy_pack']);
    const brandSection = sections.find((s) => s.id === 'brand')!;
    const hasBrandColours = brandSection.fields.some((f) => f.id === 'q67_brand_colours');
    expect(hasBrandColours).toBe(true);
  });

  it('sort order is consistent regardless of input array order', () => {
    const order1 = buildIntakeForm(['website_copy_pack', 'business_foundations_pack']);
    const order2 = buildIntakeForm(['business_foundations_pack', 'website_copy_pack']);

    const ids1 = order1.map((s) => s.id);
    const ids2 = order2.map((s) => s.id);

    expect(ids1).toEqual(ids2);
  });
});

// ── getTotalFieldCount ──

describe('getTotalFieldCount', () => {
  it('returns 0 for no services', () => {
    expect(getTotalFieldCount([])).toBe(0);
  });

  it('returns a positive count for business_foundations_pack', () => {
    const count = getTotalFieldCount(['business_foundations_pack']);
    expect(count).toBeGreaterThan(0);
  });

  it('website_copy_pack has fewer fields than business_foundations_pack', () => {
    const coreCount = getTotalFieldCount(['business_foundations_pack']);
    const webCount = getTotalFieldCount(['website_copy_pack']);
    expect(webCount).toBeLessThan(coreCount);
  });

  it('combined services count is less than sum of individual counts (due to deduplication)', () => {
    const coreCount = getTotalFieldCount(['business_foundations_pack']);
    const webCount = getTotalFieldCount(['website_copy_pack']);
    const combinedCount = getTotalFieldCount(['business_foundations_pack', 'website_copy_pack']);

    expect(combinedCount).toBeLessThan(coreCount + webCount);
    expect(combinedCount).toBeGreaterThan(coreCount);
  });

  it('counts repeating section sub-fields correctly', () => {
    // The services section has q15_services (repeating_section with 7 sub-fields, minItems: 1)
    const sections = buildIntakeForm(['business_foundations_pack']);
    const servicesSection = sections.find((s) => s.id === 'services')!;
    const repeatingField = servicesSection.fields.find((f) => f.id === 'q15_services')!;

    expect(repeatingField.type).toBe('repeating_section');
    expect(repeatingField.subFields!.length).toBe(7);
    expect(repeatingField.minItems).toBe(1);
  });
});

// ── getSectionsForService ──

describe('getSectionsForService', () => {
  it('returns same as buildIntakeForm with single service', () => {
    const single = buildIntakeForm(['website_copy_pack']);
    const viaHelper = getSectionsForService('website_copy_pack');

    expect(viaHelper.map((s) => s.id)).toEqual(single.map((s) => s.id));
  });
});

// ── getSectionIdsForService ──

describe('getSectionIdsForService', () => {
  it('returns correct IDs for business_foundations_pack', () => {
    const ids = getSectionIdsForService('business_foundations_pack');
    expect(ids).toEqual([
      'intro',
      'business_identity',
      'services',
      'clients',
      'pricing',
      'gdpr',
      'legal',
      'brand',
      'invoice',
      'linkedin',
      'final',
    ]);
  });

  it('returns empty array for unknown service', () => {
    const ids = getSectionIdsForService('nonexistent_service');
    expect(ids).toEqual([]);
  });
});

// ── isFieldVisible ──

describe('isFieldVisible', () => {
  it('returns false for field in section not relevant to purchased services', () => {
    expect(isFieldVisible('q69_bank_details', 'invoice', ['website_copy_pack'])).toBe(false);
  });

  it('returns true for field in relevant section without fieldServiceTags', () => {
    expect(isFieldVisible('q55_first_name', 'brand', ['website_copy_pack'])).toBe(true);
  });

  it('returns false for field with fieldServiceTags not matching purchased services', () => {
    expect(isFieldVisible('q67_brand_colours', 'brand', ['business_foundations_pack'])).toBe(false);
  });

  it('returns true for field with fieldServiceTags matching a purchased service', () => {
    expect(isFieldVisible('q67_brand_colours', 'brand', ['website_copy_pack'])).toBe(true);
  });

  it('returns true for field with fieldServiceTags matching one of multiple purchased services', () => {
    expect(isFieldVisible('q67_brand_colours', 'brand', ['business_foundations_pack', 'website_copy_pack'])).toBe(true);
  });

  it('returns false for nonexistent section', () => {
    expect(isFieldVisible('some_field', 'nonexistent', ['business_foundations_pack'])).toBe(false);
  });
});

// ── getVisibleFieldIds ──

describe('getVisibleFieldIds', () => {
  it('includes core field IDs for business_foundations_pack', () => {
    const ids = getVisibleFieldIds(['business_foundations_pack']);
    expect(ids).toContain('q1_legal_name');
    expect(ids).toContain('q83_consent_accuracy');
    expect(ids).toContain('service_name'); // sub-field of q15_services
  });

  it('excludes website-only field IDs for documents-only purchase', () => {
    const ids = getVisibleFieldIds(['business_foundations_pack']);
    expect(ids).not.toContain('wc1_pages_needed');
  });

  it('includes website field IDs for website_copy_pack', () => {
    const ids = getVisibleFieldIds(['website_copy_pack']);
    expect(ids).toContain('wc1_pages_needed');
  });
});

// ── getServiceListDescription ──

describe('getServiceListDescription', () => {
  const serviceNames: Record<string, string> = {
    business_foundations_pack: 'Business Foundations Pack',
    website_copy_pack: 'Website Copy Starter Pack',
    social_media_pack: 'Social Media Starter Pack',
  };

  it('returns generic text for empty array', () => {
    expect(getServiceListDescription([], serviceNames)).toBe('your deliverables');
  });

  it('returns single service name for one service', () => {
    expect(getServiceListDescription(['business_foundations_pack'], serviceNames))
      .toBe('Business Foundations Pack');
  });

  it('joins two services with "and"', () => {
    expect(
      getServiceListDescription(['business_foundations_pack', 'website_copy_pack'], serviceNames),
    ).toBe('Business Foundations Pack and Website Copy Starter Pack');
  });

  it('joins three services with comma and "and"', () => {
    expect(
      getServiceListDescription(
        ['business_foundations_pack', 'website_copy_pack', 'social_media_pack'],
        serviceNames,
      ),
    ).toBe('Business Foundations Pack, Website Copy Starter Pack, and Social Media Starter Pack');
  });

  it('handles unknown service IDs gracefully', () => {
    expect(getServiceListDescription(['unknown_id'], serviceNames)).toBe('your deliverables');
  });
});
