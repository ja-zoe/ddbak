import HeroSection from "../components/HeroSection";
import ProductCategoriesSection from "../components/ProductCategoriesSection";
import Gallery from "@/components/Gallery";

export default function Home() {
  return (
    <div className="bg-white space-y-10">
      <HeroSection />
      <ProductCategoriesSection />
      <Gallery />
    </div>
  );
}
