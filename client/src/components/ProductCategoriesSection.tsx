"use client";

import { useEffect, useState } from "react";
import { fetchProductCategories } from "@/lib/requests";
import ImageComponent from "./ImageComponent";
import { cn } from "@/lib/utils";
import type { ProductCategory } from "@payload";

const ProductCategoriesSection = () => {
  const [productCategories, setProductCategories] = useState<
    ProductCategory[] | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchProductCategories();
        setProductCategories(data.docs);
      } catch (err) {
        setError(
          "There was an error fetching site data. Please try again later."
        );
      }
    };

    getCategories();
  }, []);

  return (
    <div
      className="flex px-4 justify-center gap-5 flex-wrap"
      id="product-categories"
    >
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : productCategories ? (
        productCategories.map((val) => (
          <a href={`/product-categories/${val.id}`} key={val.id}>
            <div className="max-w-xs w-full group/card relative">
              <div
                className={cn(
                  "relative cursor-pointer overflow-hidden h-96 shadow-xl mx-auto flex flex-col justify-end p-4"
                )}
              >
                {/* Background image */}
                <ImageComponent
                  data={val.picture}
                  className="absolute inset-0 w-full h-full z-0"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black opacity-0 group-hover/card:opacity-20 transition duration-300 z-10" />
                {/* Text content */}
                <div className="relative z-20 text-white">
                  <h1 className="font-bold text-xl md:text-2xl">{val.name}</h1>
                  <p className="font-normal text-sm my-4">{val.description}</p>
                </div>
              </div>
            </div>
          </a>
        ))
      ) : (
        <p>Loading categories...</p>
      )}
    </div>
  );
};

export default ProductCategoriesSection;
