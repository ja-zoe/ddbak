"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, FreeMode, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper/types";
import { ChevronRight, ChevronLeft } from "lucide-react";

import "swiper/css";
import "swiper/css/thumbs";

interface Props {
  images: React.ReactNode[];
}

export default function ProductImagesCarousel({ images }: Props) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>();

  return (
    <div className="space-y-3 md:flex md:flex-row-reverse md:w-1/2 md:gap-3">
      <div className="relative flex items-center md:w-3/4 rounded-lg overflow-hidden shadow-2xl">
        <ChevronLeft
          size={40}
          className="absolute z-50 left-3 move-left text-white bg-black/30 rounded-full p-1 cursor-pointer hover:bg-black/50 transition-all"
        />
        <Swiper
          modules={[Thumbs, FreeMode, Navigation]}
          navigation={{ nextEl: ".move-right", prevEl: ".move-left" }}
          thumbs={{ swiper: thumbsSwiper }}
          className="w-full h-80 md:h-[500px] relative bg-gray-100"
        >
          {images.map((image, idx) => (
            <SwiperSlide key={idx} className="flex items-center justify-center">
              <div className="w-full h-full flex items-center justify-center">
                {image}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <ChevronRight
          size={40}
          className="absolute z-50 right-3 move-right text-white bg-black/30 rounded-full p-1 cursor-pointer hover:bg-black/50 transition-all"
        />
      </div>

      <Swiper
        modules={[Thumbs]}
        watchSlidesProgress
        onSwiper={setThumbsSwiper}
        className="w-full h-[100px] md:h-[500px] md:w-[120px]"
        slidesPerView={3}
        spaceBetween={8}
        breakpoints={{
          760: {
            direction: "vertical",
            slidesPerView: Math.min(images.length, 4),
          },
        }}
      >
        {images.map((image, idx) => (
          <SwiperSlide key={idx} className="cursor-pointer rounded-lg overflow-hidden opacity-60 hover:opacity-100 transition-opacity border-2 border-transparent hover:border-gold">
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              {image}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
