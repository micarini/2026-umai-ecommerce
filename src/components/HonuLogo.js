import Image from "next/image";

const ASPECT_RATIO = 521 / 226;

export default function HonuLogo({ variant = "onLight", height = 32, className = "" }) {
  const src = variant === "onDark" ? "/images/logo/logo-v2.svg" : "/images/logo/logo.svg";
  const width = Math.round(height * ASPECT_RATIO);

  return (
    <Image
      src={src}
      alt="Honu Bowls"
      width={width}
      height={height}
      className={className}
      priority
    />
  );
}
