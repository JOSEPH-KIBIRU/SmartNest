import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, ImagePlus } from 'lucide-react';

export default function CloudinaryUpload({ onUpload, multiple = false, maxFiles = 5 }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState([]);
  const inputRef = useRef(null);

  const uploadFiles = async (files) => {
    if (!files.length) return;
    
    setUploading(true);
    const urls = [];
    
    try {
      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
          alert(`Picha ${file.name} ni kubwa mno (max 5MB)`);
          continue;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
        formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: 'POST', body: formData }
        );

        const data = await res.json();
        
        if (data.secure_url) {
          urls.push(data.secure_url);
        } else {
          console.error('Upload failed:', data);
        }
      }

      const newPreviews = multiple ? [...preview, ...urls] : urls;
      setPreview(newPreviews);
      onUpload(multiple ? urls : urls[0]);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Pakia picha imeshindwa. Jaribu tena.');
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = maxFiles - preview.length;
    const filesToUpload = files.slice(0, remainingSlots);
    
    if (files.length > remainingSlots) {
      alert(`Unaweza kupakia bidhaa ${maxFiles} tu.`);
    }
    
    if (filesToUpload.length) uploadFiles(filesToUpload);
  };

  const removeImage = (index) => {
    const newPreviews = preview.filter((_, i) => i !== index);
    setPreview(newPreviews);
    onUpload(multiple ? newPreviews : newPreviews[0] || '');
  };

  return (
    <div className="space-y-3">
      <div 
        onClick={() => !uploading && inputRef.current?.click()}
        className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer transition-colors ${
          uploading ? 'bg-gray-50 cursor-not-allowed' : 'hover:border-emerald-500 hover:bg-emerald-50'
        }`}
      >
        <input 
          ref={inputRef} 
          type="file" 
          accept="image/*" 
          multiple={multiple} 
          onChange={handleChange} 
          className="hidden" 
          disabled={uploading}
        />
        
        {uploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 text-emerald-600 animate-spin mb-2" />
            <p className="text-sm text-gray-600">Inapakia picha...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <ImagePlus className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 font-medium">Bofya kupakia picha</p>
            <p className="text-xs text-gray-400 mt-1">JPEG, PNG mpaka 5MB</p>
            {multiple && <p className="text-xs text-gray-400">(Bidhaa {maxFiles} zilizobaki: {maxFiles - preview.length})</p>}
          </div>
        )}
      </div>

      {preview.length > 0 && (
        <div className={`grid gap-3 ${multiple ? 'grid-cols-4' : 'grid-cols-1'}`}>
          {preview.map((url, idx) => (
            <div key={idx} className="relative group">
              <img src={url} alt="" className="w-full h-24 object-cover rounded-lg" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}