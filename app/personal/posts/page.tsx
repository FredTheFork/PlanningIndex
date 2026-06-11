'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useClientProfile } from '@/hooks/useClientProfile';
import {
  Share2, Download, Lock, ChevronDown, ChevronUp,
  Instagram, Linkedin, Facebook, Twitter, Video, Images
} from 'lucide-react';
import { PlatformId, PLATFORM_SPECS, ALL_PLATFORM_IDS, extractSelectedPlatforms } from '@/lib/social-platforms';

const PLATFORM_ICON_MAP: Record<PlatformId, React.ElementType> = {
  LinkedIn: Linkedin,
  Instagram: Instagram,
  Facebook: Facebook,
  X: Twitter,
  TikTok: Share2,
  Pinterest: Share2,
};

interface SocialPost {
  id: string;
  post_number: number;
  category: 'educational' | 'promotional' | 'personal';
  caption: string;
  hashtags: string | null;
  platform: PlatformId;
  image_path: string | null;
  video_path: string | null;
  carousel_paths: string[] | null;
  image_dimensions: string | null;
  week: number;
  day: string;
}

const CATEGORY_CONFIG = {
  educational: { label: 'Educational', color: 'bg-purple-50 text-purple-700' },
  promotional: { label: 'Promotional', color: 'bg-orange-50 text-orange-700' },
  personal: { label: 'Personal', color: 'bg-green-50 text-green-700' },
};

