import { fetchProductFromId } from "@/lib/requests";
import ImageComponent from "@/components/ImageComponent";
import ProductImagesCarousel from "@/components/ProductImagesCarousel";
import ProductForm from "@/components/ProductForm";

const Page = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const product = await fetchProductFromId(parseInt(id));

  const imageElements = product.pictures.map((picture) => (
    <ImageComponent
      key={picture.toString()}
      data={picture}
      className="w-full h-full object-cover"
    />
  ));

  return (
    <div className="p-2 md:flex justify-center items-center gap-2">
      <ProductImagesCarousel images={imageElements} />
      <div className="p-3 space-y-2">
        <div className="">
          <p className="text-2xl">{product.name}</p>
          <p className="text-2xl">${product.price} USD</p>
          <p>{product.description}</p>
        </div>
        <ProductForm product={product} />
      </div>
    </div>
  );
};

export default Page;
