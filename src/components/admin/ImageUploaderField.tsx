import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Loader2, CheckCircle2, Trash2 } from 'lucide-react';
import { adminApi } from '../../services/api';

interface ImageUploaderFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  helperText?: string;
}

export const ImageUploaderField: React.FC<ImageUploaderFieldProps> = ({
  label,
  value,
  onChange,
  helperText,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccessMsg(null);

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Please choose a JPG, PNG, or WebP image.');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be 5 MB or less.');
      e.target.value = '';
      return;
    }

    setUploading(true);
    try {
      const result = await adminApi.uploadImage(file);
      onChange(result.url);
      setSuccessMsg(`Image uploaded (${result.provider === 'cloudinary' ? 'Cloud' : 'Server Storage'}). Click Save to publish.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-2.5">
      <label className="block text-xs font-bold uppercase tracking-wider text-[#11382b]">
        {label}
      </label>

      <div className="flex flex-col sm:flex-row gap-4 items-start bg-[#FAF7F2] p-4 rounded-xl border border-[#e5dfd3]">
        {/* Current Image Preview */}
        <div className="w-full sm:w-40 aspect-[4/3] rounded-lg overflow-hidden bg-stone-200 border border-[#d6cfc1] shrink-0 flex items-center justify-center">
          {value ? (
            <img
              src={value}
              alt={label}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <ImageIcon className="w-8 h-8 text-stone-400" />
          )}
        </div>

        {/* Upload Controls */}
        <div className="flex-1 space-y-2.5 w-full">
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#184c3c] hover:bg-[#123b2e] disabled:opacity-60 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>{value ? 'Replace Image' : 'Upload Image'}</span>
                </>
              )}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange('');
                  setSuccessMsg('Image removed. Click Save to publish.');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-red-200 hover:bg-red-50 text-red-600 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Image</span>
              </button>
            )}
            <span className="text-[11px] text-[#6d7972]">
              JPG, PNG, or WebP · Max 5 MB
            </span>
          </div>

          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/images/... or https://..."
            className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#d6cfc1] text-xs text-[#2D3732] focus:outline-none focus:ring-2 focus:ring-[#184c3c]"
          />

          {helperText && <p className="text-[11px] text-[#6d7972]">{helperText}</p>}

          {error && (
            <p className="text-xs text-red-600 font-medium">{error}</p>
          )}
          {successMsg && (
            <p className="text-xs text-emerald-700 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{successMsg}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
