// Marketing tier form schemas - sections used by Website Copy and Social Media packs.

import { z } from 'zod';
import {
  nonEmptyString, optionalString, optionalEmail, optionalUrl,
  singleChoice, multiSelect, fileUpload,
} from './primitives';

export function getWebsiteCopySchema(): z.ZodObject<any> {
  return z.object({
    // Structure
    wc_service_page_count: singleChoice(['1', '2-3', '4-5', '6+', 'Depends — align with my service descriptions'], true),
    wc_nav_structure: singleChoice(['Single page / scroll', 'Multi-page', 'One-page with sections'], true),

    // Messaging
    wc_headline_idea: optionalString,
    wc_hero_message: nonEmptyString,
    wc_differentiator: optionalString,
    wc_problems_solved: nonEmptyString,
    wc_visitor_feeling: multiSelect(['Confident', 'Inspired', 'Reassured', 'Curious', 'Excited', 'Informed', 'Supported'], true, 3),

    // Visual
    wc_colour_preferences: optionalString,
    wc_colour_palette_style: singleChoice(['Bold and vibrant', 'Clean and minimal', 'Warm and earthy', 'Dark and premium', 'Pastel / soft', 'I have specific brand colours'], false),
    wc_font_style: singleChoice(['Modern sans-serif', 'Classic serif', 'Friendly rounded', 'Minimal / tech', 'No preference'], true),
    wc_imagery_style: singleChoice(['Photography-led', 'Illustration-led', 'Minimal / icons', 'Mix of both', 'No preference'], true),
    wc_logo_placement: singleChoice(['Top left', 'Top centre', 'No preference'], false),
    wc_has_brand_guidelines: singleChoice(['Yes', 'No', 'Partially'], true),
    wc_brand_guidelines_upload: fileUpload,
    wc_logo_upload: fileUpload,

    // Inspiration
    wc_competitor_urls: optionalString,
    wc3_inspiration_urls: optionalString,
    wc_disliked_urls: optionalString,

    // Functional
    wc2_primary_action: nonEmptyString,
    wc_forms_needed: multiSelect(['Contact form', 'Newsletter signup', 'Booking / scheduling', 'Quote request', 'File upload', 'No forms needed'], false),
    wc_legal_pages: multiSelect(['Privacy Policy', 'Terms and Conditions', 'Cookie Policy', 'Disclaimer', 'Accessibility Statement', 'None needed'], true),

    // Content uploads
    wc_existing_copy_upload: fileUpload,
    wc_existing_images_upload: fileUpload,

    // Website-specific pricing
    wc_show_pricing_on_website: singleChoice(['Yes — show starting prices', 'Yes — show full pricing details', 'No — use "Get a quote" approach', 'Not sure yet'], true),
    wc_pricing_text: optionalString,
    wc_payment_methods_display: multiSelect(['Bank transfer (BACS)', 'Credit/Debit card', 'PayPal', 'Direct Debit', 'Cash', 'Payment plans available', 'Not applicable'], false),
    wc_bank_details_for_website: optionalString,

    // Website-specific GDPR
    wc_website_collects_data: singleChoice(['Yes — via contact forms', 'Yes — via newsletter signup', 'Yes — via both forms and newsletter', 'No — just a brochure website'], true),
    wc_data_collected_website: multiSelect(['Names', 'Email addresses', 'Phone numbers', 'Business name', 'Service enquiry details', 'Newsletter subscription'], false),
    wc_needs_cookie_consent: singleChoice(['Yes — required for GDPR compliance', 'No — not needed for my website', 'Not sure'], true),
    wc_analytics_tools: multiSelect(['Google Analytics', 'Meta (Facebook) Pixel', 'Google Tag Manager', 'Hotjar / Heatmaps', 'None needed'], false),

    // Contact & business details
    wc_show_business_hours: singleChoice(['Yes — show my working hours', 'No — just contact options', 'I work flexible hours'], true),
    wc_business_hours: optionalString,
    wc_phone_on_website: singleChoice(['Yes — show phone number', 'No — email and forms only', 'Contact via Calendly/booking only'], true),
    wc_email_display: optionalEmail,
    wc_address_on_website: singleChoice(['Yes — show full address', 'Show city/region only', 'No address shown'], true),

    // Social media links
    wc_show_social_links: singleChoice(['Yes — in header and footer', 'Yes — in footer only', 'Yes — on Contact page only', 'No — not needed'], true),
    wc_social_links_to_show: multiSelect(['LinkedIn', 'Instagram', 'Facebook', 'X (Twitter)', 'TikTok', 'Pinterest', 'YouTube'], false),
    wc_linkedin_url: optionalUrl,
    wc_instagram_url: optionalUrl,
    wc_facebook_url: optionalUrl,

    // Testimonials & credentials
    wc_testimonials: optionalString,
    wc_testimonials_count: singleChoice(['3-5 testimonials', '6-8 testimonials', 'More than 8', 'Just feature one or two prominently'], true),
    wc_credentials_to_show: optionalString,
    wc_awards_or_press: optionalString,

    // Additional features
    wc_booking_tool: singleChoice(['Yes — Calendly', 'Yes — Cal.com', 'Yes — another tool', 'No — I don\'t use one', 'I want one set up'], true),
    wc_booking_url: optionalUrl,
    wc_newsletter_signup: singleChoice(['Yes — I have a mailing list', 'No — not needed', 'I want to set one up'], true),
    wc_newsletter_platform: optionalString,

    // Page-specific optional fields
    wc_homepage_sections: multiSelect(['Hero banner', 'About preview', 'Services overview', 'Testimonials', 'FAQ preview', 'Latest blog posts', 'Newsletter signup', 'Contact CTA'], false),
    wc_homepage_cta_style: multiSelect(['Single prominent button', 'Multiple CTA buttons', 'Soft CTA with contact link', 'No preference'], false),
    wc_about_focus: multiSelect(['Your story and journey', 'Your qualifications and experience', 'Your approach and methodology', 'Your values and mission', 'Personal side / hobbies', 'Team members (if any)'], false),
    wc_about_tone: singleChoice(['Professional and formal', 'Warm and personal', 'Story-driven and engaging', 'No preference'], false),
    wc_services_format: singleChoice(['Card/tile format with icons', 'List format with descriptions', 'Table format with pricing', 'Mixed format', 'No preference'], false),
    wc_services_show_pricing: singleChoice(['Yes — show starting prices', 'Yes — show full pricing', 'No — use "Get a quote" or contact CTA', 'Not sure yet'], false),
    wc_services_cta: singleChoice(['Contact page', 'Booking/scheduling tool', 'Individual service detail page', 'Enquiry form', 'No preference'], false),
    wc_contact_method: multiSelect(['Contact form', 'Direct email link', 'Phone number', 'Calendar/booking link', 'Social media links'], false),
    wc_contact_form_fields: multiSelect(['Name', 'Email', 'Phone (optional)', 'Service interested in', 'Message', 'How did you hear about us?', 'Preferred contact method'], false),
    wc_faq_topics: optionalString,
    wc_faq_count: singleChoice(['5-6 questions', '8-10 questions', '12+ questions', 'No preference — we\'ll decide'], false),
    wc_blog_style: singleChoice(['Card grid with images', 'List format', 'Magazine style', 'Minimal text-only', 'No preference'], false),
    wc_blog_categories: optionalString,
    wc_portfolio_format: singleChoice(['Grid of images with titles', 'Cards with project summaries', 'Before/after format', 'Detailed case study pages', 'No preference'], false),
    wc_portfolio_projects: optionalString,
    wc_pricing_display: singleChoice(['Tiered packages (e.g. Basic/Pro/Premium)', 'Per-service list', 'Starting from prices with "Get quote" CTA', 'Custom quote only', 'No preference'], false),
    wc_pricing_highlights: optionalString,
    wc_testimonials_format: singleChoice(['Quote cards with photos', 'Carousel/slider', 'Simple list', 'Video testimonials', 'Mixed formats', 'No preference'], false),
    wc_testimonials_featured: optionalString,
    website_copy_notes: optionalString,
  });
}

