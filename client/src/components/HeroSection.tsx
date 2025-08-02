"use Client";
import Image from "next/image";

const HeroSection = () => {
  return (
    <div className="space-y-5">
      <div className="flex justify-center px-5">
        <div className="w-full h-28 sm:h-40 md:h-52 lg:h-60 relative">
          <Image
            src={"/ddbak.png"}
            alt="Decorative Designs by AK"
            className="object-contain"
            fill
          />
        </div>
      </div>
      <div className="flex gap-2 text-white justify-center">
        <a
          className="px-2 py-1 border border-gold text-gold cursor-pointer"
          href="#gallery"
        >
          Gallery
        </a>
        <a
          className="px-2 py-1 bg-gold cursor-pointer"
          href="#product-categories"
        >
          Browse Offerings
        </a>
      </div>
    </div>
  );
};
export default HeroSection;
