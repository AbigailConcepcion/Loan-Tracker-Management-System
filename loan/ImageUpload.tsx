import React, { useRef, useState, useEffect } from 'react';
import { Camera, Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  label?: string;
  value?: string;
  onChange: (imageUrl: string) => void;
  onRemove?: () => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ label, value, onChange, onRemove }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(value);

  // Sync internal state if external value changes
  useEffect(() => {
    setPreview(value);
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering upload click
    setPreview(undefined);
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    onRemove?.();
  };

  return (
    <div className="space-y-2 w-full">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      
      {preview ? (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-gray-200 shadow-sm group">
          <img src={preview} alt={label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={handleRemove}
              type="button"
              className="bg-red-500 text-white p-2 rounded-full transform hover:scale-110 transition shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {/* Mobile visible remove button */}
          <button
            onClick={handleRemove}
            type="button"
            className="md:hidden absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group"
        >
          <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition">
            <Camera className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-sm font-semibold text-gray-700">Tap to Take Photo</p>
          <p className="text-xs text-gray-500 mt-1">or upload from gallery</p>
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        // capture="environment" // Optional: forcing this on some devices skips the gallery choice. 
        // Removing 'capture' usually gives user choice: "Camera or Files"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
