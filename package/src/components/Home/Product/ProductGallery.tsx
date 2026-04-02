"use client";
import React, { useState } from "react";

interface ProductGalleryProps {
  images: { src: string }[];
  name: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, name }) => {
  const [selected, setSelected] = useState(0);
  const [imgError, setImgError] = useState(false);

  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 w-full items-center">
      {/* Main Image */}
      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-dark/10 bg-white flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgError ? '/images/fallback.jpg' : images[selected].src}
          alt={name}
          onError={() => setImgError(true)}
          className="object-contain w-full h-full p-4"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-2 w-full justify-center">
          {images.slice(0, 5).map((img, idx) => (
            <button
              key={idx}
              className={`w-20 h-20 rounded-lg overflow-hidden border bg-white transition-all duration-200 ${
                selected === idx ? 'border-primary ring-2 ring-primary' : 'border-dark/10'
              }`}
              onClick={() => { setSelected(idx); setImgError(false); }}
              aria-label={`Show image ${idx + 1}`}
              type="button"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={`Thumbnail ${idx + 1}`}
                className="object-contain w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;