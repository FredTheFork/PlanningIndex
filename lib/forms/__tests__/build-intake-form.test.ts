import {
  buildIntakeForm,
  getTotalFieldCount,
  getSectionsForService,
  getSectionIdsForService,
  isFieldVisible,
  getVisibleFieldIds,
  getServiceListDescription,
  getPrefillSuggestions,
  getPrefillableFields,
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

// ── Website copy expanded fields ──

describe('website_copy expanded section', () => {
  it('contains the expanded set of website fields', () => {
    const sections = buildIntakeForm(['website_copy_pack']);
    const websiteSection = sections.find((s) => s.id === 'website_copy')!;
    const fieldIds = websiteSection.fields.map((f) => f.id);

    // Original WC1-WC3 preserved
    expect(fieldIds).toContain('wc1_pages_needed');
    expect(fieldIds).toContain('wc2_primary_action');
    expect(fieldIds).toContain('wc3_inspiration_urls');

    // New website structure fields
    expect(fieldIds).toContain('wc_pages_other');
    expect(fieldIds).toContain('wc_service_page_count');
    expect(fieldIds).toContain('wc_nav_structure');

    // Tone and messaging fields
    expect(fieldIds).toContain('wc_headline_idea');
    expect(fieldIds).toContain('wc_hero_message');
    expect(fieldIds).toContain('wc_differentiator');
    expect(fieldIds).toContain('wc_problems_solved');
    expect(fieldIds).toContain('wc_visitor_feeling');

    // Visual and brand preferences fields
    expect(fieldIds).toContain('wc_colour_preferences');
    expect(fieldIds).toContain('wc_colour_palette_style');
    expect(fieldIds).toContain('wc_font_style');
    expect(fieldIds).toContain('wc_imagery_style');
    expect(fieldIds).toContain('wc_logo_placement');
    expect(fieldIds).toContain('wc_has_brand_guidelines');
    expect(fieldIds).toContain('wc_brand_guidelines_upload');

    // Competitor and inspiration fields
    expect(fieldIds).toContain('wc_competitor_urls');
    expect(fieldIds).toContain('wc_disliked_urls');

    // Functional website details fields
    expect(fieldIds).toContain('wc_forms_needed');
    expect(fieldIds).toContain('wc_testimonials');
    expect(fieldIds).toContain('wc_legal_pages');
    expect(fieldIds).toContain('wc_website_builder');

    // Content you already have fields
    expect(fieldIds).toContain('wc_existing_copy_upload');
    expect(fieldIds).toContain('wc_existing_images_upload');
    expect(fieldIds).toContain('wc_existing_testimonials');
  });

  it('website section has at least 18 fields', () => {
    const sections = buildIntakeForm(['website_copy_pack']);
    const websiteSection = sections.find((s) => s.id === 'website_copy')!;
    expect(websiteSection.fields.length).toBeGreaterThanOrEqual(18);
  });

  it('wc1_pages_needed has expanded options including Portfolio, Pricing, Testimonials', () => {
    const sections = buildIntakeForm(['website_copy_pack']);
    const websiteSection = sections.find((s) => s.id === 'website_copy')!;
    const pagesField = websiteSection.fields.find((f) => f.id === 'wc1_pages_needed')!;
    expect(pagesField.options).toContain('Portfolio / Case Studies');
    expect(pagesField.options).toContain('Pricing');
    expect(pagesField.options).toContain('Testimonials');
    expect(pagesField.options).toContain('Other');
  });

  it('wc1_pages_needed has hasOtherOption enabled', () => {
    const sections = buildIntakeForm(['website_copy_pack']);
    const websiteSection = sections.find((s) => s.id === 'website_copy')!;
    const pagesField = websiteSection.fields.find((f) => f.id === 'wc1_pages_needed')!;
    expect(pagesField.hasOtherOption).toBe(true);
  });

  it('wc_website_builder has hasOtherOption enabled', () => {
    const sections = buildIntakeForm(['website_copy_pack']);
    const websiteSection = sections.find((s) => s.id === 'website_copy')!;
    const builderField = websiteSection.fields.find((f) => f.id === 'wc_website_builder')!;
    expect(builderField.hasOtherOption).toBe(true);
  });

  it('wc_pages_other is conditional on wc1_pages_needed = Other', () => {
    const sections = buildIntakeForm(['website_copy_pack']);
    const websiteSection = sections.find((s) => s.id === 'website_copy')!;
    const otherField = websiteSection.fields.find((f) => f.id === 'wc_pages_other')!;
    expect(otherField.conditionalOn).toEqual({ field: 'wc1_pages_needed', value: 'Other' });
  });

  it('wc_brand_guidelines_upload is conditional on wc_has_brand_guidelines', () => {
    const sections = buildIntakeForm(['website_copy_pack']);
    const websiteSection = sections.find((s) => s.id === 'website_copy')!;
    const uploadField = websiteSection.fields.find((f) => f.id === 'wc_brand_guidelines_upload')!;
    expect(uploadField.conditionalOn).toEqual({
      field: 'wc_has_brand_guidelines',
      value: ['Yes', 'Partially'],
    });
  });

  it('website fields are not visible for business_foundations_pack only', () => {
    const ids = getVisibleFieldIds(['business_foundations_pack']);
    expect(ids).not.toContain('wc_hero_message');
    expect(ids).not.toContain('wc_differentiator');
    expect(ids).not.toContain('wc_font_style');
    expect(ids).not.toContain('wc_website_builder');
  });

  it('prefillFrom fields have the correct source field IDs', () => {
    const sections = buildIntakeForm(['website_copy_pack']);
    const websiteSection = sections.find((s) => s.id === 'website_copy')!;

    const differentiator = websiteSection.fields.find((f) => f.id === 'wc_differentiator')!;
    expect(differentiator.prefillFrom).toBe('q61_differentiator');

    const problemsSolved = websiteSection.fields.find((f) => f.id === 'wc_problems_solved')!;
    expect(problemsSolved.prefillFrom).toBe('q13_what_you_do');

    const colourPref = websiteSection.fields.find((f) => f.id === 'wc_colour_preferences')!;
    expect(colourPref.prefillFrom).toBe('q67_brand_colours');
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

  it('website_copy_pack field count is significantly larger than the original 3 fields', () => {
    const webCount = getTotalFieldCount(['website_copy_pack']);
    expect(webCount).toBeGreaterThan(15);
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

  it('returns true for website-specific fields when website_copy_pack is purchased', () => {
    expect(isFieldVisible('wc_hero_message', 'website_copy', ['website_copy_pack'])).toBe(true);
    expect(isFieldVisible('wc_website_builder', 'website_copy', ['website_copy_pack'])).toBe(true);
  });

  it('returns false for website-specific fields when only business_foundations_pack is purchased', () => {
    expect(isFieldVisible('wc_hero_message', 'website_copy', ['business_foundations_pack'])).toBe(false);
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
    expect(ids).not.toContain('wc_hero_message');
  });

  it('includes website field IDs for website_copy_pack', () => {
    const ids = getVisibleFieldIds(['website_copy_pack']);
    expect(ids).toContain('wc1_pages_needed');
    expect(ids).toContain('wc_hero_message');
    expect(ids).toContain('wc_website_builder');
  });
});

// ── getPrefillSuggestions ──

describe('getPrefillSuggestions', () => {
  it('returns empty object when no source fields have answers', () => {
    const suggestions = getPrefillSuggestions(['website_copy_pack'], {});
    expect(Object.keys(suggestions)).toHaveLength(0);
  });

  it('suggests prefill for wc_differentiator when q61_differentiator is answered', () => {
    const suggestions = getPrefillSuggestions(['website_copy_pack'], {
      q61_differentiator: 'I offer a 48-hour turnaround',
    });
    expect(suggestions['wc_differentiator']).toBe('I offer a 48-hour turnaround');
  });

  it('suggests prefill for wc_problems_solved when q13_what_you_do is answered', () => {
    const suggestions = getPrefillSuggestions(['website_copy_pack'], {
      q13_what_you_do: 'I help sole traders with compliance',
    });
    expect(suggestions['wc_problems_solved']).toBe('I help sole traders with compliance');
  });

  it('suggests prefill for wc_colour_preferences when q67_brand_colours is answered', () => {
    const suggestions = getPrefillSuggestions(['website_copy_pack'], {
      q67_brand_colours: '#1B3F7A and #F0C040',
    });
    expect(suggestions['wc_colour_preferences']).toBe('#1B3F7A and #F0C040');
  });

  it('suggests all three prefillable fields when all sources are answered', () => {
    const suggestions = getPrefillSuggestions(['website_copy_pack'], {
      q61_differentiator: 'My differentiator',
      q13_what_you_do: 'What I do',
      q67_brand_colours: 'Navy and gold',
    });
    expect(Object.keys(suggestions)).toHaveLength(3);
    expect(suggestions['wc_differentiator']).toBe('My differentiator');
    expect(suggestions['wc_problems_solved']).toBe('What I do');
    expect(suggestions['wc_colour_preferences']).toBe('Navy and gold');
  });

  it('does not suggest prefill for empty source answers', () => {
    const suggestions = getPrefillSuggestions(['website_copy_pack'], {
      q61_differentiator: '',
      q13_what_you_do: null,
    });
    expect(suggestions['wc_differentiator']).toBeUndefined();
    expect(suggestions['wc_problems_solved']).toBeUndefined();
  });

  it('does not suggest prefill for fields not visible to the purchased services', () => {
    // business_foundations_pack does not include the website_copy section
    const suggestions = getPrefillSuggestions(['business_foundations_pack'], {
      q61_differentiator: 'My differentiator',
    });
    expect(suggestions['wc_differentiator']).toBeUndefined();
  });

  it('works for combined documents + website purchase', () => {
    const suggestions = getPrefillSuggestions(
      ['business_foundations_pack', 'website_copy_pack'],
      { q61_differentiator: 'I am different' },
    );
    expect(suggestions['wc_differentiator']).toBe('I am different');
  });
});

// ── getPrefillableFields ──

describe('getPrefillableFields', () => {
  it('returns metadata for all prefillable fields when website_copy_pack is purchased', () => {
    const fields = getPrefillableFields(['website_copy_pack']);
    expect(fields.length).toBe(3);

    const fieldIds = fields.map((f) => f.fieldId);
    expect(fieldIds).toContain('wc_differentiator');
    expect(fieldIds).toContain('wc_problems_solved');
    expect(fieldIds).toContain('wc_colour_preferences');
  });

  it('includes source field labels', () => {
    const fields = getPrefillableFields(['website_copy_pack']);
    const diff = fields.find((f) => f.fieldId === 'wc_differentiator')!;
    expect(diff.sourceFieldId).toBe('q61_differentiator');
    expect(diff.sourceLabel).toBeTruthy();
  });

  it('returns empty array for business_foundations_pack only', () => {
    const fields = getPrefillableFields(['business_foundations_pack']);
    expect(fields).toEqual([]);
  });

  it('returns prefillable fields for combined purchase', () => {
    const fields = getPrefillableFields(['business_foundations_pack', 'website_copy_pack']);
    expect(fields.length).toBe(3);
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
