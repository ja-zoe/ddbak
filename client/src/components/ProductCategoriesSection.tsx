import { fetchProductCategories } from "@/lib/requests";
import ImageComponent from "./ImageComponent";
const ProductCategoriesSection = async () => {
  var ProductCategories;
  var error;
  try {
    ProductCategories = await fetchProductCategories();
  } catch (err) {
    error = "There was an error fetching site data. Please Try again later";
  }
  return (
    <div
      className="flex gap-8 px-4 justify-center flex-wrap"
      id="product-categories"
    >
      {error ? (
        <p></p>
      ) : (
        ProductCategories?.docs.map((val) => (
          <div className="flex flex-col items-center" key={val.id}>
            <a href={`/product-categories/${val.id}`}>
              <ImageComponent
                className="w-60 h-80 rounded-sm overflow-clip border-gold border-2"
                data={val.picture}
              />
            </a>
            <p className="text-lg">Shop for {val.name}</p>
          </div>
        ))
      )}
    </div>
  );
};
export default ProductCategoriesSection;
