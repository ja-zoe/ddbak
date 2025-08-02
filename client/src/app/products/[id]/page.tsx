"use client";

import { useEffect, useState } from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import ImageComponent from "@/components/ImageComponent";
import ProductImagesCarousel from "@/components/ProductImagesCarousel";
import ProductForm from "@/components/ProductForm";
import type { Product } from "@payload";
import { fetchProductFromId } from "@/lib/requests";

export default function Page({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function loadData() {
      const fetched = await fetchProductFromId(parseInt(params.id));
      setProduct(fetched);
    }

    loadData();
  }, [params.id]);

  if (!product) return <p>Loading...</p>;

  const imageElements = product.pictures.map((picture) => (
    <ImageComponent
      key={picture.toString()}
      data={picture}
      className="w-full h-full object-cover"
    />
  ));

  return (
    <AuroraBackground className="bg-black/10 py-12">
      <div className=" absolute w-full h-full md:flex justify-center items-center gap-2">
        <ProductImagesCarousel images={imageElements} />
        <div className="p-3 space-y-2">
          <div>
            <p className="text-2xl">{product.name}</p>
            <p className="text-2xl">${product.price} USD</p>
            <p>{product.description}</p>
          </div>
          <ProductForm product={product} />
        </div>
      </div>
    </AuroraBackground>
  );
}
