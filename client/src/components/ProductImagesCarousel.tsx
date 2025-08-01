"use client";

import React, { useState, useRef } from "react";
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
    <div className="space-y-1 md:flex md:flex-row-reverse md:w-1/2">
      {/* Main Swiper -> pass thumbs swiper instance */}
      <div className="relative flex items-center md:w-3/4">
        <ChevronLeft
          size={50}
          className="absolute z-50 left-5 move-left text-white"
        />
        <Swiper
          modules={[Thumbs, FreeMode, Navigation]}
          navigation={{ nextEl: ".move-right", prevEl: ".move-left" }}
          thumbs={{ swiper: thumbsSwiper }}
          className="w-full h-80 md:h-[500px] relative"
        >
          {images.map((image) => (
            <SwiperSlide>{image}</SwiperSlide>
          ))}
        </Swiper>
        <ChevronRight
          size={50}
          className="absolute z-50 right-5 move-right text-white"
        />
      </div>

      {/* Thumbs Swiper -> store swiper instance */}
      {/* It is also required to set watchSlidesProgress prop */}
      <Swiper
        modules={[Thumbs]}
        watchSlidesProgress
        onSwiper={setThumbsSwiper}
        className="w-full h-[100px] md:h-[400px] md:w-[100px]"
        slidesPerView={3}
        spaceBetween={3}
        breakpoints={{
          760: {
            direction: "vertical",
            slidesPerView: Math.min(images.length, 4),
          },
        }}
      >
        {images.map((image) => (
          <SwiperSlide>{image}</SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
