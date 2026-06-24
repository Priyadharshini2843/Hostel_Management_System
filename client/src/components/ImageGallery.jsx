import React, { useState } from 'react';
import { X } from 'lucide-react';
import './ImageGallery.css';

const ImageGallery = ({ images = [] }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  if (!images || images.length === 0) {
    return null;
  }

  const handlePrevious = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleClose = () => {
    setSelectedIndex(null);
  };

  return (
    <>
      <div className="image-gallery">
        <h4 className="image-gallery__title">Attached Images ({images.length})</h4>
        <div className="image-gallery__grid">
          {images.map((image, index) => (
            <div
              key={index}
              className="image-gallery__thumbnail-wrapper"
              onClick={() => setSelectedIndex(index)}
            >
              <img
                src={image.url}
                alt={`Complaint image ${index + 1}`}
                className="image-gallery__thumbnail"
              />
              <div className="image-gallery__thumbnail-overlay">
                <span className="image-gallery__thumbnail-label">View</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedIndex !== null && (
        <div className="image-viewer-modal" onClick={handleClose}>
          <div className="image-viewer-modal__content" onClick={(e) => e.stopPropagation()}>
            <button
              className="image-viewer-modal__close"
              onClick={handleClose}
              aria-label="Close"
            >
              <X size={24} />
            </button>

            <div className="image-viewer-modal__main">
              <img
                src={images[selectedIndex].url}
                alt={`Full view ${selectedIndex + 1}`}
                className="image-viewer-modal__image"
              />

              {images.length > 1 && (
                <>
                  <button
                    className="image-viewer-modal__nav image-viewer-modal__nav--prev"
                    onClick={handlePrevious}
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  <button
                    className="image-viewer-modal__nav image-viewer-modal__nav--next"
                    onClick={handleNext}
                    aria-label="Next image"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            <div className="image-viewer-modal__footer">
              <span>
                Image {selectedIndex + 1} of {images.length}
              </span>
              {images[selectedIndex].originalName && (
                <span className="image-viewer-modal__filename">
                  {images[selectedIndex].originalName}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;
