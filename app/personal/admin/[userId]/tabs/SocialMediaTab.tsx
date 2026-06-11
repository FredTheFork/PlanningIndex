'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  Instagram, Linkedin, Facebook, Twitter, Download, AlertCircle, CheckCircle2, Clock,
  ChevronDown, ChevronUp, Send, X, Copy, FileUp, Info, RefreshCw, Image as ImageIcon,
  Video, FileText, Sparkles, ClipboardCopy, Plus, Trash2, Images
} from 'lucide-react';
import {
  PlatformId, PLATFORM_SPECS, extractSelectedPlatforms,
  validateImageDimensions, ALL_PLATFORM_IDS, getPrimaryImageSpec
} from '@/lib/social-platforms';

// ── Platform icon map ────────────────────────────────────────────────────────
const PLATFORM_ICON_MAP: Record<PlatformId, React.ElementType> = {
  LinkedIn: Linkedin,
  Instagram: Instagram,
  Facebook: Facebook,
  X: Twitter,
  TikTok: FileText,     // no TikTok icon in lucide
  Pinterest: FileText,  // no Pinterest icon in lucide
};

// ── Types ────────────────────────────────────────────────────────────────────
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
  platform: PlatformId;
  week: number;
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';
  image_path: string | null;
  video_path: string | null;
  post_type: 'text' | 'image' | 'video';
  image_dimensions: string | null;
  carousel_paths: string[] | null;
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

const CATEGORY_STYLES = {
  educational: { label: 'Educational', bg: 'bg-purple-50', text: 'text-purple-700' },
  promotional: { label: 'Promotional', bg: 'bg-amber-50', text: 'text-amber-700' },
  personal: { label: 'Personal', bg: 'bg-green-50', text: 'text-green-700' },
};

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
• TikTok: 100-150 words, casual, trendy
• Pinterest: 50-80 words, keyword-rich, descriptive

