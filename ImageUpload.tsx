import React, { useRef, useState } from 'react';
import { Camera, Upload, X } from 'lucide-react';

interface ImageUploadProps {
  label: string;
  value?: string;
  onChange: (imageUrl: string) => void;
  onRemove?: () => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ label, value, onChange, onRemove }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(value);

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

  const handleRemove = () => {
    setPreview(undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onRemove?.();
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {preview ? (
        <div className="relative">
          <img src={preview} alt={label} className="w-full h-48 object-cover rounded-lg" />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition"
        >
          <Camera className="w-12 h-12 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">Tap to upload or take photo</p>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
