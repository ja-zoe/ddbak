"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AuroraBackground } from "@/components/ui/aurora-background";
import ImageComponent from "@/components/ImageComponent";
import ProductImagesCarousel from "@/components/ProductImagesCarousel";
import ProductForm from "@/components/ProductForm";
import type { Product } from "@payload";
import { fetchProductFromId } from "@/lib/requests";
import SkeletonProductDetail from "@/components/skeletons/SkeletonProductDetail";

export default function Page() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.id) return;

    async function loadData() {
      setLoading(true);
      try {
        const fetched = await fetchProductFromId(parseInt(params.id as string));
        setProduct(fetched);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [params?.id]);

  if (loading) {
    return (
      <AuroraBackground className="bg-black/10 py-12 min-h-screen">
        <SkeletonProductDetail />
      </AuroraBackground>
    );
  }

  if (!product) {
    return (
      <AuroraBackground className="bg-black/10 py-12 min-h-screen">
        <div className="flex justify-center items-center min-h-[60vh]">
          <p className="text-lg text-gray-600">Product not found</p>
        </div>
      </AuroraBackground>
    );
  }

  const imageElements = product.pictures.map((picture) => (
    <ImageComponent
      key={picture.toString()}
      data={picture}
      className="w-full h-full"
    />
  ));

  return (
    <AuroraBackground className="bg-black/10 py-12 min-h-full">
      <div className="space-y-5 w-full min-h-full md:flex justify-center items-center gap-5 pt-5 px-4">
        <ProductImagesCarousel images={imageElements} />
        <div className="p-6 space-y-6 md:w-1/3 bg-white/90 backdrop-blur-sm rounded-lg shadow-xl">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-3xl font-bold text-gold">${product.price} USD</p>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>
          <ProductForm product={product} />
        </div>
      </div>
    </AuroraBackground>
  );
}
