import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import './ImageUpload.css';

const ImageUpload = ({ onFilesSelected, maxFiles = 3, maxFileSize = 5 }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState('');

  const maxFileBytes = maxFileSize * 1024 * 1024; // Convert MB to bytes

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setError('');

    // Validate file count
    if (files.length > maxFiles) {
      setError(`Maximum ${maxFiles} images allowed. You selected ${files.length}`);
      return;
    }

    // Validate each file
    const validFiles = [];
    const newPreviews = [];

    for (const file of files) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError(`Invalid file type: ${file.name}. Only image files allowed.`);
        continue;
      }

      // Check file size
      if (file.size > maxFileBytes) {
        setError(
          `File too large: ${file.name}. Max size: ${maxFileSize}MB, Your file: ${(file.size / (1024 * 1024)).toFixed(2)}MB`
        );
        continue;
      }

      // Check for allowed formats
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError(
          `Unsupported format: ${file.name}. Allowed: JPG, PNG, WebP`
        );
        continue;
      }

      validFiles.push(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        newPreviews.push({
          url: event.target.result,
          file: file,
          name: file.name
        });
        if (newPreviews.length === validFiles.length) {
          setPreviews(newPreviews);
        }
      };
      reader.readAsDataURL(file);
    }

    setSelectedFiles(validFiles);
    onFilesSelected(validFiles);
  };

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
    onFilesSelected(newFiles);
  };

  return (
    <div className="image-upload">
      <div className="image-upload__input-wrapper">
        <label className="form-label">Attach Images (Optional)</label>
        <div className="image-upload__input-container">
          <input
            type="file"
            id="image-input"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="image-upload__input"
            disabled={selectedFiles.length >= maxFiles}
          />
          <label htmlFor="image-input" className="image-upload__label">
            <Upload size={20} />
            <span className="image-upload__text">
              Click to select images or drag and drop
            </span>
            <span className="image-upload__subtext">
              Max {maxFiles} images, {maxFileSize}MB each (JPG, PNG, WebP)
            </span>
          </label>
        </div>
      </div>

      {error && (
        <div className="image-upload__error">
          <p className="image-upload__error-text">{error}</p>
        </div>
      )}

      {previews.length > 0 && (
        <div className="image-upload__previews">
          <h4 className="image-upload__previews-title">
            Selected Images ({previews.length}/{maxFiles})
          </h4>
          <div className="image-upload__preview-grid">
            {previews.map((preview, index) => (
              <div key={index} className="image-upload__preview-item">
                <img
                  src={preview.url}
                  alt={`Preview ${index + 1}`}
                  className="image-upload__preview-image"
                />
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="image-upload__remove-button"
                  aria-label="Remove image"
                >
                  <X size={16} />
                </button>
                <span className="image-upload__file-name" title={preview.name}>
                  {preview.name.length > 15
                    ? preview.name.substring(0, 12) + '...'
                    : preview.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
