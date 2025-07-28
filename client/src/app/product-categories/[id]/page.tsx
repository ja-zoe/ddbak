import { fetchProductCategoryFromId, fetchProductFromId } from "@/lib/requests";
import ImageComponent from "@/components/ImageComponent";
import type { Product } from "@payload";

const Page = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const productCategory = await fetchProductCategoryFromId(parseInt(id));

  const docs = productCategory.relatedProducts?.docs;

  if (!docs || docs.length === 0) {
    return <p>There are no products for this category yet</p>;
  }

  let products: Product[];

  if (typeof docs[0] === "number") {
    // all docs are assumed to be IDs
    products = await Promise.all(
      docs.map(async (id) => await fetchProductFromId(id as number))
    );
  } else {
    // docs are already Product[]
    products = docs as Product[];
  }

  return (
    <div className="flex justify-center flex-wrap gap-10">
      {products.map((product, index) => (
        <a href={`/products/${product.id}`} key={index}>
          <div className="flex flex-col items-center hover:scale-105 duration-500 cursor-pointer transition-transform">
            <ImageComponent className="w-60 h-60" data={product.pictures[0]} />
            <p className="text-gray-700">{product.name.toLocaleUpperCase()}</p>
            <p className="">${product.price}</p>
          </div>
        </a>
      ))}
    </div>
  );
};

export default Page;
