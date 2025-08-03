// components/ServerImage.tsx
import Image from "next/image";
import type { Media } from "@payload";
import { fetchImageFromId } from "@/lib/requests";

type Props = {
  data: Media | number;
  className?: string;
};

export default async function ServerImage({ data, className }: Props) {
  let resolvedImage: Media | null = null;

  try {
    if (typeof data === "number") {
      resolvedImage = await fetchImageFromId(data);
    } else if (data && typeof data === "object") {
      resolvedImage = data;
    }
  } catch (error) {
    console.error("Failed to load image:", error);
  }

  if (!resolvedImage?.url) {
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
}
