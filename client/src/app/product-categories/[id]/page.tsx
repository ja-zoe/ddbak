"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ImageComponent from "@/components/ImageComponent";
import { AuroraBackground } from "@/components/ui/aurora-background";
import type { Product } from "@payload";
import { fetchProductCategoryFromId, fetchProductFromId } from "@/lib/requests";

export default function Page() {
  const params = useParams();
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    if (!params?.id) return;

    async function loadData() {
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
    }

    loadData();
  }, [params?.id]);

  if (products === null) return <p>Loading...</p>;
  if (products.length === 0)
    return <p>There are no products for this category yet</p>;

  return (
    <AuroraBackground className="bg-black/10 py-12">
      <div className="flex justify-center flex-wrap gap-10">
        {products.map((product, index) => (
          <a href={`/products/${product.id}`} key={index}>
            <div className="flex flex-col items-center hover:scale-105 duration-500 cursor-pointer transition-transform">
              <ImageComponent
                className="w-60 h-60"
                data={product.pictures[0]}
              />
              <p className="text-gray-700">
                {product.name.toLocaleUpperCase()}
              </p>
              <p>${product.price}</p>
            </div>
          </a>
        ))}
      </div>
    </AuroraBackground>
  );
}
