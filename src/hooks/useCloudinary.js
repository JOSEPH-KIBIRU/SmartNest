import { useState, useCallback } from 'react';

export function useCloudinary() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadImage = useCallback(async (file) => {
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );

      const data = await response.json();
      
      if (!data.secure_url) {
        throw new Error('Upload failed');
      }

      return data.secure_url;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  const uploadMultiple = useCallback(async (files) => {
    const urls = [];
    for (const file of files) {
      const url = await uploadImage(file);
      urls.push(url);
    }
    return urls;
  }, [uploadImage]);

  return { uploadImage, uploadMultiple, uploading, error };
}