export default function PersonalPostsPage() {
  const { user, loading: authLoading } = useAuth();
  const { purchasedServiceIds, profile, loading: profileLoading } = useClientProfile();
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [activePlatform, setActivePlatform] = useState<PlatformId | 'all'>('all');
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformId[]>([]);

  const hasSocialMediaPack = purchasedServiceIds.includes('social_media_pack');

  useEffect(() => {
    if (!user) return;
    fetchPosts();
    fetchIntakePlatforms();
  }, [user]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('social_media_posts')
        .select('id, post_number, category, caption, hashtags, platform, image_path, video_path, carousel_paths, image_dimensions, week, day')
        .eq('user_id', user!.id)
        .eq('delivered_to_client', true)
        .order('post_number', { ascending: true });

      if (!error && data) {
        setPosts(data);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchIntakePlatforms = async () => {
    try {
      const { data } = await supabase
        .from('intake_responses')
        .select('responses')
        .eq('user_id', user!.id)
        .maybeSingle();

      if (data?.responses) {
        const platforms = extractSelectedPlatforms(data.responses);
        if (platforms.length > 0) {
          setSelectedPlatforms(platforms);
          setActivePlatform(platforms[0]);
        } else {
          setSelectedPlatforms([...ALL_PLATFORM_IDS]);
        }
      } else {
        setSelectedPlatforms([...ALL_PLATFORM_IDS]);
      }
    } catch {
      setSelectedPlatforms([...ALL_PLATFORM_IDS]);
    }
  };

  const handleImageDownload = async (path: string, name: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('social-media-images')
        .createSignedUrl(path, 3600);

      if (error || !data) return;

      const a = document.createElement('a');
      a.href = data.signedUrl;
      a.download = name;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  const handleVideoDownload = async (path: string, name: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('social-media-videos')
        .createSignedUrl(path, 3600);

      if (error || !data) return;

      const a = document.createElement('a');
      a.href = data.signedUrl;
      a.download = name;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  // Group posts by platform
  const postsByPlatform = posts.reduce((acc, post) => {
    if (!acc[post.platform]) acc[post.platform] = [];
    acc[post.platform].push(post);
    return acc;
  }, {} as Record<PlatformId, SocialPost[]>);

  // Filter for single-platform view
  const visiblePosts = activePlatform === 'all' ? posts : (postsByPlatform[activePlatform as PlatformId] || []);

  // Only show platform tabs for platforms that have posts
  const platformTabs = selectedPlatforms.filter(p => (postsByPlatform[p] || []).length > 0);

  if (authLoading || profileLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B3F7A]" />
      </div>
    );
  }

  if (!hasSocialMediaPack) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="text-center">
          <Share2 size={48} className="mx-auto mb-4 text-gray-300" />
          <h2 className="font-inter font-bold text-[#1B3F7A] text-xl mb-2">
            Social Media Posts Not Purchased
          </h2>
          <p className="text-gray-600 text-sm">
            You haven't purchased the Social Media Pack. Visit the services page to add it to your account.
          </p>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="flex items-start gap-4">
          <div className="bg-gray-100 rounded-lg p-3 shrink-0">
            <Lock size={24} className="text-gray-600" />
          </div>
          <div>
            <h2 className="font-inter font-bold text-[#1B3F7A] text-lg mb-2">
              Posts Not Yet Available
            </h2>
            <p className="font-inter text-gray-600 text-sm mb-4">
              {profile?.delivery_status === 'not_started'
                ? 'Your posts will be prepared once you submit your intake form. The 24-hour delivery window starts from submission.'
                : 'Your posts are currently being prepared. They will be available within 24 hours of submitting your intake form.'}
            </p>
            {!profile?.has_submitted_intake && (
              <a
                href="/personal/intake"
                className="inline-flex items-center gap-2 font-inter font-semibold text-white bg-[#1B3F7A] rounded-md hover:bg-[#2C68C4] transition-colors"
                style={{ padding: '10px 20px', fontSize: '0.9rem' }}
              >
                Complete Intake Form
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-inter font-bold text-[#1B3F7A] text-2xl mb-1">
          Social Media Posts
        </h1>
        <p className="font-inter text-gray-600 text-sm">
          {posts.length} posts ready to use across your social platforms.
        </p>
      </div>

      {/* Platform Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActivePlatform('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-inter font-medium transition-colors ${
              activePlatform === 'all'
                ? 'bg-[#1B3F7A] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Platforms ({posts.length})
          </button>
          {platformTabs.map((platform) => {
            const spec = PLATFORM_SPECS[platform];
            const Icon = PLATFORM_ICON_MAP[platform];
            const count = (postsByPlatform[platform] || []).length;
            const isActive = activePlatform === platform;
            return (
              <button
                key={platform}
                onClick={() => setActivePlatform(platform)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-inter font-medium transition-colors ${
                  isActive
                    ? `${spec.bgClass} ${spec.textClass} ring-1 ring-current`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon size={14} />
                {spec.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Platform-Grouped or Single Platform Posts */}
      {activePlatform === 'all' ? (
        <div className="space-y-8">
          {platformTabs.map((platform) => {
            const platformPosts = postsByPlatform[platform] || [];
            const spec = PLATFORM_SPECS[platform];
            const Icon = PLATFORM_ICON_MAP[platform];
            return (
              <div key={platform}>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${spec.bgClass} ${spec.textClass} font-inter font-semibold text-sm mb-4`}>
                  <Icon size={16} />
                  {spec.label} ({platformPosts.length})
                </div>
                <div className="space-y-3">
                  {platformPosts.map((post) => (
                    <ClientPostCard
                      key={post.id}
                      post={post}
                      isExpanded={expandedPost === post.id}
                      onToggleExpand={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                      onImageDownload={handleImageDownload}
                      onVideoDownload={handleVideoDownload}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {visiblePosts.map((post) => (
            <ClientPostCard
              key={post.id}
              post={post}
              isExpanded={expandedPost === post.id}
              onToggleExpand={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
              onImageDownload={handleImageDownload}
              onVideoDownload={handleVideoDownload}
            />
          ))}
        </div>
      )}

      {/* Tips Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-inter font-semibold text-blue-900 mb-3">Tips for Using Your Posts</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <span className="font-bold">1.</span>
            <span>Schedule posts in advance using tools like Buffer, Hootsuite, or Later</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">2.</span>
            <span>Customize hashtags to match your specific industry or location</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">3.</span>
            <span>Add your own images or brand photos to make posts more personal</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">4.</span>
            <span>Engage with comments and replies to maximize reach</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">5.</span>
            <span>Post at optimal times for your audience (usually 9am-12pm on weekdays)</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

// ── Client Post Card ─────────────────────────────────────────────────────────
function ClientPostCard({
  post,
  isExpanded,
  onToggleExpand,
  onImageDownload,
  onVideoDownload,
}: {
  post: SocialPost;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onImageDownload: (path: string, name: string) => void;
  onVideoDownload: (path: string, name: string) => void;
}) {
  const spec = PLATFORM_SPECS[post.platform];
  const PlatformIcon = PLATFORM_ICON_MAP[post.platform];
  const categoryConfig = CATEGORY_CONFIG[post.category];

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-inter font-semibold text-[#1B3F7A]">#{post.post_number}</span>
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${spec.bgClass} ${spec.textClass}`}>
          <PlatformIcon size={12} />
          {spec.label}
        </span>
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${categoryConfig.color}`}>
          {categoryConfig.label}
        </span>
        <span className="text-xs text-gray-500">{post.day}</span>
        <div className="ml-auto">
          <button
            onClick={onToggleExpand}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>
      <p className="font-inter text-sm text-gray-700 mb-2 whitespace-pre-wrap">
        {isExpanded ? post.caption : post.caption.slice(0, 200) + (post.caption.length > 200 ? '...' : '')}
      </p>
      {post.hashtags && (
        <p className="font-inter text-xs text-blue-600 mb-2">{post.hashtags}</p>
      )}

      {/* Download buttons */}
      <div className="flex flex-wrap gap-2 mt-2">
        {post.image_path && (
          <button
            onClick={() => onImageDownload(post.image_path!, `post-${post.post_number}-image.${post.image_path!.split('.').pop()}`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded text-xs font-inter font-medium hover:bg-purple-100 transition-colors"
          >
            <Download size={12} /> Download Image
          </button>
        )}
        {post.video_path && (
          <button
            onClick={() => onVideoDownload(post.video_path!, `post-${post.post_number}-video.${post.video_path!.split('.').pop()}`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded text-xs font-inter font-medium hover:bg-blue-100 transition-colors"
          >
            <Video size={12} /> Download Video
          </button>
        )}
        {post.carousel_paths && post.carousel_paths.length > 0 && (
          <div className="w-full mt-2">
            <p className="text-xs font-inter text-gray-500 mb-1.5">
              <Images size={12} className="inline mr-1" />
              Carousel ({post.carousel_paths.length} slides)
            </p>
            <div className="flex flex-wrap gap-2">
              {post.carousel_paths.map((path, index) => (
                <button
                  key={index}
                  onClick={() => onImageDownload(path, `post-${post.post_number}-carousel-${index + 1}.${path.split('.').pop()}`)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pink-50 text-pink-700 rounded text-xs font-inter font-medium hover:bg-pink-100 transition-colors"
                >
                  <Download size={12} /> Slide {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Expanded: full caption + dimensions info */}
      {isExpanded && post.image_dimensions && (
        <div className={`mt-3 rounded-lg p-2.5 ${spec.bgClass}`}>
          <p className={`text-xs font-inter ${spec.textClass}`}>
            Image dimensions: {post.image_dimensions} | Recommended: {spec.imageSpecs.map(s => `${s.width}x${s.height}`).join(' or ')}
          </p>
        </div>
      )}
    </div>
  );
}
