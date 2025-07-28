import { fetchProductFromId } from "@/lib/requests";
import ImageComponent from "@/components/ImageComponent";
import ProductImagesCarousel from "@/components/ProductImagesCarousel";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    <div className="p-2">
      <ProductImagesCarousel images={imageElements} />
      <div className="p-3 space-y-5">
        <div className="flex justify-between items-center">
          <p className="text-2xl">{product.name}</p>
          <p className="text-2xl">${product.price} USD</p>
        </div>
        <div className="flex gap-1">
          {product.colors?.map((color) => (
            <Tooltip>
              <TooltipTrigger>
                <div
                  className="w-5 h-5 rounded-full"
                  style={{ backgroundColor: color.color }}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{color.colorName}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
