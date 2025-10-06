"use client";
import { fetchProducts } from "@/lib/requests";
import { useEffect, useState } from "react";
import ImageComponent from "./ImageComponent";
import type { Media } from "@payload";
import SkeletonImage from "./skeletons/SkeletonImage";

const Gallery = () => {
  const [images, setImages] = useState<(Media | number)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const products = await fetchProducts();
        const firstImagesFromProducts = products.docs
          .filter((product) => product.pictures?.length > 0)
          .map((product) => product.pictures[0]);
        setImages(firstImagesFromProducts);
      } catch (error) {
        console.error(error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (error) {
    return (
      <div className="flex justify-center p-4">
        <p className="text-red-500">Couldn&apos;t load gallery images. Please try again later.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center gap-5 flex-wrap w-full p-4" id="gallery">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <SkeletonImage key={i} className="w-36 h-36 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-5 flex-wrap w-full p-4" id="gallery">
      {images.map((image, index) => (
        <ImageComponent
          key={index}
          data={image}
          className="w-36 h-36 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
        />
      ))}
    </div>
  );
};

export default Gallery;
