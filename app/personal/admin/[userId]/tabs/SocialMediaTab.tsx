'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  Instagram, Linkedin, Facebook, Twitter, Download, AlertCircle, CheckCircle2, Clock,
  ChevronDown, ChevronUp, Send, X, Copy, FileUp, Info, RefreshCw, Image as ImageIcon,
  Filter, Grid2x2 as Grid, List, Video, FileText, Sparkles, ClipboardCopy
} from 'lucide-react';

interface SocialMediaTabProps {
  userId: string;
  data: any;
  refreshData: () => void;
}

interface SocialPost {
  id: string;
  user_id: string;
  post_number: number;
  category: 'educational' | 'promotional' | 'personal';
  caption: string;
  hashtags: string | null;
  image_prompt: string | null;
  platform: 'LinkedIn' | 'Instagram' | 'Facebook' | 'X';
  week: number;
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';
  image_path: string | null;
  video_path: string | null;
  post_type: 'text' | 'image' | 'video';
  status: 'pending' | 'generated' | 'edited' | 'delivered';
  delivered_to_client: boolean;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
}

interface ClientBrief {
  id: string;
  client_id: string;
  brief_content: string;
  status: string;
  generated_at: string;
}

const PLATFORM_CONFIG = {
  LinkedIn: { icon: Linkedin, color: 'text-blue-600', bg: 'bg-blue-50' },
  Instagram: { icon: Instagram, color: 'text-pink-600', bg: 'bg-pink-50' },
  Facebook: { icon: Facebook, color: 'text-blue-700', bg: 'bg-blue-50' },
  X: { icon: Twitter, color: 'text-gray-800', bg: 'bg-gray-100' },
};

const CATEGORY_STYLES = {
  educational: { label: 'Educational', bg: 'bg-purple-50', text: 'text-purple-700' },
  promotional: { label: 'Promotional', bg: 'bg-amber-50', text: 'text-amber-700' },
  personal: { label: 'Personal', bg: 'bg-green-50', text: 'text-green-700' },
};

const POST_TYPE_ICONS = {
  text: FileText,
  image: ImageIcon,
  video: Video,
};

// Social media generation prompt for copying
const SOCIAL_MEDIA_PROMPT = `You are a social media content strategist creating engaging posts for UK small businesses.

OBJECTIVE
Create posts that:
• Build brand awareness
• Demonstrate expertise
• Drive engagement
• Attract ideal clients
• Save time with ready-to-post content

OUTPUT FORMAT
Return a JSON object with this exact structure:
{
  "posts": [
    {
      "postNumber": 1,
      "category": "educational",
      "platform": "LinkedIn",
      "week": 1,
      "day": "Mon",
      "caption": "Full post text ready to copy-paste",
      "hashtags": "#tag1 #tag2 #tag3 #tag4 #tag5",
      "imagePrompt": "1-2 sentence description of the accompanying image"
    }
  ]
}

CONTENT MIX
• 30% Educational posts (tips, insights, how-tos)
• 30% Personal posts (behind-scenes, philosophy, story)
• 40% Promotional posts (services, results, offers)

CAPTION GUIDELINES
• LinkedIn: 200-300 words, professional tone
• Instagram: 100-150 words, visual focus
• Facebook: 150-200 words, community-building
• X: 50-80 words, punchy, conversation-starting

WRITING REQUIREMENTS
• Match the client's brand voice
• Be authentic and specific to their industry
• Avoid generic inspirational quotes
• No hashtags in captions (add separately)`;

