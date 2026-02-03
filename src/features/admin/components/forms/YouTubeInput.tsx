import { useState, useEffect } from 'react';
import { Youtube, Plus, Trash2, Star, StarOff, Play, ExternalLink } from 'lucide-react';
import type { Video } from '@/types';

interface YouTubeInputProps {
  videos: Video[];
  onChange: (videos: Video[]) => void;
}

// Extract YouTube video ID from various URL formats
export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/, // Direct video ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Get YouTube thumbnail URL
export function getYouTubeThumbnail(videoId: string, quality: 'default' | 'mq' | 'hq' | 'max' = 'hq'): string {
  const qualities = {
    default: `https://img.youtube.com/vi/${videoId}/default.jpg`,
    mq: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
    hq: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    max: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
  };
  return qualities[quality];
}

// Convert various YouTube URL formats to embed URL
export function getYouTubeEmbedUrl(url: string): string | null {
  const videoId = extractYouTubeId(url);
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}`;
}

export function YouTubeInput({ videos, onChange }: YouTubeInputProps) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Update preview when URL changes
  useEffect(() => {
    const videoId = extractYouTubeId(url);
    if (videoId) {
      setPreviewId(videoId);
      setError('');
    } else {
      setPreviewId(null);
    }
  }, [url]);

  const handleAddVideo = () => {
    const videoId = extractYouTubeId(url);
    if (!videoId) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    // Check if video already exists
    if (videos.some(v => extractYouTubeId(v.url) === videoId)) {
      setError('This video is already added');
      return;
    }

    const embedUrl = getYouTubeEmbedUrl(url);
    if (!embedUrl) return;

    const newVideo: Video = {
      id: Date.now().toString(),
      url: embedUrl,
      title: title.trim() || `Video ${videos.length + 1}`,
      description: description.trim() || undefined,
      type: 'youtube',
      thumbnailUrl: getYouTubeThumbnail(videoId, 'hq'),
      isFeatured: isFeatured,
    };

    // If this is featured, un-feature others
    let updatedVideos = [...videos, newVideo];
    if (isFeatured) {
      updatedVideos = updatedVideos.map(v => ({
        ...v,
        isFeatured: v.id === newVideo.id,
      }));
    }

    onChange(updatedVideos);
    resetForm();
  };

  const resetForm = () => {
    setUrl('');
    setTitle('');
    setDescription('');
    setIsFeatured(false);
    setPreviewId(null);
    setError('');
  };

  const removeVideo = (id: string) => {
    onChange(videos.filter(v => v.id !== id));
  };

  const toggleFeatured = (id: string) => {
    onChange(
      videos.map(v => ({
        ...v,
        isFeatured: v.id === id ? !v.isFeatured : false,
      }))
    );
  };

  return (
    <div className="space-y-4">
      {/* Add new video form */}
      <div className="p-4 rounded-xl bg-white/5 space-y-3">
        <div className="flex items-center gap-2 text-white/60 mb-2">
          <Youtube className="w-4 h-4 text-red-500" />
          <span className="text-sm font-medium">Add YouTube Video</span>
        </div>

        {/* URL Input with preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-2">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube URL (e.g., https://youtube.com/watch?v=...)"
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/20"
            />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Video title (optional)"
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/20"
            />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Video description (optional)"
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/20"
            />
            
            {error && (
              <p className="text-red-400 text-xs">{error}</p>
            )}
            
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-white/5"
                />
                <span className="text-white/60 text-sm">Featured video</span>
              </label>
            </div>
          </div>

          {/* Live thumbnail preview */}
          <div className="aspect-video rounded-lg bg-black/50 overflow-hidden">
            {previewId ? (
              <img
                src={getYouTubeThumbnail(previewId, 'hq')}
                alt="Video thumbnail preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to default quality if hq fails
                  (e.target as HTMLImageElement).src = getYouTubeThumbnail(previewId, 'default');
                }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <Play className="w-8 h-8 text-white/20 mb-1" />
                <span className="text-white/30 text-xs">Preview will appear here</span>
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddVideo}
          disabled={!previewId}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 disabled:opacity-30 text-red-400 rounded-lg text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Video
        </button>
      </div>

      {/* Video list */}
      {videos.length > 0 && (
        <div className="space-y-2">
          <p className="text-white/40 text-sm">
            {videos.length} video{videos.length !== 1 ? 's' : ''} added
          </p>
          
          <div className="grid gap-2">
            {videos.map((video) => {
              const videoId = extractYouTubeId(video.url);
              return (
                <div
                  key={video.id}
                  className={`flex gap-3 p-3 rounded-xl border transition-all ${
                    video.isFeatured
                      ? 'bg-amber-500/10 border-amber-500/30'
                      : 'bg-white/5 border-white/5 hover:border-white/10'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative w-32 aspect-video rounded-lg overflow-hidden bg-black/50 flex-shrink-0">
                    {video.thumbnailUrl || videoId ? (
                      <img
                        src={video.thumbnailUrl || getYouTubeThumbnail(videoId!, 'mq')}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <a
                        href={video.url.replace('/embed/', '/watch?v=')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 text-white" />
                      </a>
                    </div>
                    {video.isFeatured && (
                      <div className="absolute top-1 left-1">
                        <div className="p-1 bg-amber-500 rounded">
                          <Star className="w-2.5 h-2.5 text-black" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white text-sm font-medium truncate">{video.title}</h4>
                    {video.description && (
                      <p className="text-white/40 text-xs truncate mt-0.5">{video.description}</p>
                    )}
                    <div className="flex items-center gap-1 mt-1.5">
                      <Youtube className="w-3 h-3 text-red-500" />
                      <span className="text-white/30 text-xs">YouTube</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => toggleFeatured(video.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        video.isFeatured
                          ? 'text-amber-400 hover:bg-amber-500/20'
                          : 'text-white/40 hover:text-amber-400 hover:bg-white/5'
                      }`}
                      title={video.isFeatured ? 'Unmark as featured' : 'Mark as featured'}
                    >
                      {video.isFeatured ? <Star className="w-4 h-4" /> : <StarOff className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeVideo(video.id)}
                      className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Remove video"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Video preview component for public pages
interface YouTubePreviewProps {
  video: Video;
  className?: string;
}

export function YouTubePreview({ video, className = '' }: YouTubePreviewProps) {
  const videoId = extractYouTubeId(video.url);
  if (!videoId) return null;

  return (
    <div className={`relative aspect-video rounded-xl overflow-hidden bg-black/50 group ${className}`}>
      <img
        src={video.thumbnailUrl || getYouTubeThumbnail(videoId, 'hq')}
        alt={video.title}
        className="w-full h-full object-cover transition-transform group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      
      {/* Play button */}
      <a
        href={video.url.replace('/embed/', '/watch?v=')}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
          <Play className="w-6 h-6 text-white ml-1" fill="white" />
        </div>
      </a>

      {/* Info overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h4 className="text-white font-medium text-sm">{video.title}</h4>
        {video.description && (
          <p className="text-white/60 text-xs mt-1 line-clamp-1">{video.description}</p>
        )}
      </div>

      {/* Featured badge */}
      {video.isFeatured && (
        <div className="absolute top-3 left-3">
          <div className="flex items-center gap-1 px-2 py-1 bg-amber-500 rounded text-xs font-medium text-black">
            <Star className="w-3 h-3" />
            Featured
          </div>
        </div>
      )}
    </div>
  );
}
