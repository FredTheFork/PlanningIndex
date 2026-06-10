'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useClientProfile } from '@/hooks/useClientProfile';
import {
  Share2, Download, Lock, ChevronDown, ChevronUp,
  Instagram, Linkedin, Facebook, Twitter
} from 'lucide-react';

interface SocialPost {
  id: string;
  post_number: number;
  category: 'educational' | 'promotional' | 'personal';
  caption: string;
  hashtags: string | null;
  platform: 'LinkedIn' | 'Instagram' | 'Facebook' | 'X';
  image_path: string | null;
  week: number;
  day: string;
}

const PLATFORM_CONFIG = {
  LinkedIn: { icon: Linkedin, color: 'text-blue-600', bg: 'bg-blue-50', label: 'LinkedIn' },
  Instagram: { icon: Instagram, color: 'text-pink-600', bg: 'bg-pink-50', label: 'Instagram' },
  Facebook: { icon: Facebook, color: 'text-blue-700', bg: 'bg-blue-50', label: 'Facebook' },
  X: { icon: Twitter, color: 'text-gray-800', bg: 'bg-gray-100', label: 'X (Twitter)' },
};

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
  const [expandedWeek, setExpandedWeek] = useState<number | null>(1);
  const [filterPlatform, setFilterPlatform] = useState<string>('all');

  const hasSocialMediaPack = purchasedServiceIds.includes('social_media_pack');

  useEffect(() => {
    if (!user) return;
    fetchPosts();
  }, [user]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('social_media_posts')
        .select('id, post_number, category, caption, hashtags, platform, image_path, week, day')
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

  const handleImageDownload = async (path: string, name: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('social-media-images')
        .createSignedUrl(path, 3600);

      if (error || !data) {
        console.error('Download error:', error);
        return;
      }

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

  // Group posts by week
  const postsByWeek = posts.reduce((acc, post) => {
    if (!acc[post.week]) acc[post.week] = [];
    acc[post.week].push(post);
    return acc;
  }, {} as Record<number, SocialPost[]>);

  // Filter posts by platform
  const filteredPostsByWeek = Object.entries(postsByWeek).reduce((acc, [week, weekPosts]) => {
    const filtered = filterPlatform === 'all'
      ? weekPosts
      : weekPosts.filter(p => p.platform === filterPlatform);
    if (filtered.length > 0) {
      acc[parseInt(week)] = filtered;
    }
    return acc;
  }, {} as Record<number, SocialPost[]>);

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
            onClick={() => setFilterPlatform('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-inter font-medium transition-colors ${
              filterPlatform === 'all'
                ? 'bg-[#1B3F7A] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Platforms ({posts.length})
          </button>
          {Object.entries(PLATFORM_CONFIG).map(([platform, config]) => {
            const count = posts.filter(p => p.platform === platform).length;
            if (count === 0) return null;
            const Icon = config.icon;
            return (
              <button
                key={platform}
                onClick={() => setFilterPlatform(platform)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-inter font-medium transition-colors ${
                  filterPlatform === platform
                    ? 'bg-[#1B3F7A] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon size={14} />
                {config.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Posts by Week */}
      <div className="space-y-3">
        {Object.entries(filteredPostsByWeek).map(([week, weekPosts]) => (
          <div key={week} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => setExpandedWeek(expandedWeek === parseInt(week) ? null : parseInt(week))}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <span className="font-inter font-semibold text-gray-900">
                Week {week} ({weekPosts.length} posts)
              </span>
              {expandedWeek === parseInt(week) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {expandedWeek === parseInt(week) && (
              <div className="border-t border-gray-200 p-4 space-y-4">
                {weekPosts.map((post) => {
                  const PlatformIcon = PLATFORM_CONFIG[post.platform].icon;
                  const categoryConfig = CATEGORY_CONFIG[post.category];

                  return (
                    <div key={post.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-inter font-semibold text-[#1B3F7A]">#{post.post_number}</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${PLATFORM_CONFIG[post.platform].bg}`}>
                          <PlatformIcon size={12} className={PLATFORM_CONFIG[post.platform].color} />
                          {post.platform}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${categoryConfig.color}`}>
                          {categoryConfig.label}
                        </span>
                        <span className="text-xs text-gray-500">{post.day}</span>
                      </div>
                      <p className="font-inter text-sm text-gray-700 mb-2 whitespace-pre-wrap">{post.caption}</p>
                      {post.hashtags && (
                        <p className="font-inter text-xs text-blue-600 mb-3">{post.hashtags}</p>
                      )}
                      {post.image_path && (
                        <button
                          onClick={() => handleImageDownload(post.image_path!, `post-${post.post_number}.png`)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded text-xs font-inter font-medium hover:bg-purple-100 transition-colors"
                        >
                          <Download size={12} />
                          Download Image
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

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
