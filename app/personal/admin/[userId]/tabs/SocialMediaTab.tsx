'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Instagram, Linkedin, Facebook, Twitter, Download, AlertCircle, CheckCircle2, Clock, ChevronDown, ChevronUp, Send, X, Copy, FileUp, Info, RefreshCw, Image as ImageIcon, Filter, Grid2x2 as Grid, List, Eye, EyeOff, CreditCard as Edit3, Save } from 'lucide-react';

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
  status: 'pending' | 'generated' | 'edited' | 'delivered';
  delivered_to_client: boolean;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
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

export default function SocialMediaTab({ userId, data, refreshData }: SocialMediaTabProps) {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const [editingPost, setEditingPost] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<SocialPost>>({});
  const [uploadingImage, setUploadingImage] = useState<number | null>(null);
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  // Filters
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [weekFilter, setWeekFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchPosts();
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

  const handleImageUpload = async (postNumber: number, file: File) => {
    setUploadingImage(postNumber);
    const post = posts.find(p => p.post_number === postNumber);

    try {
      const ext = file.name.split('.').pop() || 'png';
      const storagePath = `${userId}/${postNumber}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('social-media-images')
        .upload(storagePath, file, { contentType: file.type, upsert: true });

      if (uploadError) {
        showMessage(`Upload failed: ${uploadError.message}`, 'error');
        return;
      }

      if (post?.id) {
        await supabase
          .from('social_media_posts')
          .update({
            image_path: storagePath,
            status: post.status === 'pending' ? 'generated' : post.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', post.id);
      }

      showMessage(`Image uploaded for Post ${postNumber}`, 'success');
      await fetchPosts();
    } catch (err: any) {
      showMessage(err.message || 'Upload failed', 'error');
    } finally {
      setUploadingImage(null);
    }
  };

  const handleRemoveImage = async (postNumber: number) => {
    const post = posts.find(p => p.post_number === postNumber);
    if (!post?.image_path || !post.id) return;

    await supabase.storage.from('social-media-images').remove([post.image_path]);
    await supabase
      .from('social_media_posts')
      .update({ image_path: null, updated_at: new Date().toISOString() })
      .eq('id', post.id);

    showMessage('Image removed', 'info');
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

  const handleDownloadImage = async (imagePath: string, postNumber: number) => {
    const { data, error } = await supabase.storage
      .from('social-media-images')
      .createSignedUrl(imagePath, 3600);

    if (error || !data) {
      showMessage('Could not generate download link', 'error');
      return;
    }

    const a = document.createElement('a');
    a.href = data.signedUrl;
    a.download = `post-${postNumber}-image.png`;
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
              Social Media Posts (30)
            </h3>
            <p className="font-inter text-gray-500 text-sm">
              Manage individual posts with captions, hashtags, and images.
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm shrink-0">
            <div className="text-center">
              <div className="font-inter font-bold text-2xl text-[#1B3F7A]">{posts.length}</div>
              <div className="font-inter text-gray-500 text-xs">Total</div>
            </div>
            <div className="text-center">
              <div className="font-inter font-bold text-2xl text-amber-600">{generatedCount}</div>
              <div className="font-inter text-gray-500 text-xs">Generated</div>
            </div>
            <div className="text-center">
              <div className="font-inter font-bold text-2xl text-green-600">{deliveredCount}</div>
              <div className="font-inter text-gray-500 text-xs">Delivered</div>
            </div>
            <div className="text-center">
              <div className="font-inter font-bold text-2xl text-purple-600">{withImageCount}</div>
              <div className="font-inter text-gray-500 text-xs">With Image</div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
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
            {deliveredCount < posts.length && (
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
          <p className="font-inter text-gray-600 mb-2">No posts generated yet</p>
          <p className="font-inter text-gray-500 text-sm">
            Posts will appear here once generated from the master brief.
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
              uploadingImage={uploadingImage}
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
              onImageUpload={(file) => handleImageUpload(post.post_number, file)}
              onRemoveImage={() => handleRemoveImage(post.post_number)}
              onDownloadImage={() => post.image_path && handleDownloadImage(post.image_path, post.post_number)}
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
              uploadingImage={uploadingImage}
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
              onImageUpload={(file) => handleImageUpload(post.post_number, file)}
              onRemoveImage={() => handleRemoveImage(post.post_number)}
              onDownloadImage={() => post.image_path && handleDownloadImage(post.image_path, post.post_number)}
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
  uploadingImage,
  copiedPostId,
  onToggleExpand,
  onEdit,
  onCancelEdit,
  onSaveEdit,
  onEditFormChange,
  onCopyText,
  onImageUpload,
  onRemoveImage,
  onDownloadImage,
  onMarkDelivered,
}: {
  post: SocialPost;
  isExpanded: boolean;
  isEditing: boolean;
  editForm: Partial<SocialPost>;
  uploadingImage: number | null;
  copiedPostId: string | null;
  onToggleExpand: () => void;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onEditFormChange: (form: Partial<SocialPost>) => void;
  onCopyText: (text: string, postId: string, type: 'caption' | 'hashtags') => void;
  onImageUpload: (file: File) => void;
  onRemoveImage: () => void;
  onDownloadImage: () => void;
  onMarkDelivered: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const PlatformIcon = PLATFORM_CONFIG[post.platform].icon;
  const categoryStyle = CATEGORY_STYLES[post.category];
  const isUploading = uploadingImage === post.post_number;

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
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded ${PLATFORM_CONFIG[post.platform].bg}`}>
            <PlatformIcon size={12} className={PLATFORM_CONFIG[post.platform].color} />
            <span className="text-xs font-medium text-gray-700">{post.platform}</span>
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
          {post.image_path && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-600 rounded text-xs font-medium">
              <ImageIcon size={10} /> Image
            </span>
          )}
          {post.status === 'edited' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-600 rounded text-xs font-medium">
              <Edit3 size={10} /> Edited
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
                <Edit3 size={12} />
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
                <Save size={12} />
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
                  <div className="w-8 h-8 rounded bg-purple-50 flex items-center justify-center">
                    <ImageIcon size={14} className="text-purple-600" />
                  </div>
                  <span className="font-inter text-xs text-gray-700">Image uploaded</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={onDownloadImage}
                    className="p-1.5 text-gray-500 hover:text-[#1B3F7A] hover:bg-gray-100 rounded"
                    title="Download"
                  >
                    <Download size={14} />
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                    title="Replace"
                  >
                    <RefreshCw size={14} />
                  </button>
                  <button
                    onClick={onRemoveImage}
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                    title="Remove"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center gap-1.5 border-2 border-dashed rounded-lg px-3 py-4 cursor-pointer transition-colors
                  ${isUploading
                    ? 'border-purple-300 bg-purple-50 cursor-wait'
                    : 'border-gray-300 bg-white hover:border-purple-400 hover:bg-purple-50'
                  }`}
              >
                {isUploading ? (
                  <>
                    <RefreshCw size={16} className="text-purple-500 animate-spin" />
                    <p className="font-inter text-xs text-purple-600 font-medium">Uploading...</p>
                  </>
                ) : (
                  <>
                    <FileUp size={16} className="text-gray-400" />
                    <p className="font-inter text-xs text-gray-600 font-medium">Upload Image</p>
                  </>
                )}
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onImageUpload(file);
              }}
            />
          </div>

          {/* Platform/Category (when editing) */}
          {isEditing && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-inter text-xs font-medium text-gray-500 mb-1 block">Platform</label>
                <select
                  value={editForm.platform || post.platform}
                  onChange={(e) => onEditFormChange({ ...editForm, platform: e.target.value as any })}
                  className="w-full p-2 border border-gray-200 rounded text-sm font-inter"
                >
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Facebook">Facebook</option>
                  <option value="X">X</option>
                </select>
              </div>
              <div>
                <label className="font-inter text-xs font-medium text-gray-500 mb-1 block">Category</label>
                <select
                  value={editForm.category || post.category}
                  onChange={(e) => onEditFormChange({ ...editForm, category: e.target.value as any })}
                  className="w-full p-2 border border-gray-200 rounded text-sm font-inter"
                >
                  <option value="educational">Educational</option>
                  <option value="promotional">Promotional</option>
                  <option value="personal">Personal</option>
                </select>
              </div>
            </div>
          )}

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
  uploadingImage,
  copiedPostId,
  onToggleExpand,
  onEdit,
  onCancelEdit,
  onSaveEdit,
  onEditFormChange,
  onCopyText,
  onImageUpload,
  onRemoveImage,
  onDownloadImage,
  onMarkDelivered,
}: {
  post: SocialPost;
  isExpanded: boolean;
  isEditing: boolean;
  editForm: Partial<SocialPost>;
  uploadingImage: number | null;
  copiedPostId: string | null;
  onToggleExpand: () => void;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onEditFormChange: (form: Partial<SocialPost>) => void;
  onCopyText: (text: string, postId: string, type: 'caption' | 'hashtags') => void;
  onImageUpload: (file: File) => void;
  onRemoveImage: () => void;
  onDownloadImage: () => void;
  onMarkDelivered: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const PlatformIcon = PLATFORM_CONFIG[post.platform].icon;
  const categoryStyle = CATEGORY_STYLES[post.category];
  const isUploading = uploadingImage === post.post_number;

  return (
    <div className={`bg-white rounded-lg border overflow-hidden ${isExpanded ? 'border-[#1B3F7A] border-opacity-40' : 'border-gray-200'}`}>
      <div className="p-4">
        <div className="flex items-center gap-4">
          {/* Post number */}
          <div className="font-inter font-bold text-[#1B3F7A] text-lg w-12 text-center shrink-0">
            #{post.post_number}
          </div>

          {/* Category & Platform */}
          <div className="flex flex-col gap-1 shrink-0">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${categoryStyle.bg} ${categoryStyle.text}`}>
              {categoryStyle.label}
            </span>
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded ${PLATFORM_CONFIG[post.platform].bg}`}>
              <PlatformIcon size={12} className={PLATFORM_CONFIG[post.platform].color} />
              <span className="text-xs font-medium text-gray-700">{post.platform}</span>
            </div>
          </div>

          {/* Caption preview */}
          <div className="flex-1 min-w-0">
            <p className="font-inter text-sm text-gray-700 line-clamp-2">
              {post.caption}
            </p>
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
              <span>Week {post.week}, {post.day}</span>
              {post.image_path && <span className="text-purple-600">+ Image</span>}
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-inter text-xs font-medium text-gray-500 mb-1 block">Platform</label>
                  <select
                    value={editForm.platform || post.platform}
                    onChange={(e) => onEditFormChange({ ...editForm, platform: e.target.value as any })}
                    className="w-full p-2 border border-gray-200 rounded text-sm font-inter"
                  >
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="X">X</option>
                  </select>
                </div>
                <div>
                  <label className="font-inter text-xs font-medium text-gray-500 mb-1 block">Category</label>
                  <select
                    value={editForm.category || post.category}
                    onChange={(e) => onEditFormChange({ ...editForm, category: e.target.value as any })}
                    className="w-full p-2 border border-gray-200 rounded text-sm font-inter"
                  >
                    <option value="educational">Educational</option>
                    <option value="promotional">Promotional</option>
                    <option value="personal">Personal</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                <button
                  onClick={onSaveEdit}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1B3F7A] hover:bg-[#2C68C4] text-white rounded text-xs font-inter font-medium transition-colors"
                >
                  <Save size={13} />
                  Save Changes
                </button>
                <button
                  onClick={onCancelEdit}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded text-xs font-inter font-medium transition-colors"
                >
                  <X size={13} />
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
                  <div className="w-8 h-8 rounded bg-purple-50 flex items-center justify-center">
                    <ImageIcon size={14} className="text-purple-600" />
                  </div>
                  <span className="font-inter text-xs text-gray-700">Image uploaded</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={onDownloadImage}
                    className="p-1.5 text-gray-500 hover:text-[#1B3F7A] hover:bg-gray-100 rounded"
                  >
                    <Download size={14} />
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <RefreshCw size={14} />
                  </button>
                  <button
                    onClick={onRemoveImage}
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`flex items-center justify-center gap-2 border-2 border-dashed rounded-lg px-3 py-3 cursor-pointer transition-colors
                  ${isUploading
                    ? 'border-purple-300 bg-purple-50 cursor-wait'
                    : 'border-gray-300 bg-white hover:border-purple-400 hover:bg-purple-50'
                  }`}
              >
                {isUploading ? (
                  <>
                    <RefreshCw size={14} className="text-purple-500 animate-spin" />
                    <p className="font-inter text-xs text-purple-600 font-medium">Uploading...</p>
                  </>
                ) : (
                  <>
                    <FileUp size={14} className="text-gray-400" />
                    <p className="font-inter text-xs text-gray-600 font-medium">Upload Image</p>
                  </>
                )}
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onImageUpload(file);
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
                <Edit3 size={13} />
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
