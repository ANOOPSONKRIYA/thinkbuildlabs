import { useState, useRef } from 'react';
import { Upload, X, ImageIcon, Loader2, GripVertical } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  description?: string;
  aspectRatio?: 'square' | 'video' | 'wide' | 'portrait';
  maxSize?: number; // in MB
  accept?: string;
}

export function ImageUpload({
  value,
  onChange,
  label = 'Image',
  description,
  aspectRatio = 'video',
  accept = 'image/*',
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[21/9]',
    portrait: 'aspect-[3/4]',
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const processFile = async (file: File) => {
    setIsLoading(true);
    
    // Simulate upload delay - replace with actual upload to Supabase/S3
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For now, create object URL (in production, upload to storage)
    const url = URL.createObjectURL(file);
    onChange(url);
    setIsLoading(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      await processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const clearImage = () => {
    onChange('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-white/60 text-sm">{label}</label>
      )}
      
      {value ? (
        <div className={`relative group rounded-xl overflow-hidden bg-white/5 ${aspectRatioClasses[aspectRatio]}`}>
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm transition-colors"
            >
              Change
            </button>
            <button
              type="button"
              onClick={clearImage}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 text-sm transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all ${
            isDragging
              ? 'border-white/40 bg-white/10'
              : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]'
          } ${aspectRatioClasses[aspectRatio]}`}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            {isLoading ? (
              <>
                <Loader2 className="w-8 h-8 text-white/40 animate-spin mb-2" />
                <p className="text-white/40 text-sm">Uploading...</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3">
                  <Upload className="w-5 h-5 text-white/60" />
                </div>
                <p className="text-white/60 text-sm font-medium text-center">
                  Click to upload or drag and drop
                </p>
                <p className="text-white/30 text-xs text-center mt-1">
                  {description || 'PNG, JPG, GIF up to 10MB'}
                </p>
              </>
            )}
          </div>
        </div>
      )}
      
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

// Gallery Images Component with drag & reorder
interface GalleryImagesProps {
  images: string[];
  onChange: (images: string[]) => void;
  label?: string;
}

export function GalleryImages({ images, onChange, label = 'Gallery Images' }: GalleryImagesProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);
    
    onChange(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const addImageUrl = () => {
    if (newImageUrl.trim() && !images.includes(newImageUrl.trim())) {
      onChange([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    for (const file of files) {
      // Simulate upload - replace with actual upload
      await new Promise(resolve => setTimeout(resolve, 500));
      const url = URL.createObjectURL(file);
      onChange([...images, url]);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-white/60 text-sm">{label}</label>
      
      {/* Add new image */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImageUrl())}
          placeholder="Or paste image URL..."
          className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-2 bg-white/10 hover:bg-white/15 rounded-lg text-white/70 transition-colors"
        >
          <Upload className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={addImageUrl}
          disabled={!newImageUrl.trim()}
          className="px-3 py-2 bg-white/10 hover:bg-white/15 disabled:opacity-30 rounded-lg text-white text-sm transition-colors"
        >
          Add
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />
      
      {/* Image grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((image, index) => (
            <div
              key={`${image}-${index}`}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`relative group aspect-square rounded-xl overflow-hidden bg-white/5 cursor-move ${
                draggedIndex === index ? 'opacity-50 ring-2 ring-white/30' : ''
              }`}
            >
              <img
                src={image}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute top-2 left-2">
                  <div className="p-1.5 bg-black/50 rounded-lg cursor-grab active:cursor-grabbing">
                    <GripVertical className="w-3 h-3 text-white/70" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2">
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-1.5 bg-red-500/80 hover:bg-red-500 rounded-lg transition-colors"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
                <div className="absolute bottom-2 left-2">
                  <span className="text-white/70 text-xs font-medium">{index + 1}</span>
                </div>
              </div>
            </div>
          ))}
          
          {/* Add more placeholder */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/[0.07] flex flex-col items-center justify-center transition-all"
          >
            <ImageIcon className="w-6 h-6 text-white/30 mb-1" />
            <span className="text-white/40 text-xs">Add more</span>
          </button>
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="rounded-xl border-2 border-dashed border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07] p-8 flex flex-col items-center justify-center cursor-pointer transition-all"
        >
          <ImageIcon className="w-10 h-10 text-white/30 mb-2" />
          <p className="text-white/50 text-sm">No images yet</p>
          <p className="text-white/30 text-xs mt-1">Click to upload images</p>
        </div>
      )}
      
      <p className="text-white/30 text-xs">
        Drag to reorder images. First image will be used as cover if no cover is set.
      </p>
    </div>
  );
}