export default function SocialMediaTab({ userId, data, refreshData }: SocialMediaTabProps) {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [clientBrief, setClientBrief] = useState<ClientBrief | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingBrief, setLoadingBrief] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const [editingPost, setEditingPost] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<SocialPost>>({});
  const [uploadingAsset, setUploadingAsset] = useState<{ postNumber: number; type: 'image' | 'video' } | null>(null);
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  // Filters
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [weekFilter, setWeekFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get quantity from purchased services
  const purchasedServices = data?.purchasedServices || [];
  const socialMediaService = purchasedServices.find((ps: any) => ps.service_id === 'social_media_pack');
  const postCount = socialMediaService?.social_media_post_count || 30;

  useEffect(() => {
    fetchPosts();
    fetchClientBrief();
  }, [userId]);

  const fetchPosts = async () => {
    setLoading(true);
    const { data: postsData, error } = await supabase
      .from('social_media_posts')
      .select('*')
      .eq('user_id', userId)
      .order('post_number', { ascending: true });

    if (!error && postsData) {
      setPosts(postsData);
    }
    setLoading(false);
  };

  const fetchClientBrief = async () => {
    setLoadingBrief(true);
    const { data: briefData, error } = await supabase
      .from('client_briefs')
      .select('*')
      .eq('client_id', userId)
      .eq('service_id', 'social_media_pack')
      .order('generated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!error && briefData) {
      setClientBrief(briefData);
    }
    setLoadingBrief(false);
  };

  const showMessage = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 4000);
  };

  const handleCopyText = useCallback(async (text: string, postId: string, type: 'caption' | 'hashtags') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPostId(`${postId}-${type}`);
      setTimeout(() => setCopiedPostId(null), 2000);
    } catch {
      showMessage('Failed to copy to clipboard', 'error');
    }
  }, []);

  const handleCopyPrompt = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(SOCIAL_MEDIA_PROMPT);
      showMessage('Prompt copied to clipboard', 'success');
    } catch {
      showMessage('Failed to copy prompt', 'error');
    }
  }, []);

  const handleCopyBrief = useCallback(async () => {
    if (!clientBrief?.brief_content) {
      showMessage('No client brief available', 'error');
      return;
    }
    try {
      await navigator.clipboard.writeText(clientBrief.brief_content);
      showMessage('Client brief copied to clipboard', 'success');
    } catch {
      showMessage('Failed to copy brief', 'error');
    }
  }, [clientBrief]);

  const handleCopyEverything = useCallback(async () => {
    const sections: string[] = [];

    sections.push('# Social Media Content Generation Package');
    sections.push(`Generated: ${new Date().toLocaleString()}`);
    sections.push('');

    sections.push('---');
    sections.push('## GENERATION PROMPT');
    sections.push('');
    sections.push(SOCIAL_MEDIA_PROMPT);
    sections.push('');

    if (clientBrief?.brief_content) {
      sections.push('---');
      sections.push('## CLIENT BRIEF');
      sections.push('');
      sections.push(clientBrief.brief_content);
      sections.push('');
    }

    if (posts.length > 0) {
      sections.push('---');
      sections.push('## EXISTING POSTS');
      sections.push('');
      posts.forEach((post, index) => {
        sections.push(`### Post ${post.post_number}`);
        sections.push(`Platform: ${post.platform}`);
        sections.push(`Category: ${post.category}`);
        sections.push(`Week: ${post.week}, Day: ${post.day}`);
        sections.push('');
        sections.push('Caption:');
        sections.push(post.caption);
        if (post.hashtags) {
          sections.push('');
          sections.push(`Hashtags: ${post.hashtags}`);
        }
        if (post.image_prompt) {
          sections.push('');
          sections.push(`Image Prompt: ${post.image_prompt}`);
        }
        sections.push('');
      });
    }

    try {
      await navigator.clipboard.writeText(sections.join('\n'));
      showMessage('Full package copied to clipboard', 'success');
    } catch {
      showMessage('Failed to copy to clipboard', 'error');
    }
  }, [clientBrief, posts]);

  const handleAssetUpload = async (postNumber: number, file: File, assetType: 'image' | 'video') => {
    setUploadingAsset({ postNumber, type: assetType });
    const post = posts.find(p => p.post_number === postNumber);

    try {
      const ext = file.name.split('.').pop() || (assetType === 'image' ? 'png' : 'mp4');
      const bucket = assetType === 'image' ? 'social-media-images' : 'social-media-videos';
      const storagePath = `${userId}/${postNumber}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(storagePath, file, { contentType: file.type, upsert: true });

      if (uploadError) {
        showMessage(`Upload failed: ${uploadError.message}`, 'error');
        return;
      }

      if (post?.id) {
        const updateData: any = {
          status: post.status === 'pending' ? 'generated' : post.status,
          updated_at: new Date().toISOString()
        };

        if (assetType === 'image') {
          updateData.image_path = storagePath;
          updateData.post_type = 'image';
        } else {
          updateData.video_path = storagePath;
          updateData.post_type = 'video';
        }

        await supabase
          .from('social_media_posts')
          .update(updateData)
          .eq('id', post.id);
      }

      showMessage(`${assetType === 'image' ? 'Image' : 'Video'} uploaded for Post ${postNumber}`, 'success');
      await fetchPosts();
    } catch (err: any) {
      showMessage(err.message || 'Upload failed', 'error');
    } finally {
      setUploadingAsset(null);
    }
  };

  const handleRemoveAsset = async (postNumber: number, assetType: 'image' | 'video') => {
    const post = posts.find(p => p.post_number === postNumber);
    const pathField = assetType === 'image' ? 'image_path' : 'video_path';
    const bucket = assetType === 'image' ? 'social-media-images' : 'social-media-videos';

    if (!post?.[pathField] || !post.id) return;

    await supabase.storage.from(bucket).remove([post[pathField]]);

    const otherAsset = assetType === 'image' ? post.video_path : post.image_path;
    const newPostType = otherAsset
      ? (assetType === 'image' ? 'video' : 'image')
      : 'text';

    await supabase
      .from('social_media_posts')
      .update({
        [pathField]: null,
        post_type: newPostType,
        updated_at: new Date().toISOString()
      })
      .eq('id', post.id);

    showMessage(`${assetType === 'image' ? 'Image' : 'Video'} removed`, 'info');
    await fetchPosts();
  };

  const handleEditPost = async (postNumber: number) => {
    if (!editForm.caption) {
      showMessage('Caption is required', 'error');
      return;
    }

    const post = posts.find(p => p.post_number === postNumber);
    if (!post?.id) return;

    const { error } = await supabase
      .from('social_media_posts')
      .update({
        caption: editForm.caption,
        hashtags: editForm.hashtags || null,
        image_prompt: editForm.image_prompt || null,
        category: editForm.category || post.category,
        platform: editForm.platform || post.platform,
        status: 'edited',
        updated_at: new Date().toISOString()
      })
      .eq('id', post.id);

    if (!error) {
      showMessage('Post updated', 'success');
      setEditingPost(null);
      setEditForm({});
      await fetchPosts();
    } else {
      showMessage('Failed to update post', 'error');
    }
  };

  const handleMarkDelivered = async (postId: string) => {
    const now = new Date().toISOString();
    await supabase
      .from('social_media_posts')
      .update({
        delivered_to_client: true,
        delivered_at: now,
        status: 'delivered',
        updated_at: now
      })
      .eq('id', postId);

    showMessage('Post marked as delivered', 'success');
    await fetchPosts();
    refreshData();
  };

  const handleMarkAllDelivered = async () => {
    const undeliveredPosts = filteredPosts.filter(p => !p.delivered_to_client);
    if (undeliveredPosts.length === 0) {
      showMessage('No posts to deliver', 'info');
      return;
    }

    const now = new Date().toISOString();
    const { error } = await supabase
      .from('social_media_posts')
      .update({
        delivered_to_client: true,
        delivered_at: now,
        status: 'delivered',
        updated_at: now
      })
      .in('id', undeliveredPosts.map(p => p.id));

    if (!error) {
      showMessage(`${undeliveredPosts.length} posts marked as delivered`, 'success');
      await fetchPosts();
      refreshData();
    } else {
      showMessage('Failed to mark posts as delivered', 'error');
    }
  };

  const handleDownloadAsset = async (path: string, postNumber: number, assetType: 'image' | 'video') => {
    const bucket = assetType === 'image' ? 'social-media-images' : 'social-media-videos';
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, 3600);

    if (error || !data) {
      showMessage('Could not generate download link', 'error');
      return;
    }

    const a = document.createElement('a');
    a.href = data.signedUrl;
    a.download = `post-${postNumber}-${assetType}.${path.split('.').pop()}`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Filter posts
  const filteredPosts = posts.filter(post => {
    if (platformFilter !== 'all' && post.platform !== platformFilter) return false;
    if (weekFilter !== 'all' && post.week !== parseInt(weekFilter)) return false;
    return true;
  });

  // Stats
  const deliveredCount = posts.filter(p => p.delivered_to_client).length;
  const generatedCount = posts.filter(p => p.status === 'generated' || p.status === 'edited').length;
  const withImageCount = posts.filter(p => p.image_path).length;
  const withVideoCount = posts.filter(p => p.video_path).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B3F7A]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Message Banner */}
      {message && (
        <div className={`rounded-lg p-4 border flex items-start gap-3 ${
          messageType === 'success' ? 'bg-green-50 border-green-200 text-green-800'
          : messageType === 'error' ? 'bg-red-50 border-red-200 text-red-800'
          : 'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          {messageType === 'success' && <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-green-600" />}
          {messageType === 'error' && <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />}
          {messageType === 'info' && <Info size={16} className="shrink-0 mt-0.5 text-blue-600" />}
          <p className="font-inter text-sm font-medium">{message}</p>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          <div>
            <h3 className="font-inter font-bold text-[#1B3F7A] text-xl mb-1">
              Social Media Posts ({postCount})
            </h3>
            <p className="font-inter text-gray-500 text-sm">
              Manage posts with text, images, and videos. Copy prompts for content generation.
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm shrink-0">
            <div className="text-center">
              <div className="font-inter font-bold text-2xl text-[#1B3F7A]">{posts.length}</div>
              <div className="font-inter text-gray-500 text-xs">Created</div>
            </div>
            <div className="text-center">
              <div className="font-inter font-bold text-2xl text-amber-600">{generatedCount}</div>
              <div className="font-inter text-gray-500 text-xs">Generated</div>
            </div>
            <div className="text-center">
              <div className="font-inter font-bold text-2xl text-green-600">{deliveredCount}</div>
              <div className="font-inter text-gray-500 text-xs">Delivered</div>
            </div>
          </div>
        </div>

        {/* Status badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs ${
            clientBrief ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
          }`}>
            {clientBrief ? <CheckCircle2 size={12} /> : <Clock size={12} />}
            Brief {clientBrief ? 'Ready' : 'Pending'}
          </div>
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs ${
            posts.length >= postCount ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'
          }`}>
            {posts.length}/{postCount} Posts
          </div>
          {withImageCount > 0 && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded text-xs bg-purple-50 text-purple-700">
              <ImageIcon size={12} />
              {withImageCount} Images
            </div>
          )}
          {withVideoCount > 0 && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded text-xs bg-blue-50 text-blue-700">
              <Video size={12} />
              {withVideoCount} Videos
            </div>
          )}
        </div>

        {/* Clipboard Workflow */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
          <button
            onClick={handleCopyPrompt}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-inter font-medium transition-colors"
          >
            <Sparkles size={13} />
            Copy Prompt
          </button>
          <button
            onClick={handleCopyBrief}
            disabled={!clientBrief}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-inter font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Copy size={13} />
            Copy Brief
          </button>
          <button
            onClick={handleCopyEverything}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1B3F7A] hover:bg-[#2C68C4] text-white rounded text-xs font-inter font-medium transition-colors"
          >
            <ClipboardCopy size={13} />
            Copy Everything
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={16} className="text-gray-500" />
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-md text-sm font-inter bg-white"
            >
              <option value="all">All Platforms</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Instagram">Instagram</option>
              <option value="Facebook">Facebook</option>
              <option value="X">X</option>
            </select>
            <select
              value={weekFilter}
              onChange={(e) => setWeekFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-md text-sm font-inter bg-white"
            >
              <option value="all">All Weeks</option>
              {[1, 2, 3, 4, 5, 6].map(w => (
                <option key={w} value={w}>Week {w}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <div className="flex border border-gray-200 rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1.5 ${viewMode === 'grid' ? 'bg-[#1B3F7A] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-2.5 py-1.5 ${viewMode === 'list' ? 'bg-[#1B3F7A] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <List size={16} />
              </button>
            </div>
            {deliveredCount < posts.length && posts.length > 0 && (
              <button
                onClick={handleMarkAllDelivered}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-inter font-medium transition-colors"
              >
                <Send size={13} />
                Deliver All ({posts.length - deliveredCount})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Posts Grid/List */}
      {posts.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <ImageIcon size={40} className="text-gray-400 mx-auto mb-4" />
          <p className="font-inter text-gray-600 mb-2">No posts created yet</p>
          <p className="font-inter text-gray-500 text-sm mb-4">
            Use the "Copy Prompt" and "Copy Brief" buttons above, then paste into Claude or ChatGPT to generate posts.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPosts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              isExpanded={expandedPost === post.post_number}
              isEditing={editingPost === post.post_number}
              editForm={editForm}
              uploadingAsset={uploadingAsset}
              copiedPostId={copiedPostId}
              onToggleExpand={() => setExpandedPost(expandedPost === post.post_number ? null : post.post_number)}
              onEdit={() => {
                setEditingPost(editingPost === post.post_number ? null : post.post_number);
                setEditForm({
                  caption: post.caption,
                  hashtags: post.hashtags || '',
                  image_prompt: post.image_prompt || '',
                  category: post.category,
                  platform: post.platform
                });
              }}
              onCancelEdit={() => {
                setEditingPost(null);
                setEditForm({});
              }}
              onSaveEdit={() => handleEditPost(post.post_number)}
              onEditFormChange={setEditForm}
              onCopyText={handleCopyText}
              onAssetUpload={(file, type) => handleAssetUpload(post.post_number, file, type)}
              onRemoveAsset={(type) => handleRemoveAsset(post.post_number, type)}
              onDownloadAsset={(type) => {
                const path = type === 'image' ? post.image_path : post.video_path;
                if (path) handleDownloadAsset(path, post.post_number, type);
              }}
              onMarkDelivered={() => handleMarkDelivered(post.id)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPosts.map(post => (
            <PostListItem
              key={post.id}
              post={post}
              isExpanded={expandedPost === post.post_number}
              isEditing={editingPost === post.post_number}
              editForm={editForm}
              uploadingAsset={uploadingAsset}
              copiedPostId={copiedPostId}
              onToggleExpand={() => setExpandedPost(expandedPost === post.post_number ? null : post.post_number)}
              onEdit={() => {
                setEditingPost(editingPost === post.post_number ? null : post.post_number);
                setEditForm({
                  caption: post.caption,
                  hashtags: post.hashtags || '',
                  image_prompt: post.image_prompt || '',
                  category: post.category,
                  platform: post.platform
                });
              }}
              onCancelEdit={() => {
                setEditingPost(null);
                setEditForm({});
              }}
              onSaveEdit={() => handleEditPost(post.post_number)}
              onEditFormChange={setEditForm}
              onCopyText={handleCopyText}
              onAssetUpload={(file, type) => handleAssetUpload(post.post_number, file, type)}
              onRemoveAsset={(type) => handleRemoveAsset(post.post_number, type)}
              onDownloadAsset={(type) => {
                const path = type === 'image' ? post.image_path : post.video_path;
                if (path) handleDownloadAsset(path, post.post_number, type);
              }}
              onMarkDelivered={() => handleMarkDelivered(post.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Post Card Component (Grid View) ───────────────────────────────────────────

function PostCard({
  post,
  isExpanded,
  isEditing,
  editForm,
  uploadingAsset,
  copiedPostId,
  onToggleExpand,
  onEdit,
  onCancelEdit,
  onSaveEdit,
  onEditFormChange,
  onCopyText,
  onAssetUpload,
  onRemoveAsset,
  onDownloadAsset,
  onMarkDelivered,
}: {
  post: SocialPost;
  isExpanded: boolean;
  isEditing: boolean;
  editForm: Partial<SocialPost>;
  uploadingAsset: { postNumber: number; type: 'image' | 'video' } | null;
  copiedPostId: string | null;
  onToggleExpand: () => void;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onEditFormChange: (form: Partial<SocialPost>) => void;
  onCopyText: (text: string, postId: string, type: 'caption' | 'hashtags') => void;
  onAssetUpload: (file: File, type: 'image' | 'video') => void;
  onRemoveAsset: (type: 'image' | 'video') => void;
  onDownloadAsset: (type: 'image' | 'video') => void;
  onMarkDelivered: () => void;
}) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const PlatformIcon = PLATFORM_CONFIG[post.platform].icon;
  const categoryStyle = CATEGORY_STYLES[post.category];
  const PostTypeIcon = POST_TYPE_ICONS[post.post_type];
  const isUploadingImage = uploadingAsset?.postNumber === post.post_number && uploadingAsset?.type === 'image';
  const isUploadingVideo = uploadingAsset?.postNumber === post.post_number && uploadingAsset?.type === 'video';

  return (
    <div className={`bg-white rounded-lg border overflow-hidden transition-shadow ${isExpanded ? 'border-[#1B3F7A] border-opacity-40 shadow-sm' : 'border-gray-200'}`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="font-inter font-bold text-[#1B3F7A] text-sm">#{post.post_number}</span>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${categoryStyle.bg} ${categoryStyle.text}`}>
              {categoryStyle.label}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className={`p-1 rounded ${post.post_type === 'video' ? 'bg-blue-50' : post.post_type === 'image' ? 'bg-purple-50' : 'bg-gray-50'}`}>
              <PostTypeIcon size={12} className={post.post_type === 'video' ? 'text-blue-600' : post.post_type === 'image' ? 'text-purple-600' : 'text-gray-500'} />
            </div>
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded ${PLATFORM_CONFIG[post.platform].bg}`}>
              <PlatformIcon size={12} className={PLATFORM_CONFIG[post.platform].color} />
              <span className="text-xs font-medium text-gray-700">{post.platform}</span>
            </div>
          </div>
        </div>

        {/* Week/Day */}
        <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
          <span>Week {post.week}</span>
          <span className="text-gray-300">|</span>
          <span>{post.day}</span>
        </div>

        {/* Status badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.delivered_to_client && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs font-medium">
              <Send size={10} /> Delivered
            </span>
          )}
          {post.status === 'edited' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-600 rounded text-xs font-medium">
              Edited
            </span>
          )}
        </div>

        {/* Caption preview */}
        <p className="font-inter text-sm text-gray-700 line-clamp-3 mb-3">
          {isEditing ? (
            <textarea
              value={editForm.caption || ''}
              onChange={(e) => onEditFormChange({ ...editForm, caption: e.target.value })}
              className="w-full p-2 border border-gray-200 rounded text-sm font-inter min-h-[100px]"
              placeholder="Caption..."
            />
          ) : (
            post.caption
          )}
        </p>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
          {!isEditing ? (
            <>
              <button
                onClick={() => onCopyText(post.caption, post.id, 'caption')}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-inter transition-colors"
              >
                {copiedPostId === `${post.id}-caption` ? <CheckCircle2 size={12} /> : <Copy size={12} />}
                Copy
              </button>
              <button
                onClick={onEdit}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-inter transition-colors"
              >
                Edit
              </button>
              <button
                onClick={onToggleExpand}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-inter transition-colors"
              >
                {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                {isExpanded ? 'Less' : 'More'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onSaveEdit}
                className="inline-flex items-center gap-1 px-2 py-1 bg-[#1B3F7A] hover:bg-[#2C68C4] text-white rounded text-xs font-inter transition-colors"
              >
                Save
              </button>
              <button
                onClick={onCancelEdit}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-inter transition-colors"
              >
                <X size={12} />
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4 bg-[#FAFBFC] space-y-4">
          {/* Hashtags */}
          <div>
            <label className="font-inter text-xs font-medium text-gray-500 mb-1 block">Hashtags</label>
            {isEditing ? (
              <textarea
                value={editForm.hashtags || ''}
                onChange={(e) => onEditFormChange({ ...editForm, hashtags: e.target.value })}
                className="w-full p-2 border border-gray-200 rounded text-sm font-inter min-h-[60px]"
                placeholder="Hashtags..."
              />
            ) : (
              <p className="font-inter text-sm text-gray-700">{post.hashtags || 'No hashtags'}</p>
            )}
          </div>

          {/* Image Prompt */}
          <div>
            <label className="font-inter text-xs font-medium text-gray-500 mb-1 block">Image Prompt</label>
            {isEditing ? (
              <textarea
                value={editForm.image_prompt || ''}
                onChange={(e) => onEditFormChange({ ...editForm, image_prompt: e.target.value })}
                className="w-full p-2 border border-gray-200 rounded text-sm font-inter min-h-[60px]"
                placeholder="Image prompt..."
              />
            ) : (
              <p className="font-inter text-sm text-gray-700">{post.image_prompt || 'No image prompt'}</p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="font-inter text-xs font-medium text-gray-500 mb-2 block">Image</label>
            {post.image_path ? (
              <div className="flex items-center justify-between gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-purple-50 flex items-center justify-center">
                    <ImageIcon size={14} className="text-purple-600" />
                  </div>
                  <span className="font-inter text-xs text-gray-700">Image uploaded</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => onDownloadAsset('image')} className="p-1.5 text-gray-500 hover:text-[#1B3F7A] hover:bg-gray-100 rounded" title="Download">
                    <Download size={13} />
                  </button>
                  <button onClick={() => imageInputRef.current?.click()} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded" title="Replace">
                    <RefreshCw size={13} />
                  </button>
                  <button onClick={() => onRemoveAsset('image')} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded" title="Remove">
                    <X size={13} />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => !isUploadingImage && imageInputRef.current?.click()}
                className={`flex flex-col items-center justify-center gap-1.5 border-2 border-dashed rounded-lg px-3 py-3 cursor-pointer transition-colors
                  ${isUploadingImage ? 'border-purple-300 bg-purple-50 cursor-wait' : 'border-gray-300 bg-white hover:border-purple-400 hover:bg-purple-50'}`}
              >
                {isUploadingImage ? (
                  <>
                    <RefreshCw size={14} className="text-purple-500 animate-spin" />
                    <p className="font-inter text-xs text-purple-600 font-medium">Uploading...</p>
                  </>
                ) : (
                  <>
                    <ImageIcon size={14} className="text-gray-400" />
                    <p className="font-inter text-xs text-gray-600 font-medium">Upload Image</p>
                  </>
                )}
              </div>
            )}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onAssetUpload(file, 'image');
              }}
            />
          </div>

          {/* Video Upload */}
          <div>
            <label className="font-inter text-xs font-medium text-gray-500 mb-2 block">Video</label>
            {post.video_path ? (
              <div className="flex items-center justify-between gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-blue-50 flex items-center justify-center">
                    <Video size={14} className="text-blue-600" />
                  </div>
                  <span className="font-inter text-xs text-gray-700">Video uploaded</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => onDownloadAsset('video')} className="p-1.5 text-gray-500 hover:text-[#1B3F7A] hover:bg-gray-100 rounded" title="Download">
                    <Download size={13} />
                  </button>
                  <button onClick={() => videoInputRef.current?.click()} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded" title="Replace">
                    <RefreshCw size={13} />
                  </button>
                  <button onClick={() => onRemoveAsset('video')} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded" title="Remove">
                    <X size={13} />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => !isUploadingVideo && videoInputRef.current?.click()}
                className={`flex flex-col items-center justify-center gap-1.5 border-2 border-dashed rounded-lg px-3 py-3 cursor-pointer transition-colors
                  ${isUploadingVideo ? 'border-blue-300 bg-blue-50 cursor-wait' : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50'}`}
              >
                {isUploadingVideo ? (
                  <>
                    <RefreshCw size={14} className="text-blue-500 animate-spin" />
                    <p className="font-inter text-xs text-blue-600 font-medium">Uploading...</p>
                  </>
                ) : (
                  <>
                    <Video size={14} className="text-gray-400" />
                    <p className="font-inter text-xs text-gray-600 font-medium">Upload Video</p>
                  </>
                )}
              </div>
            )}
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onAssetUpload(file, 'video');
              }}
            />
          </div>

          {/* Deliver button */}
          {!post.delivered_to_client && (
            <button
              onClick={onMarkDelivered}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-inter font-medium transition-colors"
            >
              <Send size={13} />
              Deliver to Client
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Post List Item Component (List View) ───────────────────────────────────────

function PostListItem({
  post,
  isExpanded,
  isEditing,
  editForm,
  uploadingAsset,
  copiedPostId,
  onToggleExpand,
  onEdit,
  onCancelEdit,
  onSaveEdit,
  onEditFormChange,
  onCopyText,
  onAssetUpload,
  onRemoveAsset,
  onDownloadAsset,
  onMarkDelivered,
}: {
  post: SocialPost;
  isExpanded: boolean;
  isEditing: boolean;
  editForm: Partial<SocialPost>;
  uploadingAsset: { postNumber: number; type: 'image' | 'video' } | null;
  copiedPostId: string | null;
  onToggleExpand: () => void;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onEditFormChange: (form: Partial<SocialPost>) => void;
  onCopyText: (text: string, postId: string, type: 'caption' | 'hashtags') => void;
  onAssetUpload: (file: File, type: 'image' | 'video') => void;
  onRemoveAsset: (type: 'image' | 'video') => void;
  onDownloadAsset: (type: 'image' | 'video') => void;
  onMarkDelivered: () => void;
}) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const PlatformIcon = PLATFORM_CONFIG[post.platform].icon;
  const categoryStyle = CATEGORY_STYLES[post.category];
  const PostTypeIcon = POST_TYPE_ICONS[post.post_type];
  const isUploadingImage = uploadingAsset?.postNumber === post.post_number && uploadingAsset?.type === 'image';
  const isUploadingVideo = uploadingAsset?.postNumber === post.post_number && uploadingAsset?.type === 'video';

  return (
    <div className={`bg-white rounded-lg border overflow-hidden ${isExpanded ? 'border-[#1B3F7A] border-opacity-40' : 'border-gray-200'}`}>
      <div className="p-4">
        <div className="flex items-center gap-4">
          {/* Post number */}
          <div className="font-inter font-bold text-[#1B3F7A] text-lg w-12 text-center shrink-0">
            #{post.post_number}
          </div>

          {/* Category, Platform & Type */}
          <div className="flex flex-col gap-1 shrink-0">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${categoryStyle.bg} ${categoryStyle.text}`}>
              {categoryStyle.label}
            </span>
            <div className="flex items-center gap-1">
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded ${PLATFORM_CONFIG[post.platform].bg}`}>
                <PlatformIcon size={12} className={PLATFORM_CONFIG[post.platform].color} />
                <span className="text-xs font-medium text-gray-700">{post.platform}</span>
              </div>
              <div className={`p-1 rounded ${post.post_type === 'video' ? 'bg-blue-50' : post.post_type === 'image' ? 'bg-purple-50' : 'bg-gray-50'}`}>
                <PostTypeIcon size={12} className={post.post_type === 'video' ? 'text-blue-600' : post.post_type === 'image' ? 'text-purple-600' : 'text-gray-500'} />
              </div>
            </div>
          </div>

          {/* Caption preview */}
          <div className="flex-1 min-w-0">
            <p className="font-inter text-sm text-gray-700 line-clamp-2">
              {post.caption}
            </p>
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
              <span>Week {post.week}, {post.day}</span>
              {post.image_path && <span className="text-purple-600">+Image</span>}
              {post.video_path && <span className="text-blue-600">+Video</span>}
              {post.delivered_to_client && <span className="text-blue-600">Delivered</span>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onCopyText(post.caption, post.id, 'caption')}
              className="inline-flex items-center gap-1 px-2 py-1 bg-[#1B3F7A] hover:bg-[#2C68C4] text-white rounded text-xs font-inter transition-colors"
            >
              {copiedPostId === `${post.id}-caption` ? <CheckCircle2 size={12} /> : <Copy size={12} />}
              Copy
            </button>
            <button
              onClick={onToggleExpand}
              className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded text-xs font-inter transition-colors"
            >
              {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              {isExpanded ? 'Less' : 'More'}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4 bg-[#FAFBFC] space-y-4">
          {isEditing ? (
            <>
              <div>
                <label className="font-inter text-xs font-medium text-gray-500 mb-1 block">Caption</label>
                <textarea
                  value={editForm.caption || ''}
                  onChange={(e) => onEditFormChange({ ...editForm, caption: e.target.value })}
                  className="w-full p-2 border border-gray-200 rounded text-sm font-inter min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-inter text-xs font-medium text-gray-500 mb-1 block">Hashtags</label>
                  <textarea
                    value={editForm.hashtags || ''}
                    onChange={(e) => onEditFormChange({ ...editForm, hashtags: e.target.value })}
                    className="w-full p-2 border border-gray-200 rounded text-sm font-inter min-h-[60px]"
                  />
                </div>
                <div>
                  <label className="font-inter text-xs font-medium text-gray-500 mb-1 block">Image Prompt</label>
                  <textarea
                    value={editForm.image_prompt || ''}
                    onChange={(e) => onEditFormChange({ ...editForm, image_prompt: e.target.value })}
                    className="w-full p-2 border border-gray-200 rounded text-sm font-inter min-h-[60px]"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                <button
                  onClick={onSaveEdit}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1B3F7A] hover:bg-[#2C68C4] text-white rounded text-xs font-inter font-medium transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={onCancelEdit}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded text-xs font-inter font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="font-inter text-xs font-medium text-gray-500 mb-1 block">Full Caption</label>
                <p className="font-inter text-sm text-gray-700 bg-white p-3 rounded border border-gray-200">
                  {post.caption}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-inter text-xs font-medium text-gray-500 mb-1 block">Hashtags</label>
                  <p className="font-inter text-sm text-gray-700 bg-white p-3 rounded border border-gray-200">
                    {post.hashtags || 'No hashtags'}
                  </p>
                </div>
                <div>
                  <label className="font-inter text-xs font-medium text-gray-500 mb-1 block">Image Prompt</label>
                  <p className="font-inter text-sm text-gray-700 bg-white p-3 rounded border border-gray-200">
                    {post.image_prompt || 'No image prompt'}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Image Upload */}
          <div>
            <label className="font-inter text-xs font-medium text-gray-500 mb-2 block">Image</label>
            {post.image_path ? (
              <div className="flex items-center justify-between gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-purple-50 flex items-center justify-center">
                    <ImageIcon size={14} className="text-purple-600" />
                  </div>
                  <span className="font-inter text-xs text-gray-700">Image uploaded</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => onDownloadAsset('image')} className="p-1.5 text-gray-500 hover:text-[#1B3F7A] hover:bg-gray-100 rounded">
                    <Download size={14} />
                  </button>
                  <button onClick={() => imageInputRef.current?.click()} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded">
                    <RefreshCw size={14} />
                  </button>
                  <button onClick={() => onRemoveAsset('image')} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded">
                    <X size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => !isUploadingImage && imageInputRef.current?.click()}
                className={`flex items-center justify-center gap-2 border-2 border-dashed rounded-lg px-3 py-3 cursor-pointer transition-colors
                  ${isUploadingImage ? 'border-purple-300 bg-purple-50 cursor-wait' : 'border-gray-300 bg-white hover:border-purple-400 hover:bg-purple-50'}`}
              >
                {isUploadingImage ? (
                  <>
                    <RefreshCw size={14} className="text-purple-500 animate-spin" />
                    <p className="font-inter text-xs text-purple-600 font-medium">Uploading...</p>
                  </>
                ) : (
                  <>
                    <ImageIcon size={14} className="text-gray-400" />
                    <p className="font-inter text-xs text-gray-600 font-medium">Upload Image</p>
                  </>
                )}
              </div>
            )}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onAssetUpload(file, 'image');
              }}
            />
          </div>

          {/* Video Upload */}
          <div>
            <label className="font-inter text-xs font-medium text-gray-500 mb-2 block">Video</label>
            {post.video_path ? (
              <div className="flex items-center justify-between gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-blue-50 flex items-center justify-center">
                    <Video size={14} className="text-blue-600" />
                  </div>
                  <span className="font-inter text-xs text-gray-700">Video uploaded</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => onDownloadAsset('video')} className="p-1.5 text-gray-500 hover:text-[#1B3F7A] hover:bg-gray-100 rounded">
                    <Download size={14} />
                  </button>
                  <button onClick={() => videoInputRef.current?.click()} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded">
                    <RefreshCw size={14} />
                  </button>
                  <button onClick={() => onRemoveAsset('video')} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded">
                    <X size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => !isUploadingVideo && videoInputRef.current?.click()}
                className={`flex items-center justify-center gap-2 border-2 border-dashed rounded-lg px-3 py-3 cursor-pointer transition-colors
                  ${isUploadingVideo ? 'border-blue-300 bg-blue-50 cursor-wait' : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50'}`}
              >
                {isUploadingVideo ? (
                  <>
                    <RefreshCw size={14} className="text-blue-500 animate-spin" />
                    <p className="font-inter text-xs text-blue-600 font-medium">Uploading...</p>
                  </>
                ) : (
                  <>
                    <Video size={14} className="text-gray-400" />
                    <p className="font-inter text-xs text-gray-600 font-medium">Upload Video</p>
                  </>
                )}
              </div>
            )}
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onAssetUpload(file, 'video');
              }}
            />
          </div>

          {/* Actions */}
          {!isEditing && (
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <button
                onClick={onEdit}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded text-xs font-inter font-medium transition-colors"
              >
                Edit Post
              </button>
              {!post.delivered_to_client && (
                <button
                  onClick={onMarkDelivered}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-inter font-medium transition-colors"
                >
                  <Send size={13} />
                  Deliver to Client
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
