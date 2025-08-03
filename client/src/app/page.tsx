"use client";
import HeroSection from "../components/HeroSection";
import ProductCategoriesSection from "../components/ProductCategoriesSection";
import Gallery from "@/components/Gallery";
import { AuroraBackground } from "@/components/ui/aurora-background";

export default function Home() {
  return (
    <AuroraBackground className="bg-black/10 h-max">
      <div className="space-y-10 relative pt-24 min-h-screen">
        <HeroSection />
        <ProductCategoriesSection />
        <Gallery />
      </div>
    </AuroraBackground>
  );
}