WRITING REQUIREMENTS
• Match the client's brand voice
• Be authentic and specific to their industry
• Avoid generic inspirational quotes
• No hashtags in captions (add separately)`;

// ── Main Component ───────────────────────────────────────────────────────────
export default function SocialMediaTab({ userId, data, refreshData }: SocialMediaTabProps) {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [clientBrief, setClientBrief] = useState<ClientBrief | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingBrief, setLoadingBrief] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');

  // Platform tabs
  const [activePlatform, setActivePlatform] = useState<PlatformId | 'all'>('all');
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformId[]>([]);

  // Expanded / editing state
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<SocialPost>>({});

  // Upload state — tracks in-progress uploads by post id
  const [uploadProgress, setUploadProgress] = useState<Record<string, { type: 'image' | 'video' | 'carousel'; progress: number }>>({});
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  // Get quantity from purchased services
  const purchasedServices = data?.purchasedServices || [];
  const socialMediaService = purchasedServices.find((ps: any) => ps.service_id === 'social_media_pack');
  const postCount = socialMediaService?.social_media_post_count || 30;

  // Extract platforms from intake on mount
  useEffect(() => {
    const platforms = extractSelectedPlatforms(data?.intakeResponses);
    if (platforms.length > 0) {
      setSelectedPlatforms(platforms);
      setActivePlatform(platforms[0]);
    } else {
      setSelectedPlatforms([...ALL_PLATFORM_IDS]);
      setActivePlatform('all');
    }
  }, [data?.intakeResponses]);

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
      posts.forEach((post) => {
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

  // ── Upload handlers ──────────────────────────────────────────────────────
  const handleAssetUpload = async (post: SocialPost, file: File, assetType: 'image' | 'video') => {
    const spec = PLATFORM_SPECS[post.platform];
    const key = `${post.id}-${assetType}`;
    setUploadProgress(prev => ({ ...prev, [key]: { type: assetType, progress: 0 } }));

    try {
      // Validate MIME type
      if (assetType === 'image' && !spec.acceptedImageMimeTypes.includes(file.type)) {
        showMessage(`Invalid image format for ${spec.label}. Accepted: ${spec.acceptedImageMimeTypes.join(', ')}`, 'error');
        setUploadProgress(prev => { const next = { ...prev }; delete next[key]; return next; });
        return;
      }
      if (assetType === 'video' && spec.videoSpec && !spec.videoSpec.acceptedMimeTypes.includes(file.type)) {
        showMessage(`Invalid video format for ${spec.label}. Accepted: ${spec.videoSpec.acceptedMimeTypes.join(', ')}`, 'error');
        setUploadProgress(prev => { const next = { ...prev }; delete next[key]; return next; });
        return;
      }

      // Validate file size
      const maxMB = assetType === 'image' ? spec.maxImageFileSizeMB : (spec.videoSpec?.maxFileSizeMB ?? 50);
      if (file.size > maxMB * 1024 * 1024) {
        showMessage(`File too large for ${spec.label}. Max: ${maxMB}MB`, 'error');
        setUploadProgress(prev => { const next = { ...prev }; delete next[key]; return next; });
        return;
      }

      // Validate image dimensions
      let dimensions = '';
      if (assetType === 'image') {
        const result = await validateImageDimensions(file, post.platform);
        if (result.width && result.height) {
          dimensions = `${result.width}x${result.height}`;
          if (result.guidance) {
            showMessage(result.guidance, 'info');
          }
        }
      }

      const ext = file.name.split('.').pop() || (assetType === 'image' ? 'png' : 'mp4');
      const bucket = assetType === 'image' ? 'social-media-images' : 'social-media-videos';
      const storagePath = `${userId}/${post.platform}/${post.post_number}_${Date.now()}.${ext}`;

      setUploadProgress(prev => ({ ...prev, [key]: { type: assetType, progress: 30 } }));

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(storagePath, file, { contentType: file.type, upsert: true });

      if (uploadError) {
        showMessage(`Upload failed: ${uploadError.message}`, 'error');
        setUploadProgress(prev => { const next = { ...prev }; delete next[key]; return next; });
        return;
      }

      setUploadProgress(prev => ({ ...prev, [key]: { type: assetType, progress: 80 } }));

      if (post.id) {
        const updateData: any = {
          status: post.status === 'pending' ? 'generated' : post.status,
          updated_at: new Date().toISOString()
        };
        if (assetType === 'image') {
          updateData.image_path = storagePath;
          updateData.post_type = 'image';
          if (dimensions) updateData.image_dimensions = dimensions;
        } else {
          updateData.video_path = storagePath;
          updateData.post_type = 'video';
        }
        await supabase.from('social_media_posts').update(updateData).eq('id', post.id);
      }

      setUploadProgress(prev => { const next = { ...prev }; delete next[key]; return next; });
      showMessage(`${assetType === 'image' ? 'Image' : 'Video'} uploaded for Post ${post.post_number}`, 'success');
      await fetchPosts();
    } catch (err: any) {
      showMessage(err.message || 'Upload failed', 'error');
      setUploadProgress(prev => { const next = { ...prev }; delete next[key]; return next; });
    }
  };

  const handleCarouselUpload = async (post: SocialPost, files: File[]) => {
    const spec = PLATFORM_SPECS[post.platform];
    const maxSlides = spec.carouselMaxSlides || 10;
    const currentCount = post.carousel_paths?.length ?? 0;
    if (currentCount + files.length > maxSlides) {
      showMessage(`${spec.label} carousels support up to ${maxSlides} slides. You have ${currentCount} already.`, 'error');
      return;
    }

    const newPaths: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const key = `${post.id}-carousel-${i}`;
      setUploadProgress(prev => ({ ...prev, [key]: { type: 'carousel', progress: 0 } }));

      if (!spec.acceptedImageMimeTypes.includes(file.type)) {
        showMessage(`Invalid format for slide ${i + 1}`, 'error');
        setUploadProgress(prev => { const next = { ...prev }; delete next[key]; return next; });
        continue;
      }
      if (file.size > spec.maxImageFileSizeMB * 1024 * 1024) {
        showMessage(`Slide ${i + 1} exceeds ${spec.maxImageFileSizeMB}MB`, 'error');
        setUploadProgress(prev => { const next = { ...prev }; delete next[key]; return next; });
        continue;
      }

      const ext = file.name.split('.').pop() || 'png';
      const storagePath = `${userId}/${post.platform}/carousel_${post.post_number}_${currentCount + i}_${Date.now()}.${ext}`;

      setUploadProgress(prev => ({ ...prev, [key]: { type: 'carousel', progress: 50 } }));

      const { error } = await supabase.storage
        .from('social-media-images')
        .upload(storagePath, file, { contentType: file.type, upsert: true });

      if (error) {
        showMessage(`Failed to upload slide ${i + 1}: ${error.message}`, 'error');
      } else {
        newPaths.push(storagePath);
      }

      setUploadProgress(prev => { const next = { ...prev }; delete next[key]; return next; });
    }

    if (newPaths.length > 0 && post.id) {
      const merged = [...(post.carousel_paths || []), ...newPaths];
      await supabase
        .from('social_media_posts')
        .update({
          carousel_paths: merged,
          post_type: 'image',
          status: post.status === 'pending' ? 'generated' : post.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', post.id);

      showMessage(`${newPaths.length} carousel slide(s) uploaded`, 'success');
      await fetchPosts();
    }
  };

  const handleRemoveCarouselSlide = async (post: SocialPost, index: number) => {
    if (!post.carousel_paths || !post.id) return;
    const pathToRemove = post.carousel_paths[index];

    await supabase.storage.from('social-media-images').remove([pathToRemove]);

    const updated = post.carousel_paths.filter((_, i) => i !== index);
    const newPostType = updated.length > 0 ? 'image' : (post.video_path ? 'video' : (post.image_path ? 'image' : 'text'));

    await supabase
      .from('social_media_posts')
      .update({
        carousel_paths: updated,
        post_type: newPostType,
        updated_at: new Date().toISOString()
      })
      .eq('id', post.id);

    showMessage('Carousel slide removed', 'info');
    await fetchPosts();
  };

  const handleRemoveAsset = async (post: SocialPost, assetType: 'image' | 'video') => {
    const pathField = assetType === 'image' ? 'image_path' : 'video_path';
    const bucket = assetType === 'image' ? 'social-media-images' : 'social-media-videos';
    const path = post[pathField];
    if (!path || !post.id) return;

    await supabase.storage.from(bucket).remove([path]);

    const otherAsset = assetType === 'image' ? post.video_path : post.image_path;
    const hasCarousel = (post.carousel_paths?.length ?? 0) > 0;
    const newPostType = otherAsset ? (assetType === 'image' ? 'video' : 'image') : hasCarousel ? 'image' : 'text';

    await supabase
      .from('social_media_posts')
      .update({
        [pathField]: null,
        ...(assetType === 'image' ? { image_dimensions: null } : {}),
        post_type: newPostType,
        updated_at: new Date().toISOString()
      })
      .eq('id', post.id);

    showMessage(`${assetType === 'image' ? 'Image' : 'Video'} removed`, 'info');
    await fetchPosts();
  };

  const handleEditPost = async (postId: string) => {
    if (!editForm.caption) {
      showMessage('Caption is required', 'error');
      return;
    }
    const post = posts.find(p => p.id === postId);
    if (!post) return;

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
      .eq('id', postId);

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
      .update({ delivered_to_client: true, delivered_at: now, status: 'delivered', updated_at: now })
      .eq('id', postId);
    showMessage('Post marked as delivered', 'success');
    await fetchPosts();
    refreshData();
  };

  const handleDeliverAllForPlatform = async (platform: PlatformId) => {
    const undelivered = posts.filter(p => p.platform === platform && !p.delivered_to_client);
    const emptyCaption = undelivered.filter(p => !p.caption.trim());
    if (emptyCaption.length > 0) {
      showMessage(`${emptyCaption.length} post(s) on ${PLATFORM_SPECS[platform].label} have empty captions — please fill them before delivering`, 'error');
      return;
    }
    if (undelivered.length === 0) {
      showMessage(`No undelivered posts for ${PLATFORM_SPECS[platform].label}`, 'info');
      return;
    }
    const now = new Date().toISOString();
    const { error } = await supabase
      .from('social_media_posts')
      .update({ delivered_to_client: true, delivered_at: now, status: 'delivered', updated_at: now })
      .in('id', undelivered.map(p => p.id));
    if (!error) {
      showMessage(`${undelivered.length} ${PLATFORM_SPECS[platform].label} posts delivered`, 'success');
      await fetchPosts();
      refreshData();
    } else {
      showMessage('Failed to deliver posts', 'error');
    }
  };

  const handleDeliverAll = async () => {
    const undelivered = posts.filter(p => !p.delivered_to_client);
    const emptyCaption = undelivered.filter(p => !p.caption.trim());
    if (emptyCaption.length > 0) {
      showMessage(`${emptyCaption.length} post(s) have empty captions — please fill them before delivering`, 'error');
      return;
    }
    if (undelivered.length === 0) {
      showMessage('No posts to deliver', 'info');
      return;
    }
    const now = new Date().toISOString();
    const { error } = await supabase
      .from('social_media_posts')
      .update({ delivered_to_client: true, delivered_at: now, status: 'delivered', updated_at: now })
      .in('id', undelivered.map(p => p.id));
    if (!error) {
      showMessage(`${undelivered.length} posts delivered`, 'success');
      await fetchPosts();
      refreshData();
    } else {
      showMessage('Failed to deliver posts', 'error');
    }
  };

  const handleDownloadAsset = async (path: string, postNumber: number, assetType: 'image' | 'video') => {
    const bucket = assetType === 'image' ? 'social-media-images' : 'social-media-videos';
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 3600);
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

  // Filter posts by active platform tab
  const visiblePosts = activePlatform === 'all'
    ? posts
    : posts.filter(p => p.platform === activePlatform);

  // Group by platform for "all" view
  const postsByPlatform = posts.reduce((acc, post) => {
    if (!acc[post.platform]) acc[post.platform] = [];
    acc[post.platform].push(post);
    return acc;
  }, {} as Record<PlatformId, SocialPost[]>);

  // Stats
  const deliveredCount = posts.filter(p => p.delivered_to_client).length;
  const generatedCount = posts.filter(p => p.status === 'generated' || p.status === 'edited').length;
  const withImageCount = posts.filter(p => p.image_path || (p.carousel_paths?.length ?? 0) > 0).length;
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
              Platform-separated view with native upload validation.
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
              <ImageIcon size={12} /> {withImageCount} Images
            </div>
          )}
          {withVideoCount > 0 && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded text-xs bg-blue-50 text-blue-700">
              <Video size={12} /> {withVideoCount} Videos
            </div>
          )}
        </div>

        {/* Clipboard Workflow */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
          <button onClick={handleCopyPrompt} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-inter font-medium transition-colors">
            <Sparkles size={13} /> Copy Prompt
          </button>
          <button onClick={handleCopyBrief} disabled={!clientBrief} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-inter font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <Copy size={13} /> Copy Brief
          </button>
          <button onClick={handleCopyEverything} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1B3F7A] hover:bg-[#2C68C4] text-white rounded text-xs font-inter font-medium transition-colors">
            <ClipboardCopy size={13} /> Copy Everything
          </button>
        </div>
      </div>

      {/* Posts Ordered at Checkout */}
      {socialMediaService && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <FileText size={20} className="text-[#1B3F7A] shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-inter font-semibold text-[#1B3F7A] mb-1">
                Posts Ordered at Checkout
              </h4>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center px-3 py-1.5 bg-white border border-blue-200 rounded-lg font-inter font-bold text-[#1B3F7A] text-lg">
                  {postCount}
                  <span className="font-normal text-gray-600 text-sm ml-1.5">posts</span>
                </span>
                {selectedPlatforms.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPlatforms.map((platform) => {
                      const spec = PLATFORM_SPECS[platform];
                      const Icon = PLATFORM_ICON_MAP[platform];
                      return (
                        <span
                          key={platform}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 ${spec.bgClass} border border-blue-200 rounded text-sm font-inter`}
                        >
                          <Icon size={14} className={spec.textClass} />
                          <span className="text-gray-700">{spec.label}</span>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
              {posts.length > 0 && (
                <div className="mt-2 flex items-center gap-4 text-xs font-inter text-gray-600">
                  <span className={posts.length >= postCount ? 'text-green-700 font-medium' : 'text-amber-700 font-medium'}>
                    {posts.length} of {postCount} created
                    {posts.length >= postCount ? ' — complete' : ` — ${postCount - posts.length} remaining`}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Platform Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            {selectedPlatforms.map((platform) => {
              const spec = PLATFORM_SPECS[platform];
              const Icon = PLATFORM_ICON_MAP[platform];
              const isActive = activePlatform === platform;
              const count = (postsByPlatform[platform] || []).length;
              return (
                <button
                  key={platform}
                  onClick={() => setActivePlatform(platform)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-inter font-medium transition-colors ${
                    isActive ? `${spec.bgClass} ${spec.textClass} ring-1 ring-current` : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon size={14} />
                  {spec.label} ({count})
                </button>
              );
            })}
            <button
              onClick={() => setActivePlatform('all')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-inter font-medium transition-colors ${
                activePlatform === 'all' ? 'bg-[#1B3F7A] text-white ring-1 ring-current' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All ({posts.length})
            </button>
          </div>
          <div className="flex items-center gap-2">
            {activePlatform !== 'all' && (
              <button
                onClick={() => handleDeliverAllForPlatform(activePlatform as PlatformId)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-inter font-medium transition-colors"
              >
                <Send size={13} />
                Deliver All for {PLATFORM_SPECS[activePlatform as PlatformId].label}
              </button>
            )}
            {deliveredCount < posts.length && posts.length > 0 && (
              <button
                onClick={handleDeliverAll}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1B3F7A] hover:bg-[#2C68C4] text-white rounded-md text-xs font-inter font-medium transition-colors"
              >
                <Send size={13} />
                Deliver All ({posts.length - deliveredCount})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Posts by Platform Section */}
      {posts.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <ImageIcon size={40} className="text-gray-400 mx-auto mb-4" />
          <p className="font-inter text-gray-600 mb-2">No posts created yet</p>
          <p className="font-inter text-gray-500 text-sm mb-4">
            Use the "Copy Prompt" and "Copy Brief" buttons above, then paste into Claude or ChatGPT to generate posts.
          </p>
        </div>
      ) : activePlatform === 'all' ? (
        // Show all platforms grouped
        <div className="space-y-6">
          {selectedPlatforms.map((platform) => {
            const platformPosts = postsByPlatform[platform] || [];
            if (platformPosts.length === 0) return null;
            const spec = PLATFORM_SPECS[platform];
            const Icon = PLATFORM_ICON_MAP[platform];
            const undelivered = platformPosts.filter(p => !p.delivered_to_client);
            return (
              <div key={platform} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${spec.bgClass} ${spec.textClass} font-inter font-semibold text-sm`}>
                    <Icon size={16} />
                    {spec.label} ({platformPosts.length})
                  </div>
                  {undelivered.length > 0 && (
                    <button
                      onClick={() => handleDeliverAllForPlatform(platform)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-inter font-medium transition-colors"
                    >
                      <Send size={12} /> Deliver All
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {platformPosts.map(post => (
                    <PostCard
                      key={post.id}
                      post={post}
                      isExpanded={expandedPost === post.id}
                      isEditing={editingPost === post.id}
                      editForm={editForm}
                      uploadProgress={uploadProgress}
                      copiedPostId={copiedPostId}
                      onToggleExpand={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                      onStartEdit={() => {
                        setEditingPost(editingPost === post.id ? null : post.id);
                        setEditForm({
                          caption: post.caption,
                          hashtags: post.hashtags || '',
                          image_prompt: post.image_prompt || '',
                          category: post.category,
                          platform: post.platform
                        });
                      }}
                      onCancelEdit={() => { setEditingPost(null); setEditForm({}); }}
                      onSaveEdit={() => handleEditPost(post.id)}
                      onEditFormChange={setEditForm}
                      onCopyText={handleCopyText}
                      onAssetUpload={(file, type) => handleAssetUpload(post, file, type)}
                      onRemoveAsset={(type) => handleRemoveAsset(post, type)}
                      onCarouselUpload={(files) => handleCarouselUpload(post, files)}
                      onRemoveCarouselSlide={(index) => handleRemoveCarouselSlide(post, index)}
                      onDownloadAsset={(type) => {
                        const path = type === 'image' ? post.image_path : post.video_path;
                        if (path) handleDownloadAsset(path, post.post_number, type);
                      }}
                      onMarkDelivered={() => handleMarkDelivered(post.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Single platform view
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {visiblePosts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              isExpanded={expandedPost === post.id}
              isEditing={editingPost === post.id}
              editForm={editForm}
              uploadProgress={uploadProgress}
              copiedPostId={copiedPostId}
              onToggleExpand={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
              onStartEdit={() => {
                setEditingPost(editingPost === post.id ? null : post.id);
                setEditForm({
                  caption: post.caption,
                  hashtags: post.hashtags || '',
                  image_prompt: post.image_prompt || '',
                  category: post.category,
                  platform: post.platform
                });
              }}
              onCancelEdit={() => { setEditingPost(null); setEditForm({}); }}
              onSaveEdit={() => handleEditPost(post.id)}
              onEditFormChange={setEditForm}
              onCopyText={handleCopyText}
              onAssetUpload={(file, type) => handleAssetUpload(post, file, type)}
              onRemoveAsset={(type) => handleRemoveAsset(post, type)}
              onCarouselUpload={(files) => handleCarouselUpload(post, files)}
              onRemoveCarouselSlide={(index) => handleRemoveCarouselSlide(post, index)}
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

// ── Post Card Component ──────────────────────────────────────────────────────
function PostCard({
  post,
  isExpanded,
  isEditing,
  editForm,
  uploadProgress,
  copiedPostId,
  onToggleExpand,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onEditFormChange,
  onCopyText,
  onAssetUpload,
  onRemoveAsset,
  onCarouselUpload,
  onRemoveCarouselSlide,
  onDownloadAsset,
  onMarkDelivered,
}: {
  post: SocialPost;
  isExpanded: boolean;
  isEditing: boolean;
  editForm: Partial<SocialPost>;
  uploadProgress: Record<string, { type: 'image' | 'video' | 'carousel'; progress: number }>;
  copiedPostId: string | null;
  onToggleExpand: () => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onEditFormChange: (form: Partial<SocialPost>) => void;
  onCopyText: (text: string, postId: string, type: 'caption' | 'hashtags') => void;
  onAssetUpload: (file: File, type: 'image' | 'video') => void;
  onRemoveAsset: (type: 'image' | 'video') => void;
  onCarouselUpload: (files: File[]) => void;
  onRemoveCarouselSlide: (index: number) => void;
  onDownloadAsset: (type: 'image' | 'video') => void;
  onMarkDelivered: () => void;
}) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const carouselInputRef = useRef<HTMLInputElement>(null);
  const spec = PLATFORM_SPECS[post.platform];
  const PlatformIcon = PLATFORM_ICON_MAP[post.platform];
  const categoryStyle = CATEGORY_STYLES[post.category];
  const primarySpec = getPrimaryImageSpec(post.platform);

  const isUploadingImage = uploadProgress[`${post.id}-image`];
  const isUploadingVideo = uploadProgress[`${post.id}-video`];
  const carouselProgresses = Object.entries(uploadProgress).filter(([k]) => k.startsWith(`${post.id}-carousel-`));
  const isUploadingCarousel = carouselProgresses.length > 0;

  const captionChars = (editForm.caption || post.caption).length;
  const captionLimit = spec.captionLimit;
  const hashtagCount = ((editForm.hashtags || post.hashtags || '').match(/#\w+/g) || []).length;

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
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded ${spec.bgClass}`}>
            <PlatformIcon size={12} className={spec.textClass} />
            <span className="text-xs font-medium text-gray-700">{spec.label}</span>
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
          {post.carousel_paths && post.carousel_paths.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-pink-50 text-pink-600 rounded text-xs font-medium">
              <Images size={10} /> Carousel ({post.carousel_paths.length})
            </span>
          )}
        </div>

        {/* Caption preview */}
        {isEditing ? (
          <div className="mb-3">
            <textarea
              value={editForm.caption || ''}
              onChange={(e) => onEditFormChange({ ...editForm, caption: e.target.value })}
              className="w-full p-2 border border-gray-200 rounded text-sm font-inter min-h-[100px]"
              placeholder="Caption..."
            />
            <div className={`text-xs mt-1 font-inter ${captionChars > captionLimit ? 'text-red-600 font-medium' : 'text-gray-400'}`}>
              {captionChars}/{captionLimit} characters
            </div>
          </div>
        ) : (
          <p className="font-inter text-sm text-gray-700 line-clamp-3 mb-3">{post.caption}</p>
        )}

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
                onClick={onStartEdit}
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
                <X size={12} /> Cancel
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
            <label className="font-inter text-xs font-medium text-gray-500 mb-1 block">
              Hashtags {hashtagCount > spec.hashtagLimit && <span className="text-red-600">({hashtagCount}/{spec.hashtagLimit} — over limit)</span>}
            </label>
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

          {/* Platform dimension guidance */}
          <div className={`rounded-lg p-3 ${spec.bgClass}`}>
            <p className={`text-xs font-inter font-medium ${spec.textClass} mb-1`}>
              {spec.label} Image Specs
            </p>
            <p className="text-xs text-gray-600 font-inter">
              {spec.imageSpecs.map(s => `${s.label}: ${s.width}x${s.height} (${s.aspectRatio})`).join(' | ')}
            </p>
            {spec.videoSpec && (
              <p className="text-xs text-gray-600 font-inter mt-1">
                Video: max {spec.videoSpec.maxLengthSeconds}s, {spec.videoSpec.maxFileSizeMB}MB, {spec.videoSpec.acceptedMimeTypes.map(t => t.split('/')[1]).join('/')}
              </p>
            )}
          </div>

          {/* Category / Platform / Week/Day selectors (editing) */}
          {isEditing && (
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-inter text-xs font-medium text-gray-500 mb-1 block">Category</label>
                <select
                  value={editForm.category || post.category}
                  onChange={(e) => onEditFormChange({ ...editForm, category: e.target.value as any })}
                  className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm font-inter bg-white"
                >
                  <option value="educational">Educational</option>
                  <option value="promotional">Promotional</option>
                  <option value="personal">Personal</option>
                </select>
              </div>
              <div>
                <label className="font-inter text-xs font-medium text-gray-500 mb-1 block">Platform</label>
                <select
                  value={editForm.platform || post.platform}
                  onChange={(e) => onEditFormChange({ ...editForm, platform: e.target.value as PlatformId })}
                  className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm font-inter bg-white"
                >
                  {ALL_PLATFORM_IDS.map(p => (
                    <option key={p} value={p}>{PLATFORM_SPECS[p].label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-inter text-xs font-medium text-gray-500 mb-1 block">Week/Day</label>
                <div className="flex gap-1">
                  <select
                    value={editForm.week || post.week}
                    onChange={(e) => onEditFormChange({ ...editForm, week: parseInt(e.target.value) })}
                    className="flex-1 px-2 py-1.5 border border-gray-200 rounded text-sm font-inter bg-white"
                  >
                    {[1,2,3,4,5,6].map(w => <option key={w} value={w}>Wk {w}</option>)}
                  </select>
                  <select
                    value={editForm.day || post.day}
                    onChange={(e) => onEditFormChange({ ...editForm, day: e.target.value as any })}
                    className="flex-1 px-2 py-1.5 border border-gray-200 rounded text-sm font-inter bg-white"
                  >
                    {['Mon','Tue','Wed','Thu','Fri'].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
            </div>
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
                  <div>
                    <span className="font-inter text-xs text-gray-700">Image uploaded</span>
                    {post.image_dimensions && (
                      <span className="font-inter text-xs text-gray-400 ml-1">({post.image_dimensions})</span>
                    )}
                  </div>
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
                    <p className="font-inter text-xs text-purple-600 font-medium">Uploading... {isUploadingImage.progress}%</p>
                  </>
                ) : (
                  <>
                    <ImageIcon size={14} className="text-gray-400" />
                    <p className="font-inter text-xs text-gray-600 font-medium">Upload Image</p>
                    <p className="font-inter text-xs text-gray-400">{primarySpec.label} ({primarySpec.width}x{primarySpec.height})</p>
                  </>
                )}
              </div>
            )}
            <input
              ref={imageInputRef}
              type="file"
              accept={spec.acceptedImageMimeTypes.join(',')}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onAssetUpload(file, 'image');
              }}
            />
          </div>

          {/* Carousel Upload (for platforms that support it) */}
          {spec.features.carousel && (
            <div>
              <label className="font-inter text-xs font-medium text-gray-500 mb-2 block">
                Carousel Slides {post.carousel_paths && post.carousel_paths.length > 0 && `(${post.carousel_paths.length}/${spec.carouselMaxSlides || 10})`}
              </label>
              {post.carousel_paths && post.carousel_paths.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {post.carousel_paths.map((path, index) => (
                    <div key={index} className="relative group">
                      <div className="w-14 h-14 rounded border border-gray-200 bg-gray-50 flex items-center justify-center">
                        <ImageIcon size={16} className="text-gray-400" />
                      </div>
                      <button
                        onClick={() => onRemoveCarouselSlide(index)}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={10} />
                      </button>
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[9px] text-gray-400">{index + 1}</span>
                    </div>
                  ))}
                </div>
              )}
              {(!post.carousel_paths || post.carousel_paths.length < (spec.carouselMaxSlides || 10)) && (
                <div
                  onClick={() => !isUploadingCarousel && carouselInputRef.current?.click()}
                  className={`flex items-center justify-center gap-2 border-2 border-dashed rounded-lg px-3 py-2 cursor-pointer transition-colors
                    ${isUploadingCarousel ? 'border-pink-300 bg-pink-50 cursor-wait' : 'border-gray-300 bg-white hover:border-pink-400 hover:bg-pink-50'}`}
                >
                  {isUploadingCarousel ? (
                    <>
                      <RefreshCw size={14} className="text-pink-500 animate-spin" />
                      <p className="font-inter text-xs text-pink-600 font-medium">Uploading slides...</p>
                    </>
                  ) : (
                    <>
                      <Plus size={14} className="text-gray-400" />
                      <p className="font-inter text-xs text-gray-600 font-medium">Add Carousel Slide(s)</p>
                    </>
                  )}
                </div>
              )}
              <input
                ref={carouselInputRef}
                type="file"
                accept={spec.acceptedImageMimeTypes.join(',')}
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  if (files.length > 0) onCarouselUpload(files);
                }}
              />
            </div>
          )}

          {/* Video Upload */}
          {spec.videoSpec && (
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
                      <p className="font-inter text-xs text-blue-600 font-medium">Uploading... {isUploadingVideo.progress}%</p>
                    </>
                  ) : (
                    <>
                      <Video size={14} className="text-gray-400" />
                      <p className="font-inter text-xs text-gray-600 font-medium">Upload Video</p>
                      <p className="font-inter text-xs text-gray-400">max {spec.videoSpec.maxLengthSeconds}s, {spec.videoSpec.maxFileSizeMB}MB</p>
                    </>
                  )}
                </div>
              )}
              <input
                ref={videoInputRef}
                type="file"
                accept={spec.videoSpec.acceptedMimeTypes.join(',')}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onAssetUpload(file, 'video');
                }}
              />
            </div>
          )}

          {/* Deliver button */}
          {!post.delivered_to_client && (
            <button
              onClick={onMarkDelivered}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-inter font-medium transition-colors"
            >
              <Send size={13} /> Deliver to Client
            </button>
          )}
        </div>
      )}
    </div>
  );
}