export function getSocialMediaSchema(): z.ZodObject<any> {
  return z.object({
    sm1_platforms: multiSelect(['LinkedIn', 'Instagram', 'TikTok', 'Facebook', 'X (Twitter)', 'Pinterest', 'Other'], true),
    sm2_content_types: multiSelect(['Educational — teach your audience something useful', 'Personal / behind-the-scenes — show the human behind the business', 'Authority / expert — position you as the go-to in your niche', 'Promotional — direct sells and offers', 'Storytelling — client wins, your journey, case studies', 'Inspirational / motivational', 'Relatable / humorous'], true),
    sm3_avoid_topics: optionalString,
    sm4_posting_frequency: singleChoice(['3x/week', '5x/week', 'Daily', '2x/day', 'Not sure'], true),
    sm5_content_pillars: nonEmptyString,
    sm6_personal_boundaries: nonEmptyString,
    sm7_hashtag_strategy: singleChoice(['Broad reach — popular hashtags for maximum visibility', 'Niche targeted — specific hashtags for your ideal audience', 'Mixed — a combination of both', 'No preference — let us decide'], true),
    sm8_competitor_accounts: optionalString,
    sm9_content_tone: singleChoice(['Same as overall brand tone', 'More casual/personal', 'More professional', 'More promotional'], true),
    sm10_call_to_action: optionalString,
    sm11_existing_accounts: optionalString,
    sm12_content_calendar: singleChoice(['Weekly themed — each week has a focus topic', 'Rotating pillars — cycle through your content pillars evenly', 'Mix of types — vary educational, personal, and promotional posts', 'No preference — let us decide'], true),
    sm13_upcoming_launches: optionalString,
    social_media_notes: optionalString,
  });
}
