// Platform configuration and normalization for social media features

export type PlatformId = 'LinkedIn' | 'Instagram' | 'Facebook' | 'X' | 'TikTok' | 'Pinterest';

export interface ImageSpec {
  width: number;
  height: number;
  aspectRatio: string;
  label: string;
}

export interface VideoSpec {
  maxWidth: number;
  maxHeight: number;
  maxLengthSeconds: number;
  acceptedMimeTypes: string[];
  maxFileSizeMB: number;
}

export interface PlatformSpec {
  id: PlatformId;
  label: string;
  color: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  imageSpecs: ImageSpec[];
  videoSpec: VideoSpec | null;
  acceptedImageMimeTypes: string[];
  maxImageFileSizeMB: number;
  captionLimit: number;
  hashtagLimit: number;
  features: {
    carousel: boolean;
    stories: boolean;
    reels: boolean;
    gif: boolean;
  };
  carouselMaxSlides?: number;
}

export const PLATFORM_SPECS: Record<PlatformId, PlatformSpec> = {
  LinkedIn: {
    id: 'LinkedIn',
    label: 'LinkedIn',
    color: '#0A66C2',
    bgClass: 'bg-blue-50',
    textClass: 'text-blue-700',
    borderClass: 'border-blue-200',
    imageSpecs: [
      { width: 1200, height: 627, aspectRatio: '1.91:1', label: 'Landscape (shared link/image)' },
      { width: 1080, height: 1080, aspectRatio: '1:1', label: 'Square (post image)' },
    ],
    videoSpec: {
      maxWidth: 1920,
      maxHeight: 1080,
      maxLengthSeconds: 600,
      acceptedMimeTypes: ['video/mp4'],
      maxFileSizeMB: 200,
    },
    acceptedImageMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxImageFileSizeMB: 10,
    captionLimit: 3000,
    hashtagLimit: 30,
    features: { carousel: true, stories: false, reels: false, gif: false },
    carouselMaxSlides: 10,
  },
  Instagram: {
    id: 'Instagram',
    label: 'Instagram',
    color: '#E4405F',
    bgClass: 'bg-pink-50',
    textClass: 'text-pink-700',
    borderClass: 'border-pink-200',
    imageSpecs: [
      { width: 1080, height: 1080, aspectRatio: '1:1', label: 'Square (feed)' },
      { width: 1080, height: 1350, aspectRatio: '4:5', label: 'Portrait (feed)' },
      { width: 1080, height: 1920, aspectRatio: '9:16', label: 'Stories / Reels' },
    ],
    videoSpec: {
      maxWidth: 1080,
      maxHeight: 1920,
      maxLengthSeconds: 90,
      acceptedMimeTypes: ['video/mp4', 'video/quicktime'],
      maxFileSizeMB: 250,
    },
    acceptedImageMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxImageFileSizeMB: 30,
    captionLimit: 2200,
    hashtagLimit: 30,
    features: { carousel: true, stories: true, reels: true, gif: false },
    carouselMaxSlides: 10,
  },
  Facebook: {
    id: 'Facebook',
    label: 'Facebook',
    color: '#1877F2',
    bgClass: 'bg-blue-50',
    textClass: 'text-blue-700',
    borderClass: 'border-blue-200',
    imageSpecs: [
      { width: 1200, height: 630, aspectRatio: '1.91:1', label: 'Landscape (link preview)' },
      { width: 1080, height: 1080, aspectRatio: '1:1', label: 'Square (feed)' },
      { width: 1080, height: 1350, aspectRatio: '4:5', label: 'Portrait (feed)' },
    ],
    videoSpec: {
      maxWidth: 1920,
      maxHeight: 1080,
      maxLengthSeconds: 240,
      acceptedMimeTypes: ['video/mp4', 'video/quicktime', 'video/webm'],
      maxFileSizeMB: 250,
    },
    acceptedImageMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    maxImageFileSizeMB: 30,
    captionLimit: 63206,
    hashtagLimit: 30,
    features: { carousel: true, stories: true, reels: true, gif: true },
    carouselMaxSlides: 10,
  },
  X: {
    id: 'X',
    label: 'X',
    color: '#000000',
    bgClass: 'bg-gray-100',
    textClass: 'text-gray-800',
    borderClass: 'border-gray-300',
    imageSpecs: [
      { width: 1200, height: 675, aspectRatio: '16:9', label: 'Landscape' },
      { width: 1080, height: 1080, aspectRatio: '1:1', label: 'Square' },
    ],
    videoSpec: {
      maxWidth: 1920,
      maxHeight: 1080,
      maxLengthSeconds: 140,
      acceptedMimeTypes: ['video/mp4', 'video/quicktime'],
      maxFileSizeMB: 512,
    },
    acceptedImageMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    maxImageFileSizeMB: 15,
    captionLimit: 280,
    hashtagLimit: 10,
    features: { carousel: false, stories: false, reels: false, gif: true },
  },
  TikTok: {
    id: 'TikTok',
    label: 'TikTok',
    color: '#000000',
    bgClass: 'bg-gray-900',
    textClass: 'text-white',
    borderClass: 'border-gray-700',
    imageSpecs: [
      { width: 1080, height: 1920, aspectRatio: '9:16', label: 'Vertical (full screen)' },
    ],
    videoSpec: {
      maxWidth: 1080,
      maxHeight: 1920,
      maxLengthSeconds: 600,
      acceptedMimeTypes: ['video/mp4', 'video/quicktime', 'video/webm'],
      maxFileSizeMB: 287,
    },
    acceptedImageMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxImageFileSizeMB: 20,
    captionLimit: 2200,
    hashtagLimit: 30,
    features: { carousel: false, stories: true, reels: true, gif: false },
  },
  Pinterest: {
    id: 'Pinterest',
    label: 'Pinterest',
    color: '#BD081C',
    bgClass: 'bg-red-50',
    textClass: 'text-red-700',
    borderClass: 'border-red-200',
    imageSpecs: [
      { width: 1000, height: 1500, aspectRatio: '2:3', label: 'Pin (standard)' },
      { width: 1000, height: 2100, aspectRatio: '1:2.1', label: 'Long Pin' },
    ],
    videoSpec: {
      maxWidth: 1080,
      maxHeight: 1920,
      maxLengthSeconds: 60,
      acceptedMimeTypes: ['video/mp4', 'video/quicktime'],
      maxFileSizeMB: 200,
    },
    acceptedImageMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxImageFileSizeMB: 32,
    captionLimit: 500,
    hashtagLimit: 20,
    features: { carousel: true, stories: false, reels: false, gif: true },
    carouselMaxSlides: 5,
  },
};

