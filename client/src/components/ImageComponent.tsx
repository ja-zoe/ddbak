"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Media } from "@payload";
import { fetchImageFromId } from "@/lib/requests";

type Props = {
  data: Media | number;
  className?: string;
};

const ImageComponent = ({ data, className }: Props) => {
  const [resolvedImage, setResolvedImage] = useState<Media | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const resolveImage = async () => {
      setLoading(true);
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
    return (
      <div className={className} style={{ position: "relative" }}>
        <div className="bg-gray-100 w-full h-full flex items-center justify-center">
          <span className="text-gray-400">Loading...</span>
        </div>
      </div>
    );
  }

  if (!resolvedImage || !resolvedImage.url) {
    return (
      <div className={className} style={{ position: "relative" }}>
        <div className="bg-gray-200 w-full h-full flex items-center justify-center">
          <span className="text-gray-500">Invalid image</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={className}
      style={!className?.includes("absolute") ? { position: "relative" } : {}}
    >
      <Image
        src={`https://utfs.io/f/${resolvedImage._key || resolvedImage.url}`}
        alt={resolvedImage.alt || "Uploaded image"}
        fill
        className="object-cover"
        unoptimized={process.env.NODE_ENV !== "production"}
      />
    </div>
  );
};

export default ImageComponent;
