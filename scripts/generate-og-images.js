#!/usr/bin/env node

/**
 * TEMPORARY OG Image Generator
 *
 * This script generates temporary SVG-based OG images for social media sharing.
 * These are PLACEHOLDER images and should be replaced with professionally designed
 * PNG images created in Canva, Figma, or similar design tools.
 *
 * Usage: node scripts/generate-og-images.js
 *
 * IMPORTANT: Replace these temporary SVG images with actual PNG files before production.
 * Design considerations for real OG images:
 * - Dimensions: 1200x630px (OG standard)
 * - File size: < 50KB for optimal loading
 * - Include brand colors, logo, and clear typography
 * - Ensure text is readable when scaled down
 * - Test on various platforms (Twitter, LinkedIn, Facebook, etc.)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define OG image configurations
const ogImages = [
  {
    filename: 'og-home.png',
    mainText: 'Business Foundations. Fast.',
    subtitleText: 'Professional business documents in 24 hours',
    highlight: '10 Documents. 24 Hours. £79.'
  },
  {
    filename: 'og-about.png',
    mainText: 'About Foundationary',
    subtitleText: 'Learn our mission to make business setup simple',
    highlight: 'Expert-backed document packages'
  },
  {
    filename: 'og-pricing.png',
    mainText: '£79 - 10 Documents',
    subtitleText: 'All-inclusive package with no hidden fees',
    highlight: 'Get started in 24 hours'
  },
  {
    filename: 'og-faq.png',
    mainText: 'FAQs Answered',
    subtitleText: 'Find answers to your most common questions',
    highlight: 'Questions about our service?'
  },
  {
    filename: 'og-contact.png',
    mainText: 'Get in Touch',
    subtitleText: 'Have questions? We are here to help',
    highlight: 'Contact our team'
  },
  {
    filename: 'og-included.png',
    mainText: "What's Included",
    subtitleText: '10 professionally drafted business documents',
    highlight: 'Complete business setup package'
  },
  {
    filename: 'og-how-it-works.png',
    mainText: 'How It Works',
    subtitleText: 'Three simple steps to your business documents',
    highlight: 'Fast, easy, professional'
  },
  {
    filename: 'og-services.png',
    mainText: 'Additional Services',
    subtitleText: 'Expand your package with specialized documents',
    highlight: 'Go beyond the basics'
  }
];

/**
 * Generate SVG content for an OG image
 * This creates a temporary SVG that mimics the brand style
 * Replace with PNG export from design tool for production
 */
function generateSVG(config) {
  const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- TEMPORARY PLACEHOLDER: Replace with actual PNG image designed in Canva/Figma -->

  <!-- Brand gradient background -->
  <rect width="1200" height="630" fill="url(#gradient)"/>
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1B3F7A"/>
      <stop offset="100%" style="stop-color:#2C68C4"/>
    </linearGradient>
  </defs>

  <!-- Foundationary logo (top) -->
  <text x="600" y="120" font-family="Inter, Arial, sans-serif" font-size="48" font-weight="800" fill="white" text-anchor="middle">
    Foundationary
  </text>

  <!-- Main headline (page-specific) -->
  <text x="600" y="250" font-family="Inter, Arial, sans-serif" font-size="60" font-weight="700" fill="white" text-anchor="middle">
    ${config.mainText}
  </text>

  <!-- Highlight text -->
  <text x="600" y="330" font-family="Inter, Arial, sans-serif" font-size="36" font-weight="600" fill="#FFD700" text-anchor="middle">
    ${config.highlight}
  </text>

  <!-- Subtitle -->
  <text x="600" y="420" font-family="Inter, Arial, sans-serif" font-size="24" fill="rgba(255,255,255,0.85)" text-anchor="middle">
    ${config.subtitleText}
  </text>

  <!-- CTA button background -->
  <rect x="450" y="480" width="300" height="60" rx="8" fill="white" opacity="0.1"/>

  <!-- Footer note -->
  <text x="600" y="580" font-family="Inter, Arial, sans-serif" font-size="14" fill="rgba(255,255,255,0.6)" text-anchor="middle">
    Business Foundations. Fast. • foundationary.co.uk
  </text>
</svg>`;
  return svg;
}

/**
 * Main function to generate all OG images
 */
async function generateOGImages() {
  const publicDir = path.join(__dirname, '..', 'public');

  if (!fs.existsSync(publicDir)) {
    console.error(`Error: /public directory not found at ${publicDir}`);
    process.exit(1);
  }

  console.log('Generating temporary OG images...');
  console.log('NOTE: These are PLACEHOLDER SVG images for development only.\n');

  let successCount = 0;
  let errorCount = 0;

  for (const config of ogImages) {
    try {
      const imagePath = path.join(publicDir, config.filename);
      const svgContent = generateSVG(config);

      fs.writeFileSync(imagePath, svgContent, 'utf-8');
      console.log(`✓ Generated ${config.filename}`);
      successCount++;
    } catch (error) {
      console.error(`✗ Failed to generate ${config.filename}: ${error.message}`);
      errorCount++;
    }
  }

  console.log(`\n${successCount} images generated successfully.`);
  if (errorCount > 0) {
    console.error(`${errorCount} images failed to generate.`);
    process.exit(1);
  }

  console.log('\n' + '='.repeat(70));
  console.log('IMPORTANT: PRODUCTION REMINDER');
  console.log('='.repeat(70));
  console.log('These are TEMPORARY SVG placeholder images.');
  console.log('They should be replaced with professionally designed PNG images before deployment.');
  console.log('\nDesign recommendations:');
  console.log('  • Create custom designs in Canva or Figma');
  console.log('  • Maintain 1200x630px dimensions (OG standard)');
  console.log('  • Keep file sizes under 50KB for optimal performance');
  console.log('  • Ensure good contrast and readability');
  console.log('  • Test across different social platforms');
  console.log('  • Use brand colors consistently (dark blue #1B3F7A, accent #2C68C4)');
  console.log('\nTo replace:');
  console.log('  1. Design your PNG images');
  console.log('  2. Save them to /public/ with the same filenames');
  console.log('  3. The application will automatically use the PNG versions');
  console.log('='.repeat(70) + '\n');
}

// Run the generator
generateOGImages().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
