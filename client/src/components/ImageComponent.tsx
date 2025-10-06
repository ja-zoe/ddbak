"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Media } from "@payload";
import { fetchImageFromId } from "@/lib/requests";
import SkeletonImage from "./skeletons/SkeletonImage";

type Props = {
  data: Media | number;
  className?: string;
};

const ImageComponent = ({ data, className }: Props) => {
  const [resolvedImage, setResolvedImage] = useState<Media | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const resolveImage = async () => {
      setLoading(true);
      setImageLoaded(false);
      if (typeof data === "number") {
        try {
          const img = await fetchImageFromId(data);
          if (isMounted) setResolvedImage(img);
        } catch {
          if (isMounted) setResolvedImage(null);
        } finally {
          if (isMounted) setLoading(false);
        }
      } else if (data && typeof data === "object") {
        setResolvedImage(data);
        setLoading(false);
      } else {
        setResolvedImage(null);
        setLoading(false);
      }
    };

    resolveImage();

    return () => {
      isMounted = false;
    };
  }, [data]);

  if (loading) {
    return <SkeletonImage className={className} />;
  }

  if (!resolvedImage || !resolvedImage.url) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center relative overflow-hidden`}>
        <span className="text-gray-500 text-sm">No image</span>
      </div>
    );
  }

  return (
    <div
      className={className}
      style={!className?.includes("absolute") ? { position: "relative" } : {}}
    >
      {!imageLoaded && <SkeletonImage className="absolute inset-0 z-10" />}
      <Image
        src={`https://utfs.io/f/${resolvedImage._key || resolvedImage.url}`}
        alt={resolvedImage.alt || "Uploaded image"}
        fill
        className={`object-cover transition-opacity duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
        unoptimized={process.env.NODE_ENV !== "production"}
        onLoad={() => setImageLoaded(true)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
};

export default ImageComponent;
