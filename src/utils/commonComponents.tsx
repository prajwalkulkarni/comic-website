import React, { useEffect, useState } from "react";
import placeholderSrc from "../assets/image_not_available.jpg";
import { CloseOutlined } from "@ant-design/icons";
export const ProgressiveImageLoading = ({
  src,
  ...props
}: {
  src: string;
  className: string;
  alt?: string;
  style?: React.CSSProperties;
}) => {
  const [imgSrc, setImgSrc] = useState(placeholderSrc || src);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImgSrc(src);
    };
  }, [src]);

  return (
    <img
      {...{ src: imgSrc, ...props }}
      alt={props.alt || "Marvel Comic"}
      loading="lazy"
    />
  );
};

export const Error = ({ errorMessage }: { errorMessage?: string }) => {
  return (
    <p className="text-xl">
      <CloseOutlined /> {errorMessage || "Unknown error occured"}
    </p>
  );
};

export const SkeletonLoader = ({
  children,
  skeletoncount,
}: {
  children: React.ReactNode;
  skeletoncount: number;
}) => {
  return new Array(skeletoncount).fill(0).map((_, index) => {
    return <React.Fragment key={index}>{children}</React.Fragment>;
  });
};
