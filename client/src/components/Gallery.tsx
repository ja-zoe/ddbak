"use client";
import { fetchProducts } from "@/lib/requests";
import { useEffect, useState } from "react";
import ImageComponent from "./ImageComponent";
import type { Media } from "@payload";

const Gallery = () => {
  const [images, setImages] = useState<(Media | number)[]>([]); // Initialize with empty array
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const products = await fetchProducts();
        const firstImagesFromProducts = products.docs
          .filter((product) => product.pictures?.length > 0) // Check if pictures exist
          .map((product) => product.pictures[0]);
        setImages(firstImagesFromProducts);
      } catch (error) {
        console.error(error);
        setError(true);
      }
    }
    loadData();
  }, []);

  if (error) {
    return (
      <div>
        <p>Couldn't load gallery images. Please try again later.</p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div>
        <p>Loading images...</p>
      </div>
    );
  }

  return (
    <div className="flex  justify-center gap-5 flex-wrap w-full p-4">
      {images.map((image, index) => (
        <ImageComponent
          key={index} // Added key prop
          data={image}
          className="w-36 h-20"
        />
      ))}
    </div>
  );
};

export default Gallery;
