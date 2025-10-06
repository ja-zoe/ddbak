"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ImageComponent from "@/components/ImageComponent";
import { AuroraBackground } from "@/components/ui/aurora-background";
import type { Product } from "@payload";
import { fetchProductCategoryFromId, fetchProductFromId } from "@/lib/requests";
import SkeletonCard from "@/components/skeletons/SkeletonCard";

export default function Page() {
  const params = useParams();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.id) return;

    async function loadData() {
      setLoading(true);
      try {
        const category = await fetchProductCategoryFromId(
          parseInt(params.id as string)
        );
        const docs = category.relatedProducts?.docs;

        if (!docs || docs.length === 0) {
          setProducts([]);
          return;
        }

        const resolved =
          typeof docs[0] === "number"
            ? await Promise.all(
                docs.map((id) => fetchProductFromId(id as number))
              )
            : (docs as Product[]);

        setProducts(resolved);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [params?.id]);

  if (loading) {
    return (
      <AuroraBackground className="bg-black/10 py-12 min-h-screen">
        <div className="flex justify-center flex-wrap gap-10 pt-20">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </AuroraBackground>
    );
  }

  if (products?.length === 0) {
    return (
      <AuroraBackground className="bg-black/10 py-12 min-h-screen">
        <div className="flex justify-center items-center min-h-[60vh]">
          <p className="text-lg text-gray-600">There are no products for this category yet</p>
        </div>
      </AuroraBackground>
    );
  }

  return (
    <AuroraBackground className="bg-black/10 py-12 min-h-screen">
      <div className="flex justify-center flex-wrap gap-10 pt-20 px-4">
        {products?.map((product, index) => (
          <a href={`/products/${product.id}`} key={index} className="group">
            <div className="flex flex-col items-center space-y-3">
              <div className="relative overflow-hidden rounded-lg shadow-lg group-hover:shadow-2xl transition-all duration-300">
                <ImageComponent
                  className="w-60 h-60 group-hover:scale-110 transition-transform duration-300"
                  data={product.pictures[0]}
                />
              </div>
              <div className="text-center space-y-1">
                <p className="text-gray-800 font-semibold tracking-wide">
                  {product.name.toLocaleUpperCase()}
                </p>
                <p className="text-xl font-bold text-gold">${product.price}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </AuroraBackground>
  );
}
