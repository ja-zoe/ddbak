import Image from "next/image";
import { getServerURL } from "@/lib/utils";
import type { Media } from "@payload";
import { fetchImageFromId } from "@/lib/requests";

const ImageComponent = async ({
  data,
  className,
}: {
  data: Media | number; // Added string as possible type
  className?: string; // Made optional
}) => {
  const serverURL = getServerURL();

  // Handle cases where data is a number (ID) or string (URL)
  if (typeof data === "number") {
    const image = await fetchImageFromId(data);
    return (
      <div className={className} style={{ position: "relative" }}>
        <Image
          src={`${serverURL}${image.url}`} // Adjust this path as needed
          alt={image.alt}
          fill
          className="object-cover"
          unoptimized={process.env.NODE_ENV !== "production"} // Optimize in production
        />
      </div>
    );
  }

  // Handle Media object case
  if (data?.url) {
    return (
      <div className={className} style={{ position: "relative" }}>
        <Image
          src={`${serverURL}${data.url}`}
          alt={data.alt}
          fill
          className="object-cover"
          unoptimized={process.env.NODE_ENV !== "production"}
        />
      </div>
    );
  }

  // Fallback for invalid data
  return (
    <div className={className} style={{ position: "relative" }}>
      <div className="bg-gray-200 w-full h-full flex items-center justify-center">
        <span className="text-gray-500">Invalid image</span>
      </div>
    </div>
  );
};

export default ImageComponent;
