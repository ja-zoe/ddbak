import { fetchProductCategoryFromId, fetchProductFromId } from "@/lib/requests";
import ImageComponent from "@/components/ImageComponent";

const Page = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const productCategory = await fetchProductCategoryFromId(parseInt(id));

  const relatedIds = productCategory.relatedProducts?.docs?.filter(
    (val): val is number => typeof val === "number"
  );

  const products = relatedIds
    ? await Promise.all(relatedIds.map((id) => fetchProductFromId(id)))
    : [];

  return (
    <div>
      {products.map((product, index) => (
        <div key={index} className="border border-gold rounded-sm">
          <ImageComponent className="w-60 h-80" data={product.picture} />
          <p>{product.name}</p>
        </div>
      ))}
    </div>
  );
};
export default Page;