/** Mapping from intake form values to canonical platform IDs */
const PLATFORM_ALIASES: Record<string, PlatformId> = {
  // sm1_platforms values
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  pinterest: 'Pinterest',
  'x (twitter)': 'X',
  x: 'X',
  twitter: 'X',
  // q11_social_platforms extra variants
  'facebook page': 'Facebook',
  'whatsapp business': 'WhatsApp Business' as PlatformId,
  'none yet': 'None' as PlatformId,
  other: 'Other' as PlatformId,
};

/** Non-social platforms to exclude from platform filtering */
const EXCLUDED_PLATFORMS = new Set(['WhatsApp Business', 'None', 'Other']);

/**
 * Normalize intake form platform values to canonical platform IDs.
 * Returns only valid PlatformIds, excluding non-social entries.
 */
export function normalizePlatform(rawValue: string): PlatformId | null {
  const normalized = PLATFORM_ALIASES[rawValue.toLowerCase().trim()];
  if (!normalized || EXCLUDED_PLATFORMS.has(normalized)) return null;
  if (normalized in PLATFORM_SPECS) return normalized as PlatformId;
  return null;
}

/**
 * Extract the client's selected platforms from intake responses.
 * Primary: data.sm1_platforms, Fallback: data.q11_social_platforms
 */
export function extractSelectedPlatforms(intakeResponses: Record<string, any> | null): PlatformId[] {
  if (!intakeResponses) return [];

  const raw = intakeResponses.sm1_platforms || intakeResponses.q11_social_platforms || [];
  const platforms: PlatformId[] = [];

  for (const val of Array.isArray(raw) ? raw : [raw]) {
    const normalized = normalizePlatform(String(val));
    if (normalized && !platforms.includes(normalized)) {
      platforms.push(normalized);
    }
  }

  return platforms;
}

/** Get the primary image spec for a platform (first entry in imageSpecs) */
export function getPrimaryImageSpec(platform: PlatformId): ImageSpec {
  return PLATFORM_SPECS[platform].imageSpecs[0];
}

/** All platform IDs as a const array */
export const ALL_PLATFORM_IDS: PlatformId[] = ['LinkedIn', 'Instagram', 'Facebook', 'X', 'TikTok', 'Pinterest'];

/** Validate an image file's dimensions against a platform's specs using Canvas API */
export async function validateImageDimensions(
  file: File,
  platform: PlatformId
): Promise<{ valid: boolean; width: number; height: number; guidance: string }> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const { width, height } = img;
      const spec = PLATFORM_SPECS[platform];
      const matchesSpec = spec.imageSpecs.some(
        (s) => Math.abs(width / height - s.width / s.height) < 0.05
      );

      const guidance = matchesSpec
        ? ''
        : `Recommended: ${spec.imageSpecs.map(s => `${s.label} (${s.width}x${s.height})`).join(' or ')}. Yours is ${width}x${height}.`;

      resolve({ valid: matchesSpec || true, width, height, guidance });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ valid: true, width: 0, height: 0, guidance: 'Could not read image dimensions.' });
    };

    img.src = url;
  });
}
